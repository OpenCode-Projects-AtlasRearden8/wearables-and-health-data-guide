#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import process from "node:process";

const repoRoot = process.cwd();
const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), "manual-site-test-"));
const copyRoot = path.join(workRoot, "clean-copy");

const tests = [];
function addTest(name, fn) {
  tests.push({ name, fn, result: null });
}

function pass(name, detail) {
  console.log(`  ok  ${name}${detail ? " — " + detail : ""}`);
}
function fail(name, detail) {
  console.log(`  FAIL ${name}${detail ? " — " + detail : ""}`);
}

function run(cmdArgs, cwd, env) {
  const r = spawnSync(process.execPath, cmdArgs, { cwd, env, encoding: "utf8" });
  return { status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" };
}

function listFilesRecursive(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else out.push(full);
    }
  }
  return out;
}

function siteChecksums(siteDir) {
  const map = {};
  for (const file of listFilesRecursive(siteDir)) {
    map[path.relative(siteDir, file)] = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
  }
  return map;
}

addTest("no package dependencies needed", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  for (const key of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    if (pkg[key] && Object.keys(pkg[key]).length > 0) {
      return `${key} is not empty; this template builds with Node only`;
    }
  }
  return "";
});

addTest("every import is Node built-in or local", () => {
  const files = [];
  for (const dir of [repoRoot, path.join(repoRoot, "scripts")]) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".mjs")) files.push(path.join(dir, f));
    }
  }
  const offenders = [];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const m of text.matchAll(/(?:\bimport\b[^\n]*?\bfrom\s+|\bimport\s*\(\s*|\brequire\s*\(\s*)["']([^"']+)["']/g)) {
      const spec = m[1];
      if (!/^(node:|\.\.?\/)/.test(spec)) offenders.push(`${path.relative(repoRoot, file)} imports "${spec}"`);
    }
  }
  return offenders.join("; ");
});

addTest("build works from a clean copy (no .git, no node_modules)", () => {
  const skip = new Set([".git", "node_modules", "site"]);
  fs.mkdirSync(copyRoot, { recursive: true });
  for (const entry of fs.readdirSync(repoRoot, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    fs.cpSync(path.join(repoRoot, entry.name), path.join(copyRoot, entry.name), { recursive: true });
  }
  const r = run(["build.mjs", "--out", "site", "--quiet"], copyRoot);
  if (r.status !== 0) return `node build.mjs exited ${r.status}: ${r.stderr.trim().slice(0, 300)}`;
  const expected = ["index.html", "assets/styles.css", "assets/site.js", ".nojekyll"];
  const missing = [...expected, ...chaptersIn(copyRoot).map((c) => `${c}.html`)].filter((f) => !fs.existsSync(path.join(copyRoot, "site", f)));
  return missing.length ? `missing files in built copy: ${missing.join(", ")}` : "";
});

function chaptersIn(dir) {
  const docs = path.join(dir, "docs");
  return fs
    .readdirSync(docs)
    .filter((f) => f.toLowerCase().endsWith(".md") && !f.startsWith("_"))
    .sort()
    .map((f) => path.basename(f, ".md"));
}

addTest("built pages load zero remote resources (fully offline)", () => {
  const bad = [];
  for (const file of listFilesRecursive(path.join(copyRoot, "site"))) {
    if (!file.endsWith(".html")) continue;
    const html = fs.readFileSync(file, "utf8");
    const rel = path.relative(copyRoot, file);
    for (const m of html.matchAll(/<(?:script|link|img|source|iframe)\b[^>]*>/gi)) {
      const tag = m[0];
      if (/(src|href)=["'](\w+:|\/\/)/i.test(tag)) bad.push(`${rel}: remote resource ${tag.slice(0, 90)}`);
    }
    if (/<link[^>]*href=["']\//.test(html) || /<script[^>]*src=["']\//.test(html)) {
      bad.push(`${rel}: absolute /-rooted asset URL (breaks GitHub Pages subfolders)`);
    }
  }
  return bad.join("; ");
});

addTest("build is deterministic (two runs, identical bytes)", () => {
  const first = siteChecksums(path.join(copyRoot, "site"));
  const r = run(["build.mjs", "--out", "site", "--quiet"], copyRoot);
  if (r.status !== 0) return `second build exited ${r.status}`;
  const second = siteChecksums(path.join(copyRoot, "site"));
  const keys = new Set([...Object.keys(first), ...Object.keys(second)]);
  const diffs = [...keys].filter((k) => first[k] !== second[k]);
  return diffs.length ? `files changed between builds: ${diffs.join(", ")}` : "";
});

addTest("every page has large-print, sidebar and skip-link affordances", () => {
  const need = ['id="large-print-btn"', "aria-pressed", 'class="skip-link" href="#main"', 'class="toc"', 'id="print-btn"'];
  const htmls = listFilesRecursive(path.join(copyRoot, "site")).filter((f) => f.endsWith(".html"));
  const bad = [];
  for (const file of htmls) {
    const html = fs.readFileSync(file, "utf8");
    for (const s of need) {
      if (!html.includes(s)) bad.push(`${path.relative(copyRoot, file)}: missing ${s}`);
    }
  }
  const css = fs.readFileSync(path.join(copyRoot, "site", "assets", "styles.css"), "utf8");
  for (const s of ["@media print", '[data-large-print="on"]', "position: sticky"]) {
    if (!css.includes(s)) bad.push(`assets/styles.css: missing ${s}`);
  }
  return bad.join("; ");
});

addTest("chapter checklist passes on the built copy", () => {
  const r = run(["scripts/check-chapters.mjs"], copyRoot);
  if (r.status !== 0) return `check-chapters exited ${r.status}: ${(r.stdout + r.stderr).trim().slice(0, 400)}`;
  return "";
});

let exit = 0;
console.log(`Offline test suite (clean-copy build in ${workRoot})`);
console.log("");
for (const t of tests) {
  try {
    const detail = t.fn();
    if (detail) {
      fail(t.name, detail);
      exit = 1;
    } else {
      t.result = "pass";
      pass(t.name);
    }
  } catch (err) {
    fail(t.name, err.message);
    exit = 1;
  }
}
console.log("");
console.log(exit === 0 ? `All ${tests.length} offline tests passed. This repo clones and builds with no network.` : "Some tests failed. Details above.");
fs.rmSync(workRoot, { recursive: true, force: true });
process.exit(exit);
