# STATUS

## What was built

**The Wearables & Health Data Manual** — an education-only beginner manual (never medical advice) for smartwatches, smart rings, and health apps, published by Asdale Dynamics, LLC. Written as 12 Markdown chapters in `docs/` and converted by a zero-dependency build script (`build.mjs`) into a warm, polished, fully offline static HTML site in `site/`.

### Content (12 chapters in `docs/`)

1. **Welcome** — the education-only promise, who it's for, how it complements `vitals-logbook-mcp-server` without repeating it.
2. **Setting up your watch, kindly** — pairing, fit/wear positioning, gentle goals, notification triage, shift-worker notes, a first-week checklist.
3. **What the numbers honestly mean** — a trust-tier table (solid → fair → estimate → vibe) for steps, heart rate, sleep stages, HRV/recovery scores, SpO2, temperature trends; why "trend beats single reading."
4. **Exporting your data, safely** — where data lives, formats (CSV/ZIP/JSON/FIT), maker-app and umbrella health-store exports, a safe folder layout, what not to upload anywhere.
5. **Sharing trends with your care team** — the one-page summary recipe, the wearable + `vitals-logbook-mcp-server` two-system layout, clinician-pleasing phrases, packing list.
6. **Family sharing and kids' accounts** — consent guardrail, sharing-style table, eldercare sharing, kids'/teen account rules, a household blacklist.
7. **Privacy settings worth touching** — data-sensitivity ranking, a master switch list (own-ecosystem, other people, location, third parties, data refinement, account hygiene), a 15-minute seasonal audit.
8. **Battery habits** — anchored charging table, lithium aging habits, power-saving cheat sheet, household/ADHD charging kindness, end-of-life options.
9. **The monthly data ritual** — a gentle 30-minute format (collect, read, adjust one knob, file, close) with an ADHD-friendly 5-minute low-energy version.
10. **Data-decode worksheet** — printable fill-in monthly one-pager with a worked sample.
11. **Privacy checklist** — printable pass/fail seasonal audit (22 items).
12. **Glossary** — plain-English definitions cross-linked to chapters.

### Build system

- `build.mjs` — one script, Node built-ins only (no dependencies, works offline): `docs/*.md` → multi-page static site with contents sidebar, on-page TOC, chapter pager, large-print toggle, print/PDF styles.
- `scripts/check-chapters.mjs` — chapter checklist (exit 1 on failure).
- `scripts/test-offline.mjs` — offline test suite (clean-copy build, determinism, zero remote resources).
- `scripts/serve.mjs` — local preview server at `localhost:4173`.
- `package.json` (`build`, `check`, `test`, `preview`), `book.json` (title/byline), `.gitignore` (site/ ignored).
- `LICENSE` — MIT, "Copyright (c) 2026 Asdale Dynamics, LLC".
- `README.md` — credited to Asdale Dynamics, LLC.

## How to run it

```bash
node build.mjs        # build docs/ -> site/
npm run check         # verify all 12 chapters built complete pages
npm run test          # offline test suite
npm run preview       # serve site/ at http://localhost:4173
```

Node 18+; no install step, no network needed. After building you can open `site/index.html` directly from disk.

## Verification results (all run 2026-11-05)

- `node build.mjs` — **pass**: index.html + 12 chapter pages, no build notes (all internal chapter links resolved).
- `node scripts/check-chapters.mjs` — **pass**: 12/12 chapters, all page checks, home page links all chapters, styles in place.
- `node scripts/test-offline.mjs` — **pass**: all 7 tests (no dependencies; built-in-only imports; clean-copy build; zero remote resources; deterministic byte-identical rebuild; large-print/sidebar/skip-link affordances; checklist passes on built copy).
- Preview server smoke test — **pass**: `GET /` → 200; chapter pages render with `h2` sections and all 12 cards on the home page.
- Content lint pass — fixed stray non-English/garbled tokens found during self-review; `grep` for non-ASCII script ranges in `docs/` is now clean.

## Known gaps / honest notes

- **No brand-specific screenshots or exact menu paths.** Deliberate: labels differ across brands and app versions, so settings are described as "look for a setting like X" (stated in-chapter). Future: per-brand appendices could be added.
- **No checklist-size validation beyond eyeballing** — the privacy checklist has 22 items total (A:4, B:4, C:2, D:4, E:4, F:2); an in-code test for item counts wasn't written (chapter content is data, not code).
- **Glossary has no `##` sections** (single flat list by design), so its page shows no "On this page" outline; all other chapters have section outlines.
- **Site is git-ignored** (rebuildable artifact); GitHub Pages deploy workflow intentionally omitted per no-publish instructions.
- No tests exist for the builder's own Markdown parser edge cases beyond what `test-offline.mjs` covers (the parser is adapted unchanged from the proven `markdown-manual-site-template`).
