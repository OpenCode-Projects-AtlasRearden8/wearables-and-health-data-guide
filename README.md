# The Wearables & Health Data Manual

An **education-only** beginner manual for smartwatches, smart rings, and health apps. Plain English, step by step, like a friend would explain it — never medical advice, never condescending, never selling a scare.

The manual lives as Markdown chapters in `docs/` and builds (with one script, zero dependencies) into a warm static HTML site in `site/`.

Published by **Asdale Dynamics, LLC** as part of its "explain it like a friend would" guide family at [dylanasdale.github.io](https://dylanasdale.github.io).

## What's inside

| Chapter | Topic |
| --- | --- |
| 1 | Welcome — what this manual is, and the education-only promise |
| 2 | Setting up your watch, kindly (notifications, goals, fit, permissions) |
| 3 | What heart-rate and sleep numbers honestly mean (trust tiers) |
| 4 | Exporting your data safely (formats, backups, what not to do) |
| 5 | Sharing trends with your own care team (the one-page summary) |
| 6 | Family sharing and kids' accounts (consent, eldercare, teen rules) |
| 7 | Privacy settings worth touching (the master switch list) |
| 8 | Battery habits (anchored charging, making batteries age slowly) |
| 9 | The monthly data ritual (the 30-minute habit that ties it together) |
| 10 | The data-decode worksheet (printable monthly one-pager) |
| 11 | The privacy checklist (printable seasonal audit) |
| 12 | The glossary (every term, explained without a shrug) |

## How to build and read it

Requires Node 18+ — nothing else, because there are no dependencies.

```bash
node build.mjs       # docs/ -> site/
npm run check        # verify every chapter built a page
npm run test         # offline test suite (clean-copy build, determinism, no remote assets)
npm run preview      # serve site/ at http://localhost:4173
```

After building, you can also just double-click `site/index.html` — the site is plain local files with no trackers, no fonts-from-the-internet, and no network needed. It works from a USB stick.

## The education-only promise

Everything here explains *what devices measure, what those numbers can and can't tell you, and how to handle your data*. It never interprets a number for your body, never suggests treatments, and never replaces a clinician. A change that matters belongs in a conversation with your own care team — the manual's job is only to help you bring a tidy, honest page to that conversation.

## The companion project: vitals-logbook-mcp-server

This manual deliberately **does not repeat** the companion project `vitals-logbook-mcp-server` (in this guide family; see its own repo README), which handles *home-measured* readings (blood pressure, pulse, weight, temperature) in a local JSONL logbook with trends and CSV export. The split of labor:

- **Measured automatically by a wearable** (heart rate, sleep, steps, temperature trends) → this manual explains it and helps you handle it.
- **Measured deliberately by you with a real instrument** → the vitals logbook companion keeps the log.

Chapter 5 shows how the two fit on a single appointment page without either tool doing the other's job.

## Repo layout

```text
docs/                 12 Markdown chapters (the actual manual)
build.mjs             one-script Markdown -> static site builder (no dependencies)
scripts/
  check-chapters.mjs  chapter checklist: every .md built a complete page
  test-offline.mjs    offline CI-style test suite
  serve.mjs           local preview server (localhost:4173)
assets/               stylesheet + tiny site script (print & large-print toggles)
site/                 built output (git-ignored; rebuild any time)
```

## Customizing

Edit or add chapters in `docs/` (numeric prefixes set the order; files starting with `_` are drafts and are skipped). Update `book.json` for title/byline. The builder supports headings, paragraphs, bold/italic, inline code, fenced code blocks, bullet and numbered lists, blockquotes, pipe tables, and links between chapters (chapter `.md` links are rewritten to built `.html` automatically).

## License

MIT — see [`LICENSE`](LICENSE). Copyright (c) 2026 Asdale Dynamics, LLC.
