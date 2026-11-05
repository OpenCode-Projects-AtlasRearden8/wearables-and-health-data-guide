---
blurb: How to get your numbers out of any wearable or health app — formats, backups, and care with files.
---

# Exporting Your Data, Safely

One quiet fact about wearables: the history you're building belongs to you, but it lives on someone else's servers — until you export it. Companies sunset services, people switch ecosystems, and the "sleep data from 2024" you'd like to show a clinician in 2028 only exists if somebody saved it. This chapter shows you how to make exports a normal event in your life: what you can get, in what formats, where to keep it, and how to do the whole thing without leaking anything.

## Why bother exporting

- **Continuity.** If you change watch brands, the new maker can't import your old brand's cloud history. An export folder on your own computer can.
- **Control.** An export you hold copies — a CSV with your heart-rate history — works with no account, no internet, and no company policy.
- **Sharing on purpose.** Most [care-team sharing](05-sharing-trends-with-your-care-team.md) is easier from a spreadsheet you control than from a phone screen you're screenshotting under fluorescent lights.

> **The rule of thumb:** a phone app's data is like a library book — you can read it, but the library decides if it stays open. An export on your own drive is your photocopied chapter, and it never gets recalled.

## The layers: where your data actually is

There are usually *more copies* of your health data than you expect:

1. **The device itself** — days to weeks of raw sensor history, wiped on re-pairing or reset.
2. **The maker's app/server** — the full history behind the graphs, as long as the service exists.
3. **The phone health store** — Apple Health, Health Connect, or a maker's local store; often holds years of daily summaries from every connected app.
4. **Any third-party apps you granted access** — each one its own little copy.

An export strategy that covers layers 2 and 3 covers almost everything a beginner needs.

## What formats you'll meet

Health data comes out of the machine in a handful of familiar shapes:

| Format | What it looks like | What it's good for |
| --- | --- | --- |
| **CSV** | Rows and columns, opens in any spreadsheet | Handing specific numbers to your care team; the format `vitals-logbook-mcp-server` also exports |
| **ZIP of CSVs/JSON** | A compressed folder of many files, one per data type (Apple Health's export is famous for this) | Full archives from phone health stores — long-lived backups |
| **JSON** | Fancier text files, still human-readable | App archives; a little harder to eyeball, easy for any tool to read |
| **FIT / GPX / TCX** | Specialized files from Garmin/Strava-style apps | Workout routes and track data; overkill for basic summaries |

Beginner translation: **CSV is the friend you want.** Everything else is notation you can open once to check, then keep sealed in the folder.

## Exporting the maker's app data

The path lives in slightly different places per brand, but the recipe rhymes:

1. **Open the maker's app** (the phone app, not the watch).
2. Look under **Profile → Settings → Account/Data → "Export," "Download your data," or "Privacy"** — most big brands are legally required (in many countries) to offer a data download somewhere in the privacy or account screens. Some put it in a web account portal instead of the app; a few email you a download link days later.
3. **Pick the broadest export offered** and let it run. Big histories can take hours or days to prepare — that's normal; don't panic at a slow "preparing" screen.
4. **Save the file, then immediately unpack and check it** before filing it away. An archive you've never opened is a mystery box; open it once, confirm the CSVs contain rows with dates, then close it.

If a maker offers *no* export path at all, that's a real negative worth knowing when choosing your next device — and a phone health-store export (below) often rescues your daily summaries anyway.

## Exporting the phone health store (the big umbrella export)

- **iPhone:** Health app → your profile picture → **Export All Health Data**. You'll get a `zip` containing an archive (XML/JSON) plus a CSV of key summaries. Time to prepare: minutes to hours depending on history.
- **Android:** depends on your setup. For Google: **Health Connect** has settings → **Export data** (or Google Takeout for Google-account data, which includes Fit steps). Samsung Health offers data export through its own settings and syncs into third parties too.
- **Do this semi-annually at most** — the umbrella export is your long-term insurance policy, not a weekly chore. Slot it into the [monthly data ritual](09-the-monthly-data-ritual.md) as an every-third-month item.

## Sending one specific thing to someone specific

For appointment prep and [one-page summaries](05-sharing-trends-with-your-care-team.md), a full archive is the wrong tool. The right tools, in nearly every app:

- **Share/export a single workout** (a run's pace and heart rate) — every major app has a per-workout share sheet: PDF, image, or file.
- **Screenshot the specific graph** for a specific window (e.g., "resting heart rate, last 3 months") — the crop keeps it readable and avoids dumping your whole month of sleep timing into a message.
- **CSV from your logbook** — if you keep home readings (blood pressure, thermometer readings, weight) with the `vitals-logbook-mcp-server` companion, its `export_to_csv` tool writes you a tidy file that prints clean and opens anywhere.

Matching the *smallest file that answers the clinician's question* is both kinder (their time) and safer (less exposed data).

## Where to keep exports — a simple, safe layout

Here's a layout that has survived real people's laptops and phones:

```text
health-data/
  exports/
    2026-05-15_health-store-export.zip
    2026-08-01_watch-brand-download.zip
  summaries/
    2026-10-resting-hr-3mo.csv
    2026-11-sleep-timings.csv
  README.txt
```

Habits that keep it safe rather than someday-sad:

- **Date-versioned filenames** (`YYYY-MM-DD`) — you'll never wonder which is newest, and old exports become a history of their own.
- **Two copies on two devices** at minimum (laptop + an external drive or your computer's backup service). Health files are small; "copy it twice" costs seconds.
- **A one-line README.txt** in the folder saying what each file is and why you kept it. Future-you is a stranger with your same questions.
- **Encrypted or password-protected archives** if the export includes data you consider sensitive. On most phones and computers, right-click → "Compress/Archive" plus the built-in disk encryption of the machine is honest protection for a *home* folder that stays home.

## What NOT to do with health data

This chapter is "export safely," so name the other half loudly:

- **Never upload a full health export to a random cloud service, AI website, or "free analyzer" tool.** A full export is years of sleep timing, heart rate, location-tagged workouts. If you want an AI's help reasoning about a *portion*, share an anonymized snippet (no dates plus dates-of-birth names, no precise geodata), ideally a CSV minus columns you don't need — the same discipline as the [data-decode worksheet](10-data-decode-worksheet.md) practice of summarizing rather than dumping.
- **Never email it casually.** Email is fine for a one-page summary of trends; a decade of raw sleep-timing data deserves a more deliberate channel (a patient portal upload, or a printed page from your own logbook).
- **Watch where third-party apps read from.** Every connected app is another copy of you. The [privacy chapter](07-privacy-settings-worth-touching.md) shows how to prune those permissions regularly.
- **Beware re-pairing traps:** unpairing a watch and setting up fresh has historically erased device-local history not yet synced to the maker's server. Export *before* major surgery on a device, not after.

## A starter ritual, in one paragraph

Twice a year — roll it into the [monthly data ritual](09-the-monthly-data-ritual.md) with a flag — do the umbrella health-store export, file it dated, open the zip to confirm it's real, copy the folder to a second place, and spend three minutes pruning any app permissions you no longer want active (see [the privacy checklist](11-privacy-checklist.md)). That's the entire export habit. It's about twenty minutes a year, and it's the difference between owning your history and renting it.

Next: making all of this *legible* to your own care team without over-sharing: [sharing trends](05-sharing-trends-with-your-care-team.md).
