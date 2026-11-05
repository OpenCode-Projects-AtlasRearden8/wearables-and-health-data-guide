---
blurb: Build a one-page trend summary your own care team will actually be glad you brought.
---

# Sharing Trends with Your Care Team

Clinicians are flooded with data and starved of *narrative*. When a patient arrives with either a screenshot avalanche or an eleven-page spreadsheet printout, the visit loses its best asset — time to actually talk. When someone arrives with **one tidy page of trends and a clear question**, the visit gets better for everyone in the room.

This chapter shows you how to be that second person. It's about collaboration, self-advocacy, and a little data hygiene — and it's a natural complement to the `vitals-logbook-mcp-server` companion tool from Asdale Dynamics, LLC, which keeps your *home-measured* numbers (cuff blood pressure, thermometer readings, daily weight checks, whatever you and your care team already track) in a plain logbook file with simple CSV exports.

> **The boundary that makes this chapter safe:** you're preparing *context for your own clinician*, not conclusions. You're the presenter of data; the licensed professional is the interpreter. This manual never tells you what a trend means for your body — that conversation is the whole reason you brought the page.

## What clinicians actually want from device data

Ask any primary-care nurse or physician and you'll hear the same wish list, in order:

1. **Time-anchored summaries, not momentary screens.** "What's my resting heart rate been *over the last three months*?" beats a screenshot from Tuesday.
2. **Trends in the direction of travel,** with dates around events you care about ("started the new medication Feb 3" penciled under the graph).
3. **Only the relevant slice.** A cardiology visit wants heart-rate readings; a sleep-medicine visit wants timing and naps; your knee surgery follow-up doesn't need REM-shade charts.
4. **A stated question.** "I've felt off for two weeks and my watch shows my resting heart rate 8 beats above my usual — worth a look?" is worth twenty minutes of graph-digging.

## Building the one-page summary: a fill-in recipe

Use the [data-decode worksheet](10-data-decode-worksheet.md) as your template — it's designed so one copy fits one appointment. The skeleton:

**1. Header — who and when**

```text
Prepared: ______ (date)
Visit with: ______ (clinician / specialty)
Question or concern: ______
Wearing device: ______ (brand/model), since: ______
Wearing consistency: /5 (honest)
```

**2. One table, three to five rows max.** Pick the readings that answer the header question. Example rows for a heart-rate question:

| Metric | Prior period (e.g., Mar–May) | Recent period (e.g., Sep–Nov) | Source |
| --- | --- | --- | --- |
| Resting HR (watch, nighttime) | my usual baseline | recent weeks | brand app, 90-day graph |
| Sleep timing (lights out / wake) | usual window | recent | sleep tracking |
| Home BP (cuff), date-stamped | values | values | vitals logbook CSV |

Leave directional words in where you genuinely can't quantify them — that's honest. Where you *can* pull an average from an app graph, do just that.

**3. One paragraph of context.** Two or three sentences of life context that a clinician cannot see in any graph: schedule changes, new stressors, sleep shift, new meds, travel, illness weeks. Write it plainly. This paragraph is often the most useful thing on the page.

**4. One printout or portal attachment.** Screenshots of the relevant *trend* graph (resting HR over 90 days beats tonight's minute-by-minute), cropped to the timeframe of interest. One or two, not nine.

## The two-system layout: wearable + logbook

A clean mental furniture diagram for your health data:

```text
wearable (automatic)          logbook (deliberate)
  watch/ring Sensors             your cuff, thermometer, scale
  heart rate, sleep, steps       readings you take on purpose
  app graphs + auto trends       vitals-logbook-mcp-server JSONL file
        |                              |
        +--------- trends page --------+
              (one page, the appointment copy)
```

The wearable side contributes *automatic* context: resting heart rate baselines, sleep-timing consistency, activity patterns. The logbook side contributes *deliberate* readings clinicians already ask patients to take — and the `vitals-logbook` companion's `trends` and `export_to_csv` tools turn your JSONL logbook into ready-to-print highlights in seconds. The two systems slot onto one page because they were built for different jobs: neither duplicates the other.

This manual's job is the wearable side; the vitals logbook does the deliberate side. If you keep both, this chapter is the only place you'll ever have to glue them together — and the worksheet's "Source" column does the gluing.

## Before the visit: your six-point packing list

- [ ] The one-page summary (printed, or uploaded ahead through the patient portal if offered)
- [ ] Two screenshots: the trend graph for the reading that prompted the visit, and one comparison ("usual" vs. "recent")
- [ ] Date-anchored context: any relevant events with dates (med changes, illness weeks, sleep shifts)
- [ ] Home readings for anything the office would want (cuff readings especially, as a dated CSV or printed table)
- [ ] Your own question written down first — the appointment is yours too
- [ ] A second copy (email to yourself, or a paper spare) so a printer malfunction doesn't sink the visit

The full printable version lives in the [data-decode worksheet](10-data-decode-worksheet.md), which you can fill in paper-side before the appointment.

## Words with clinicians that work

Plain phrases that tend to help:

- "**I've been wearing a watch nightly; here's my three-month resting heart rate.**" — anchors the source and the window.
- "**My usual is around this line; the recent weeks look different, and I wanted your read.**" — hands over your data without pretending you've done the diagnosis.
- "**I track my sleep timing; here's the pattern, not the stage scores.**" — signals you know the difference between chapters' honesty levels.
- "**I keep a logbook of my home cuff readings; here's the CSV.**" — a breath of relief: no ten-screenshots ambush.
- "**Is there anything you'd like me to track over the next month?**" — invites the team to use you as an instrument; genuinely the most productive question in the room.

## Words to avoid (kindly)

- Interpretations as conclusions: "My HRV crashed, I must be overtrained" (you'll get a milder version of this if the HRV topic comes up — see the honesty chapter's [HRV notes](03-what-the-numbers-honestly-mean.md)).
- Ambushing: dumping 15 screenshots in sequence. Summarize on the page; the screenshots stay as *backup*.
- Sharing *other people's* data without their consent (partner sleep data, a teen's cycle data) — see the [family chapter](06-family-sharing-and-kids-accounts.md) for what consent looks like when the sharer has a house key.

## If your clinician's eyes glaze over

Honest advice for the occasional visit where nobody wants to talk data:

1. **Leave the copy anyway** — ask them to keep it or add it to your chart if they prefer; many patient portals accept uploaded documents.
2. **Ask the portal question first:** "May I upload my wearable summary to my chart?" — that routes the data without the visit-time pressure.
3. **Keep your summary plain** so *if* it's useful, it's useful without a funnel.

A tidy one-pager left with kindness rarely stays useless for long, even on a busy day.

Next, everyone else in the household: [family sharing and kids' accounts](06-family-sharing-and-kids-accounts.md).
