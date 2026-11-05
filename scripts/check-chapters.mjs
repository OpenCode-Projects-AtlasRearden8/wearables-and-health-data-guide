#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const docsDir = path.join(root, "docs");
const siteDir = path.join(root, "site");
const assetsDir = path.join(siteDir, "assets");

function readChapters() {
  if (!fs.existsSync(docsDir)) {
    console.error(`check: chapter folder "docs/" not found in ${root}`);
    process.exit(1);
  }
  return fs
    .readdirSync(docsDir)
    .filter((f) => f.toLowerCase().endsWith(".md") && !f.startsWith("_"))
    .sort();
}

function firstHeadingTitle(file) {
  const text = fs.readFileSync(path.join(docsDir, file), "utf8");
  const m = text.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}

const results = [];
function record(ok, label, detail) {
  results.push({ ok, label, detail });
}

function esc(s) {
  return String(s)
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

const problems = [];

const chapters = readChapters();
record(chapters.length > 0, "docs/", chapters.length > 0 ? `docs/ lists ${chapters.length} chapter file(s)` : "no Markdown chapters found in docs/");

for (const file of chapters) {
  const base = path.basename(file, ".md");
  const page = path.join(siteDir, `${base}.html`);
  const title = firstHeadingTitle(file);
  if (!fs.existsSync(page)) {
    record(false, file, `missing built page site/${base}.html — run "node build.mjs"`);
    continue;
  }
  const html = fs.readFileSync(page, "utf8");
  const checks = [
    { ok: title.length > 0 && html.includes(`>${esc(title)}<`), desc: "built page carries the chapter title", detail: `title "${title}" not found in site/${base}.html` },
    {
      ok: /<h1 id="/.test(html),
      desc: "built page has a level-1 heading",
      detail: "no h1 with id in built page",
    },
    {
      ok: html.includes('class="sidebar"'),
      desc: "built page has the contents sidebar",
      detail: "sidebar markup missing",
    },
    {
      ok: html.includes('id="large-print-btn"'),
      desc: "built page has the large-print toggle",
      detail: "large-print button missing",
    },
    {
      ok: html.includes('href="assets/styles.css"') && html.includes('src="assets/site.js"'),
      desc: "built page loads local styles and script",
      detail: "asset links missing or not local-relative",
    },
  ];
  const failed = checks.filter((c) => !c.ok);
  for (const f of failed) problems.push(`site/${base}.html: ${f.detail || f.desc}`);
  record(failed.length === 0, file, failed.length === 0 ? `site/${base}.html — all page checks pass` : failed.map(f => f.detail).join("; "));
}

const homePath = path.join(siteDir, "index.html");
if (!fs.existsSync(homePath)) {
  record(false, "site/index.html", "missing — run \"node build.mjs\"");
  problems.push("site/index.html: missing home page");
} else {
  const home = fs.readFileSync(homePath, "utf8");
  const missingLinks = chapters
    .filter((f) => !home.includes(`href="${path.basename(f, ".md")}.html"`))
    .map((f) => `${f} -> ${path.basename(f, ".md")}.html`);
  record(
    missingLinks.length === 0 && chapters.length > 0,
    "site/index.html",
    missingLinks.length === 0
      ? `home page links all ${chapters.length} chapter(s)`
      : `home page is missing links for: ${missingLinks.join(", ")}`
  );
  if (missingLinks.length) problems.push(`site/index.html: no home link for ${missingLinks.join(", ")}`);
}

let assetsOk = fs.existsSync(path.join(assetsDir, "styles.css")) && fs.existsSync(path.join(assetsDir, "site.js"));
record(assetsOk, "site/assets/", "styles.css and site.js copied with the build");
if (!assetsOk) problems.push("site/assets: styles.css and site.js must exist after a build");

const cssPath = path.join(assetsDir, "styles.css");
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, "utf8");
  const hasPrint = css.includes("@media print");
  const hasLarge = css.includes('[data-large-print="on"]');
  record(hasPrint, "assets/styles.css", hasPrint ? "print-friendly rules present" : "@media print rules missing (print-friendly pages won't work)");
  if (!hasPrint) problems.push("assets/styles.css: @media print block missing");
  record(hasLarge, "assets/styles.css", hasLarge ? "large-print rules present" : "large-print rules missing");
  if (!hasLarge) problems.push('assets/styles.css: [data-large-print="on"] rules missing');
}

const skipped = fs.existsSync(docsDir)
  ? fs.readdirSync(docsDir).filter((f) => f.toLowerCase().endsWith(".md") && f.startsWith("_"))
  : [];

console.log("Chapter checklist");
console.log(`docs/ (${root === "" ? "." : "repo"}) -> site/`);
console.log("");
for (const r of results) {
  console.log(`  [${r.ok ? "x" : " "}] ${r.ok ? r.label : r.label + " — " + r.detail}`);
}
if (skipped.length) {
  console.log("");
  console.log(`  skipped as drafts (filenames start with "_"): ${skipped.join(", ")}`);
}

if (problems.length) {
  console.log("");
  console.log(`FAILED: ${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  console.log("");
  console.log(`Fix the issues above, or run "node build.mjs" first if you have not built yet.`);
  process.exit(1);
} else {
  console.log("");
  console.log(`All good: every Markdown chapter (${chapters.length}/${chapters.length}) built a complete page, home page links them all, and styles are in place.`);
  process.exit(0);
}
