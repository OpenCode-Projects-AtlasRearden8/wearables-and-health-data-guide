#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();

function argValue(flag, fallback) {
  const argv = process.argv.slice(2);
  const i = argv.indexOf(flag);
  if (i !== -1 && argv[i + 1]) return argv[i + 1];
  return fallback;
}
const quiet = process.argv.slice(2).includes("--quiet");
const srcDir = path.resolve(rootDir, argValue("--src", "docs"));
const outDir = path.resolve(rootDir, argValue("--out", "site"));
const assetsDir = path.resolve(rootDir, "assets");

function esc(s) {
  return String(s)
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}
function plainText(s) {
  return String(s)
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}
function slugify(s) {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return base || "section";
}

const buildWarnings = new Set();

function markdownToHtml(md, chapters, state) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;

  function inline(text, chapterBases) {
    let s = esc(text);
    const codes = [];
    s = s.replace(/`([^`]+)`/g, (_, code) => {
      codes.push(`<code>${code}</code>`);
      return `\u0000${codes.length - 1}\u0000`;
    });
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => {
      if (src.toLowerCase().endsWith(".md")) src = src.replace(/\.md$/i, ".html");
      return `<img src="${src}" alt="${alt}" loading="lazy">`;
    });
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      if (/\.md$/i.test(href) && !/^https?:/i.test(href)) {
        const base = href.replace(/\.md$/i, "");
        if (chapterBases.includes(base)) {
          return `<a href="${base}.html">${label}</a>`;
        }
        state.warnings.push(`chapter link "${href}" does not match any file in the docs folder`);
        buildWarnings.add(`${href} (${state.file || "?"})`);
        return `<a href="${href}">${label}</a>`;
      }
      const external = /^https?:\/\//i.test(href);
      const attr = external ? ' rel="noopener"' : "";
      return `<a href="${href}"${attr}>${label}</a>`;
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    s = s.replace(/\u0000(\d+)\u0000/g, (_, n) => codes[Number(n)]);
    return s;
  }

  function heading(level, rawText) {
    const text = inline(rawText, state.chapterBases);
    let id = slugify(plainText(rawText));
    if (state.usedIds.has(id)) {
      let n = 2;
      while (state.usedIds.has(`${id}-${n}`)) n++;
      id = `${id}-${n}`;
    }
    state.usedIds.add(id);
    if (level >= 2 && level <= 3) {
      state.outline.push({ level, text: plainText(rawText), id });
    }
    return `<h${level} id="${id}">${text}</h${level}>`;
  }

  function parseTableRow(line) {
    let row = line.trim();
    if (row.startsWith("|")) row = row.slice(1);
    if (row.endsWith("|")) row = row.slice(0, -1);
    return row.split("|").map((c) => c.trim());
  }

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }

    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      const cls = lang ? ` class="language-${slugify(lang)}"` : "";
      out.push(`<pre><code${cls}>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^\s*(---+|\*\*\*+|___+)\s*$/.test(line)) {
      out.push("<hr>");
      i++;
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      out.push(heading(h[1].length, h[2]));
      i++;
      continue;
    }

    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?\s*:?-{1,}[\s|:-]*\|?\s*$/.test(lines[i + 1]) &&
      lines[i + 1].includes("-")
    ) {
      const head = parseTableRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && !/^\s*$/.test(lines[i])) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      let html = '<div class="table-wrap"><table><thead><tr>';
      for (const cell of head) html += `<th>${inline(cell, state.chapterBases)}</th>`;
      html += "</tr></thead><tbody>";
      for (const row of rows) {
        html += "<tr>";
        for (const cell of row) html += `<td>${inline(cell, state.chapterBases)}</td>`;
        html += "</tr>";
      }
      html += "</tbody></table></div>";
      out.push(html);
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      const inner = markdownToHtml(buf.join("\n"), chapters, state);
      out.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    const item = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
    if (item) {
      const items = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
        if (!m) break;
        const indent = m[1].length;
        items.push({
          level: indent >= 2 ? 1 : 0,
          ordered: /\d/.test(m[2]),
          text: m[3],
        });
        i++;
      }
      out.push(buildList(items, 0));
      continue;
    }

    const buf = [line];
    i++;
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^\s*>\s?/.test(lines[i]) &&
      !/^\s*(---+|\*\*\*+|___+)\s*$/.test(lines[i]) &&
      !/^(\s*)([-*+]|\d+[.)])\s+/.test(lines[i]) &&
      !/^\s*\|?[\s:|-]*-[\s:|-]*\|?\s*$/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(buf.join(" "), state.chapterBases)}</p>`);
  }

  return out.join("\n");

  function buildList(items, level) {
    let html = "";
    let idx = 0;
    while (idx < items.length) {
      const here = items[idx];
      if (here.level !== level) {
        idx++;
        continue;
      }
      const ordered = here.ordered;
      const startTag = ordered ? "<ol>" : "<ul>";
      const endTag = ordered ? "</ol>" : "</ul>";
      let run = "";
      while (idx < items.length && items[idx].level === level && items[idx].ordered === ordered) {
        run += `<li>${inline(items[idx].text, state.chapterBases)}`;
        const subStart = idx + 1;
        const sub = [];
        while (idx + 1 < items.length && items[idx + 1].level > level) {
          sub.push(items[idx + 1]);
          idx++;
        }
        if (sub.length) run += buildList(sub, level + 1);
        run += "</li>";
        idx++;
      }
      html += `${startTag}${run}${endTag}`;
    }
    return html;
  }
}

function parseFrontMatter(md) {
  const textLines = md.replace(/\r\n?/g, "\n").split("\n");
  if (textLines[0] !== "---") return { front: {}, body: md };
  let close = -1;
  for (let i = 1; i < textLines.length; i++) {
    if (textLines[i] === "---") {
      close = i;
      break;
    }
  }
  if (close === -1) return { front: {}, body: md };
  const front = {};
  for (const line of textLines.slice(1, close)) {
    const m = line.match(/^([A-Za-z][\w-]*)\s*:\s*(.*)$/);
    if (m) front[m[1].toLowerCase()] = m[2].trim();
  }
  return { front, body: textLines.slice(close + 1).join("\n") };
}

function readChapters(cfg) {
  if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
    console.error(`Build failed: chapter folder "${path.relative(rootDir, srcDir)}" not found.`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.toLowerCase().endsWith(".md") && !f.startsWith("_"))
    .sort();
  if (files.length === 0) {
    console.error(`Build failed: no Markdown chapters found in "${path.relative(rootDir, srcDir)}".`);
    process.exit(1);
  }
  const chapterBases = files.map((f) => path.basename(f, ".md"));
  const chapters = [];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
    const { front, body } = parseFrontMatter(raw);
    const titleMatch = body.match(/^#\s+(.+)$/m);
    if (!titleMatch) {
      console.error(`Build failed: "${file}" has no "# Chapter Title" heading. Every chapter needs one.`);
      process.exit(1);
    }
    const title = plainText(titleMatch[1]);
    let blurb = front.blurb || "";
    if (!blurb) {
      const para = body
        .split(/\n\s*\n/)
        .map((b) => b.trim())
        .find((b) => b && !b.startsWith("#") && !b.startsWith("```"));
      blurb = para ? plainText(para).slice(0, 190) : "";
    }
    const state = { chapterBases, usedIds: new Set(), outline: [], warnings: [], file };
    const html = markdownToHtml(body, chapters, state);
    chapters.push({
      file,
      base: path.basename(file, ".md"),
      title,
      blurb,
      html,
      outline: state.outline,
    });
  }
  return chapters;
}

function bigPrintBoot() {
  return `<script>(function(){try{if(localStorage.getItem("mdst-large-print")==="1"){document.documentElement.setAttribute("data-large-print","on")}}catch(e){}})();</script>`;
}

function sidebarHtml(cfg, chapters, current) {
  const items = chapters
    .map((c, idx) => {
      const num = (idx + 1).toString();
      const href = `${c.base}.html`;
      const label = `${num}. ${esc(c.title)}`;
      const cur = current && current.base === c.base ? ' aria-current="page"' : "";
      return `<li><a href="${href}"${cur}>${label}</a></li>`;
    })
    .join("\n");
  let onPage = "";
  if (current && current.outline.length) {
    const links = current.outline
      .map((o) => `<li class="outline-l${o.level}"><a href="#${o.id}">${esc(o.text)}</a></li>`)
      .join("\n");
    onPage = `<div class="page-toc"><h2 class="side-title">On this page</h2><ul>${links}</ul></div>`;
  }
  return `<aside class="sidebar" aria-label="Book contents">
  <p class="side-title"><a class="book-home" href="index.html">${esc(cfg.title)}</a></p>
  <p class="byline">by ${esc(cfg.author)}</p>
  <nav class="toc" aria-label="Table of contents">
    <h2 class="side-title">Contents</h2>
    <ul>${items}</ul>
  </nav>
  ${onPage}
</aside>`;
}

function headerHtml(cfg) {
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-head">
  <div class="wrap head-in">
    <a class="brand" href="index.html">${esc(cfg.title)}</a>
    <div class="head-tools">
      <button id="print-btn" class="tool-btn" type="button" title="Print this page or save as PDF">Print</button>
      <button id="large-print-btn" class="tool-btn" type="button" aria-pressed="false" title="Switch to large-print reading">Large print</button>
    </div>
  </div>
</header>`;
}

function footerHtml(cfg) {
  return `<footer class="site-foot">
  <div class="wrap">
    <p>&copy; ${esc(String(cfg.year))} ${esc(cfg.publisher)} &middot; ${esc(cfg.title)} by ${esc(cfg.author)}</p>
    <p class="foot-note">This manual is education only &mdash; never medical advice. The site has no trackers, needs no network, and works from a plain folder of files. Part of a beginner-guide family by Asdale Dynamics, LLC.</p>
  </div>
</footer>`;
}

function pagerHtml(chapters, index) {
  const prev = chapters[index - 1];
  const next = chapters[index + 1];
  const prevHtml = prev
    ? `<a class="pager-link prev" href="${prev.base}.html"><span class="pager-dir">Previous</span><span class="pager-title">${esc(prev.title)}</span></a>`
    : `<span class="pager-link prev" aria-hidden="true"><span class="pager-dir">Previous</span></span>`;
  const nextHtml = next
    ? `<a class="pager-link next" href="${next.base}.html"><span class="pager-dir">Next</span><span class="pager-title">${esc(next.title)}</span></a>`
    : `<span class="pager-link next" aria-hidden="true"><span class="pager-dir">Next</span></span>`;
  return `<nav class="pager" aria-label="Chapters">${prevHtml}${nextHtml}</nav>`;
}

function pageHtml({ cfg, chapters, current, title, articleHtml, kicker }) {
  const navLinks = sidebarHtml(cfg, chapters, current);
  const metaDesc = current ? `${title} — ${cfg.subtitle}` : cfg.description;
  return `<!DOCTYPE html>
<html lang="${esc(cfg.language)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="${esc(metaDesc)}">
<title>${esc(title)} &middot; ${esc(cfg.title)}</title>
<link rel="stylesheet" href="assets/styles.css">
${bigPrintBoot()}
<script src="assets/site.js" defer></script>
</head>
<body>
${headerHtml(cfg)}
<div class="wrap layout">
${navLinks}
<main id="main" class="article" tabindex="-1">
${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ""}
${articleHtml}
</main>
</div>
${current ? pagerHtml(chapters, chapters.findIndex((c) => c.base === current.base)) : ""}
${footerHtml(cfg)}
</body>
</html>`;
}

function homeHtml(cfg, bookCfg, chapters) {
  const cards = chapters
    .map((c, idx) => {
      return `<a class="card" href="${c.base}.html">
      <span class="card-num">Chapter ${idx + 1}</span>
      <span class="card-title">${esc(c.title)}</span>
      <span class="card-blurb">${esc(c.blurb)}</span>
      <span class="card-go">Read chapter &rarr;</span>
    </a>`;
    })
    .join("\n");
  const article = `<h1>${esc(cfg.title)}</h1>
<p class="subtitle">${esc(cfg.subtitle)}</p>
<p>${esc(cfg.description)}</p>
<p><a class="btn" href="${chapters[0].base}.html">Start with chapter 1 &rarr;</a></p>
<h2 id="chapters">Chapters</h2>
<div class="cards">
${cards}
</div>
<h2 id="reading-tips">Reading tips</h2>
<ul>
  <li><strong>Large print:</strong> use the <em>Large print</em> button at the top of any page. Your choice is remembered.</li>
  <li><strong>Printing:</strong> the <em>Print</em> button gives you a clean page or PDF, with no sidebars or buttons.</li>
  <li><strong>Offline:</strong> once this folder is on your computer, everything works without internet.</li>
</ul>`;
  return pageHtml({
    cfg,
    chapters,
    current: null,
    title: "Contents",
    articleHtml: article,
    kicker: "A beginner's manual",
  });
}

function chapterArticleHtml(chapter, idx) {
  const kicker = `Chapter ${idx + 1}`;
  return chapter.html;
}

function main() {
  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(path.join(rootDir, "book.json"), "utf8"));
  } catch (err) {
    console.error(`Build failed: could not read book.json (${err.message}).`);
    process.exit(1);
  }
  for (const key of ["title", "author", "publisher", "year", "language", "description"]) {
    if (!(key in cfg)) {
      console.error(`Build failed: book.json is missing "${key}".`);
      process.exit(1);
    }
  }

  const chapters = readChapters(cfg);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(outDir, "assets"), { recursive: true });
  fs.cpSync(assetsDir, path.join(outDir, "assets"), { recursive: true });
  fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

  fs.writeFileSync(path.join(outDir, "index.html"), homeHtml(cfg, cfg, chapters));
  chapters.forEach((chapter, idx) => {
    const html = pageHtml({
      cfg,
      chapters,
      current: chapter,
      title: chapter.title,
      articleHtml: chapterArticleHtml(chapter, idx),
      kicker: `Chapter ${idx + 1}`,
    });
    fs.writeFileSync(path.join(outDir, `${chapter.base}.html`), html);
  });

  if (!quiet) {
    if (buildWarnings.size) {
      console.log("Notes:");
      for (const w of buildWarnings) console.log(`  ! ${w}`);
      console.log("");
    }
    console.log(`Book: ${cfg.title} by ${cfg.author}`);
    console.log(`Source chapters: ${path.relative(rootDir, srcDir)}/`);
    console.log(`Built site:      ${path.relative(rootDir, outDir)}/`);
    console.log("");
    chapters.forEach((c, idx) => {
      console.log(
        `  [${idx + 1}] ${c.title.padEnd(52).slice(0, 52)} -> ${c.base}.html (${c.outline.filter((o) => o.level === 2).length} sections)`
      );
    });
    console.log("");
    console.log(`Done: index.html + ${chapters.length} chapter page(s) + assets. Open ${path.join(outDir, "index.html")} or run "npm run preview".`);
  }
}

main();
