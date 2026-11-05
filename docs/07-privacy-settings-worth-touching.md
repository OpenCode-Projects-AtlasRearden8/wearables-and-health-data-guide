---
blurb: The short list of wearable and health-app privacy switches that actually matter, and how to audit them.
---

# Privacy Settings Worth Touching

Wearables are odd fish in the privacy pond: they collect a genuinely sensitive stream — heart rate, sleep timing, motion, location, sometimes cycle data — from a sensor you invited onto your body. A beginner doesn't need to become a privacy lawyer. They need about **a dozen switches**, the habit of checking them **seasonally**, and the honesty to know which data in the ecosystem is *actually* sensitive and which is merely personal.

This chapter is that list. Its printable cousin — pass/fail checkboxes for an audit you can run in one sitting — lives in the [privacy checklist](11-privacy-checklist.md).

## First: rank your data before you rank your settings

Not all streams are equal. Here's a sensitivity scale to reason with, from rare-only to guard-strong:

| Sensitivity | Data streams | Why |
| --- | --- | --- |
| Guard-strong | Cycle/reproductive data, precise GPS location history (routes, home addresses), kids' data, anything shared on behalf of someone else | Reveals where you physically go or concerns a person who can't fully consent |
| Sensitive | Sleep timing and duration, resting heart rate, medication-adjacent patterns (fall alerts, illness flags), your device wear-hours | Paints a detailed picture of your life rhythm |
| Fermentably-personal | Steps, workouts, general activity | Lowest stakes, highest social-dynamic stakes (leaderboards and guilt) |
| Boring (keep!) | Device settings, goals, app preferences | The user experience layer; fine to sync |

Two consequences fall out of this ranking:

1. **Protect-by-default should apply to the top rows** — cycle data and location history are the two streams you should consciously decide *who gets to see*, and nobody is a valid first answer.
2. **Steps streaks create family drama** — the "fermentable" data hurts no one's privacy and plenty of people's feelings; the [family chapter](06-family-sharing-and-kids-accounts.md) covers consent for those circles.

## The master list: switches that matter

Organized by where you'll find them in most maker apps. Treat names as treasure hints, not exact addresses.

### A. Sharing between *your own* devices

- **Health-store connection** (Apple Health / Health Connect): ON. This is sync within your own ecosystem, the backbone of the [export strategy](04-exporting-your-data-safely.md). Revoking it breaks the umbrella exports.
- **Cloud backup to the maker**: ON for most people. The alternative — keeping data only on-device — risks losing everything to a washed wrist. Knowing *what* the maker's cloud stores (resting heart rates and sleep times, not your photo library) is part of accepting this trade; you can narrow it under "data settings" by disabling features you don't use (see E).

### B. Sharing with *other people*

- **Activity-sharing circles / friends**: review each named person. Un-follow anyone you haven't actually interacted with in months; activity feeds accumulate ghosts.
- **Family health features** (movement notices, not-worn alerts, shared summaries): review quarterly; make sure the *wearer* knows what's on. The [family chapter's](06-family-sharing-and-kids-accounts.md) guardrail sentence governs.
- **Emergency/SOS contact list**: keep it current with a real yearly check ("is Sarah still the one to call?"). Stale emergency contacts are a classic quiet failure.

### C. Location — the big one

- **Workout route recording (GPS)**: a personal choice; routes are one of the most sensitive files the [export chapter](04-exporting-your-data-safely.md) talks about. Know whether your device records a route and where it lands before you decide ("one more setting nobody reads is not a decision").
- **Phone-app location permission**: most watch apps can run fine on "While Using the App" rather than "Always." Only apps that genuinely need background GPS (safety features, route-only-while-recording) deserve "Always."
- **Precise location toggle** on phones: the newer platforms' "coarse vs. precise" distinction is exactly the sensitive/boring boundary from the table. "Coarse" is fine for most app uses.
- **"Find My"/device-locator features**: helpful for a lost watch; also means your device pings its position home. Reasonable default ON for a $300 device that lives on a battlefield (your wrist at the gym), but know it's there.

### D. Third-party app access

- **Connected apps list**: every fitness app, sleep-analysis tool, habit tracker, or "wellness platform" you ever authorized has a standing grant to read specified streams. Audit it (monthly in the [ritual](09-the-monthly-data-ritual.md), seasonally minimum). Revoke everything you don't actively use — grants re-ask when you actually need them.
- **Sign-in with Apple/Google for fitness services**: fine, but prefer "hide my email" where offered, so marketing databases can't accumulate your real address across ten wellness apps.
- **Phone Bluetooth settings**: the watch-phone pair needs Bluetooth; stray *other* accessories don't. A comfort-level check (once) of what's paired is worth two minutes.

### E. Data collection refinement

- **Feature-by-feature opt-outs**: most apps let you turn off *individual* streams — e.g., disable SpO2 background tracking, off sleep-stage-depth analysis for kids, turn off menstrual-cycle data if you don't want it on the device at all. Deleting a feature's data stream is the strongest privacy setting there is: a stream not collected can't leak.
- **Marketing/insights toggles**: search the privacy or data-usage screens for anything that shares "aggregated insights" with third parties or uses your data for product improvement. Opt out where the toggle exists; where it doesn't (and you're uncomfortable), that's real consumer feedback to weigh at your next purchase.
- **Ad personalization**: most maker ecosystems have an ads/recommendations toggle in account settings. Turn it off. Health data should never be a targeting segment you feed on purpose.

### F. Account hygiene

- **Strong, unique password** for the maker account — a health-account password is worth a password manager's protection (see any "passwords and two-step" guide from the same family of books).
- **Two-factor authentication** if offered: ON. Health accounts get phished like any other; the second factor costs thirty seconds a login.
- **Data deletion on exit**: if you stop using a device or service, most privacy laws give you a right to request deletion. The account-deletion flow (or a support request) is your instrument; do it *once*, on purpose, and don't leave zombie accounts holding your heart-rate history forever.

## The setting nobody should skip: the notification mirror

Full-circle to the [setup chapter](02-setting-up-your-watch-kindly.md): notification mirroring leaks *your whole phone's attention stream* to your wrist — message previews, email subjects, bank-abort codes. It's the most-diverse personal data on your wrist, technically. The protection isn't exotic: mirror the notifications you actually want, nothing else, and your wrist gets quieter *and* more private in the same click.

## An annual 15-minute privacy ritual

Fold into one of your [monthly data ritual](09-the-monthly-data-ritual.md) sessions — even once a season is fine:

1. **Connected apps**: sweep and revoke (5 minutes).
2. **Sharing circles and family dashboards**: check names against real life (3 minutes).
3. **Location permissions** on the phone for all health apps: verify "while using" not "always" unless justified (3 minutes).
4. **Emergency contacts**: still current? (1 minute)
5. **The two top-stream checks**: cycle-data sharing = intended list or nobody; GPS routes = still stored where you expect? (3 minutes)

The [privacy checklist](11-privacy-checklist.md) puts all of this as printable checkboxes; run it once per season and date the margin.

## A grounding thought

Not every wearable question is a privacy question. Most health-data anxiety is about the [accuracy and meaning of the numbers](03-what-the-numbers-honestly-mean.md), not who sees them. The privacy muscle you're building serves one honest goal: **the sensitive data that exists should exist only where you decided it should.** After that, close the app and go for the walk. The walk is the healthier privacy investment.

Next — the chapter where the practical and the bodily meet gracefully: [battery habits](08-battery-habits.md).
