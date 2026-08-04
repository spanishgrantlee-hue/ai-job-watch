# Q2 — Reference-Mode Test Verification

**Date:** 2026-08-04
**Spec:** VERSION2.md, Group Q, Q2 — "Verify the single-page view matches reveal-mode content exactly, prints cleanly, and the existing V1 share/copy-as-text/share-on-X mechanisms still work unmodified." (`Files: No code changes — test only`)

## Prerequisite check

Unlike Q1, Q2 required no prerequisite wiring: `CareerRoadmap.jsx` (O1) and the print stylesheet (O2) were already live and routed at `/roadmap`, confirmed by reading `App.jsx` before writing any test.

## Method

Two passes, per the additional requirement set before this task began (stop and report — never auto-fix):

1. **Static content-parity diff** — read every Reveal screen component (`src/components/roadmap/screens/*.jsx`) against `CareerRoadmap.jsx`'s corresponding section, line for line, before running anything live. This caught one false lead early: `CareerRoadmap.jsx`'s Closing "Share" button has no handler, which looked like a bug — but `RoadmapReadyScreen.jsx`'s own Share button is equally inert (`onShare` is never passed by `RevealExperience.jsx`, documented in that file's own comment as "still an inert placeholder — Share isn't part of any Group P task"). Reference mode is faithfully reproducing existing, intentional Reveal-mode behavior, not introducing a new gap. Not reported as a finding.
2. **Live walkthrough** — real headless-browser runs (Playwright, Chromium) against a production build served via `vite preview` (not the dev server), matching Q1's "live route, not simulated" standard. Three personas (HIGH/MEDIUM/LOW, built directly as `calculateResults()`-shaped objects with pinned weakest/strongest categories, encoded through the app's real `encodeShareState`/`encodeRoadmapSnapshot` — not hand-built strings) plus one targeted persona (weakest = Accountability) to exercise the one `unionVariant` entry in the data.

## What was verified

- **Content accuracy** for all three personas: score number, Why/Strengths/Tasks-Changing copy, Protection Plan (`PLAYBOOK` context/days30/days90/year1 at the correct `playbookLevel`), Learning Plan step-filtering by hours budget, Tools, Workplace Moves (including the union-variant toggle), Certifications, Similar Careers (intro/disclaimer/reason/roles), and the Closing screen's highest-leverage action — each checked by exact string equality against the real imported dataset files, the same standard Q1 used.
- **Link-driven view modes:** `?share=`, `?snapshot=` (with its saved-date banner and conditional "See My Progress" link), and `?compare=` — including the "no live answers on this device" fallback banner and, separately, a real before/after delta computed independently via `calculateResults()` and checked against the rendered banner text.
- **Empty state** (`/roadmap`, no params, no answers) matches Reveal's empty state.
- **Print stylesheet (O2):** print-media emulation confirmed the navbar and all `.career-roadmap-page` buttons are hidden when printing the plain view.
- **V1 share mechanisms on `/results`:** Copy Link, Copy as Text, and Share on X were exercised live — clipboard contents and the tweet-intent URL/text were all correct. (One assertion in my own script false-failed here — see below, not a product bug.)

**First run — 114 checks: 109 passed, 3 real failures, 2 that were problems with my test script, not the app.**

Both real bugs were reported to the user with root cause, impact, and a recommended smallest fix, per this task's added requirement — no fix was written until explicitly approved. Approved, then applied:

- `CareerRoadmap.jsx:587` — dropped the `?? 'mid'` fallback on the prop passed to `ProtectionPlanSection` only (kept it on `LearningPlanSection`, which still needs it).
- `src/index.css` print block — added `.career-roadmap-page .results-shared-banner { display: none; }`.

Both of my own script's 2 flawed assertions were also corrected (checking the banner *container's* computed `display` instead of a hidden child's, which stays `block` regardless of an ancestor's `display:none`; and accepting either `twitter.com` or `x.com` in the intent-tweet URL, since `x.com` now auto-redirects there).

**Second run, after the fix and script corrections: all 114 of 114 checks passed**, including a direct visibility check (`0×0` bounding box, `offsetParent: null`) confirming the print-hidden banner is genuinely unrendered, not just styled.

Build and lint were re-run after the fix: build clean (still 63 modules), lint unchanged (the 3 pre-existing, unrelated errors noted below — nothing new from either file touched here).

---

## Bug 1 (fixed) — Protection Plan hours-budget option showed as pre-selected before the user answered

**Where:** `src/pages/CareerRoadmap.jsx`, line 587 (the `<ProtectionPlanSection>` call) and lines 267–282 (`ProtectionPlanSection`'s render of `HOURS_OPTIONS`).

**Root cause:** `hoursBudget` state starts as `null` (line 495, correct). But it's passed into `ProtectionPlanSection` as `hoursBudget ?? 'mid'` — the same defaulting used for `LearningPlanSection`, which genuinely needs a non-null budget to pick a step count. `ProtectionPlanSection` re-uses that same already-defaulted prop for its own selected-button styling (`hoursBudget === opt.key ? ' protection-plan-option--selected' : ''` and `aria-pressed={hoursBudget === opt.key}`), so on first render — before the user has clicked anything — the "1–3 hours a week" button renders visually selected and `aria-pressed="true"`. Confirmed live for all three personas.

Reveal mode's `ProtectionPlanScreen.jsx` doesn't have this problem: it keeps its own local `selectedHours` state starting at `null` and only defaults downstream (in `LearningPlanScreen`), never for its own button-selected styling. Reference mode collapsed that distinction by threading one pre-defaulted value into both sections.

**User impact:** A user landing on `/roadmap` for the first time sees "1–3 hours a week" already highlighted, before answering anything — it looks like the page already knows their answer, or that a click registered without them doing anything. A screen-reader user hears the button announced as already pressed. This directly conflicts with the design principle that "every embedded question must have a sensible default if skipped" but not appear as if it were actively answered — a default for content-filtering purposes should never be visually presented as a user choice.

**Recommended smallest safe fix:** Pass the raw, possibly-null `hoursBudget` to `ProtectionPlanSection` (drop the `?? 'mid'` on that one call site only); keep the `?? 'mid'` fallback exactly as-is on `LearningPlanSection`, which legitimately needs it. One-line change, no behavior change to Learning Plan's filtering, no data/schema changes.

---

## Bug 2 (fixed) — Print stylesheet didn't hide the shared/snapshot/compare banner links

**Where:** `src/index.css`, the `@media print` block (lines 2554–2570), specifically `.career-roadmap-page button, .career-roadmap-page .protection-plan-question { display: none; }`.

**Root cause:** That selector only targets `<button>` elements. The three view-mode banners (`isSharedView`, `isSnapshotView`, `isCompareView` in `CareerRoadmap.jsx`) render their calls-to-action as `<Link>` components (real `<a>` tags with class `results-shared-banner-cta`), which the print rule never mentions. Confirmed live: printing a `?snapshot=` view left the banner's "Take your own assessment →" link rendered at `display: block`.

**User impact:** Someone who saves a roadmap link, opens it later, and hits "Download PDF" gets a printed page with a stray blue "Take your own assessment" (or "See My Progress") link/banner baked into the PDF — noise that has no purpose on paper and looks unfinished, undermining the "prints cleanly" requirement Q2 exists to verify.

**Recommended smallest safe fix:** Add `.career-roadmap-page .results-shared-banner { display: none; }` to the same `@media print` block (hiding the whole banner container, not just the link, since the banner's status text is equally irrelevant on a printed page — the printed page itself already only shows one frozen state). One CSS rule, no JS/logic changes.

---

## Not a bug — noted for completeness

- **Share on X check "failure":** my own test script's assertion was wrong, not the app. `x.com` now auto-redirects `twitter.com/intent/tweet` links, so the Playwright popup's *post-redirect* URL is `x.com/...`, which failed a same-string check against `twitter.com`. `Results.jsx`'s `handleShareX()` (unchanged since Q1) still correctly opens a `twitter.com/intent/tweet` URL with the right tweet text — confirmed by the very next assertion (tweet text contains the score), which passed. No app change needed.
- **Inert "Share" button in `CareerRoadmap.jsx`'s closing section:** matches Reveal mode's equally-inert Share button exactly (see Method, above) — pre-existing, intentional, out of scope.

## Separate finding — pre-existing lint failures, unrelated to Q2's scope

Running `npm run lint` (part of the required workflow) surfaced 3 errors that already exist at `HEAD` (`ed001c5`, Q1's own commit), in files last touched in the original V1 commits (2026-06-19), untouched by any V2 work:

- `src/App.jsx:14-15` — `react-refresh/only-export-components` (exporting `AnswerContext`/`useAnswers` alongside the `App` component)
- `src/components/Navbar.jsx:9` — `react-hooks/set-state-in-effect` (`useEffect(() => { setOpen(false); }, [pathname])`)

These predate this task, are unrelated to `CareerRoadmap.jsx`/`share.js`/the print stylesheet, and are out of Q2's scope per `VERSION2.md`'s own rule that V1 code is touched only for genuine bugs, not incidentally. Flagging because Q1-VERIFICATION.md stated "Build and lint clean throughout," which this run shows is no longer (or was never precisely) true — worth a decision on whether to open a separate cleanup task, but not fixed here.

## Result

**Reference-mode content, print output, and link-driven view modes verified working end-to-end for all three risk tiers plus a targeted union-variant persona — 114 of 114 checks passing after the fix**, with two real bugs found, reported for approval, approved, fixed, and re-verified (exactly the outcome Q2 exists to produce), both isolated to Group O's Reference-mode code (not V1, not Reveal mode, not the shared datasets). The pre-existing lint findings were left out of scope per the user's decision to track them as a separate task.
