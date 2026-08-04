# Q1 — Full Reveal-Mode Walkthrough Verification

**Date:** 2026-08-04
**Spec:** VERSION2.md, Group Q, Q1 — "Walk the entire Screen 0–11 sequence for at least three synthetic personas spanning LOW/MEDIUM/HIGH risk, verifying every embedded personalization question, every dataset lookup, and every act transition renders correctly." (`Files: No code changes — test only`)

## Prerequisite: wiring the Reveal Experience live

Q1 assumes a navigable Reveal-mode sequence exists. It didn't — `RevealSequencer` and all 13 screen components (built across Groups K–N) had never been assembled into a live route; every reference to `RevealSequencer` outside its own file was a code comment, never an import. This was built first, as its own milestone (design → approval → code → verify → commit → push), landing at `/reveal` via a new `src/pages/RevealExperience.jsx` plus one route in `App.jsx`. Confirmed via the build's module count jumping from 47 to 63 that these 13 screens were previously dead code, unreferenced by any route.

While building that wiring, a placement error was caught by re-checking K4's original spec text before implementing: the phase-marker beat belongs between Screen 5 (Protection Plan) and Screen 6 (Learning Plan), not before Protection Plan. Fixed before the wiring was ever presented for approval.

## Method

Real headless-browser walkthroughs (Playwright, Chromium) against the live `/reveal` route — not simulated, not isolated component checks. Four synthetic personas:

| Persona | finalScore | riskKey | Weakest category | Strongest category |
|---|---|---|---|---|
| HIGH | 14 | HIGH | licensing | trust |
| MEDIUM | 20 | MEDIUM | physicalPresence | accountability |
| LOW | 30 | LOW | licensing | accountability |
| ACCOUNTABILITY_WEAK (targeted) | 19 | MEDIUM | accountability | — | (used specifically to test the one Workplace Moves union-variant text, which only exists on Accountability's first move)

## What was verified, for each of the three main personas

- **Every screen (0–11 plus the phase-marker beat) renders in order**, with no console or page errors at any point across any walkthrough.
- **Every dataset lookup, cross-checked against the actual source data** — not just "text is present," but exact string equality against the real imported data files: `TIMELINE` (J1), `CATEGORY_META` (Strengths), `PLAYBOOK` (Protection Plan + the final screen's 30-day action, both `context`/`days30`/`days90`/`year1` fields), `LEARNING_RESOURCES` (J4), `TOOLS` (J5), `WORKPLACE_MOVES` (J6), `CERTIFICATIONS` (J2), `SIMILAR_CAREERS` (J3) — each checked against the correct persona-specific weakest/strongest category.
- **Every embedded personalization question**, fully exercised: the hours-budget question (tested selecting "low," confirming Learning Plan shows exactly 1 step and the correct `thisWeek` text), the Protection Plan checklist (toggle confirmed), and the Workplace Moves union toggle (including the targeted Accountability-specific `unionVariant` text case — confirmed absent before toggling, present after).
- **Every act transition**, including the ambient progress bar itself, not just background color: confirmed `.reveal-progress-fill` resets at each of the three act boundaries, and background classes (`reveal-bg-hero` → `reveal-bg-light` → `reveal-bg-light-distinct` → `reveal-bg-hero` bookend) switch at the correct screens.
- **End-to-end completion:** "See the Full Report" on the final screen navigates to `/roadmap` showing the same score just walked through.
- **Regression:** all 7 existing routes (`/`, `/assessment`, `/results`, `/roadmap`, `/check-in`, `/reveal`, `/about`) load without error.

## Bug found and fixed

**First run: 201 of 204 checks passed.** The 3 failures were the same defect, reproduced identically across all three personas: after tapping an hours-budget option on Protection Plan, the tapped option never visually showed as selected, even though the underlying value correctly reached Learning Plan (confirmed by the passing step-count checks).

**Root cause:** `RevealExperience.jsx` rebuilt its entire `screens` array — including a fresh closure function for every screen — on every render. Selecting an hours option updated `hoursBudget` state in the parent, triggering a re-render that hands `RevealSequencer` a new component reference for the screen currently on display. React remounts it, wiping Protection Plan's local `selectedHours` state. The checklist checkbox happened to look unaffected only by coincidence — its checked-state is re-derived from a prop that already reflected the correct value on remount; `selectedHours` had no equivalent feedback path.

**Fix (approved as its own scoped follow-up, same design → approval → code → verify → commit workflow):** each screen's wrapper in `RevealExperience.jsx` is now individually memoized (`useCallback`) with accurate dependencies. Protection Plan's wrapper depends only on `rankedCategories` (stable for the whole session) — not on `hoursBudget`/`checklist`, since Protection Plan is the *writer* of that state via stable `useState` setters, never a reader of the live value while it's the active screen. Learning Plan's wrapper still correctly depends on `hoursBudget`, since it genuinely needs the fresh value and the user is never looking at Learning Plan while Protection Plan updates it.

**Second run, after the fix: all 204 of 204 checks passed**, including a dedicated re-check that the hours option now stays visibly selected after clicking, across all three personas.

## A second, related finding — documented, not fixed in this pass

While diagnosing the remount bug, found that `RoadmapReadyScreen.jsx`'s save handler calls `encodeRoadmapSnapshot(results)` without ever passing the `checklist` argument P1/P5 built support for. Neither P5 (explicitly scoped to `ProtectionPlanScreen.jsx` + `share.js` only) nor the `RevealExperience.jsx` wiring ever connected the two. Practical effect: a user can check off Protection Plan items, but "Save My Roadmap" currently doesn't include that checklist state in the saved link. Confirmed with the user this is out of scope for the current fix — recorded here as a follow-up item for a future task.

## Result

**Reveal-mode sequence verified working end-to-end for all three risk tiers**, with one real bug found and fixed in the process (exactly the outcome Q1 exists to produce), and one additional gap documented for later. Build and lint clean throughout.
