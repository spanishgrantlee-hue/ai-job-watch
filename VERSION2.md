# Version 2 — AI Career Protection Platform

> **Status:** Planning. Version 1 (`v1.0.0`) is complete, stable production software and should not be modified except for genuine bugs. Nothing in this document touches `src/utils/scoring.js` — the scoring engine is preserved as-is; V2 is a new content, personalization, and presentation layer built on top of it.
> Every task below is the smallest logical unit of work. Do them in order — dependencies are noted.

---

## Mission (unchanged from the product design phase)

AI Job Watch exists to help everyday workers understand how AI is changing their careers and give them the knowledge, tools, and opportunities to adapt before they're left behind. The goal is not to scare people — it's to educate, protect, prepare, and empower them. We cannot make people's decisions for them, but we can make sure those decisions are informed.

## The gate every V2 feature must pass

> **"Will this help someone protect or improve their career?"**
> If the answer is no, it doesn't belong in AI Job Watch. This applies to every task added to this document from this point forward, including ones not yet written.

## Design principles (non-negotiable)

- **Educate, Protect, Prepare, Empower, Respect** — every feature must serve at least one.
- **Plain English test:** if a construction worker, nurse, truck driver, teacher, warehouse worker, office employee, or longshoreman can't understand it immediately, simplify it. No AI buzzwords unless explained simply.
- **Never create fear. Never exaggerate. Always explain the reasoning** behind a recommendation.
- **Protect the current career before suggesting a change.** Career-change content (Similar Careers) always comes last, always framed as "in case," never as the default recommendation.
- **One clear question per screen**, and every screen ends more informed *and* more in control than it began.
- **Personalization is additive, never required.** Every embedded question must have a sensible default if skipped.
- **The lunch-break test.** Every individual recommendation, in every content category, must be something a person could read on a break and realistically act on today, this week, or this month. No advice that depends on an external event happening first (a compliment arriving, a problem breaking, an opportunity appearing) — rewrite it into something the person initiates themselves. If a recommendation only helps a hypothetical version of the reader, it doesn't pass. Established while finalizing Workplace Moves (J6); applies to all future categories, not just that one.

## What V2 explicitly is not

- Not a rewrite of the scoring model. `finalScore`, `riskKey`, `categories`, `automationRisks` all stay exactly as V1 computes them.
- Not a real account system. Progress tracking uses the existing share-link pattern (an extension of `encodeShareState`/`decodeShareState`), not logins, passwords, or stored personal data.
- Not a real occupation/labor-market database. Certifications, Similar Careers, and Tools content are curated, hand-authored datasets per category — same spirit as the existing Career Playbook, not an external API integration.
- Not a PDF-library integration. PDF export is a print-stylesheet + `window.print()`, per the earlier decision, unless a real limitation forces reconsideration.

## The two modes (recap)

- **Reveal mode** — first-time experience only. A sequenced, one-idea-at-a-time walkthrough (Screens 0–11), paced deliberately, grouped into three visually distinct acts.
- **Reference mode** — every return visit, and available anytime via a "See the Full Report" escape hatch. The same content collapsed into a single scrollable, printable, shareable page — the direct descendant of today's `Results.jsx`.

---

## Group J — Content Data Foundations

No UI in this group — pure data, reviewable and testable independent of any component, same pattern as V1's `share.js` utilities preceding the UI that used them.

---

### J1 · Port the Automation Timeline dataset
**What:** Move the timeline copy already drafted (HIGH: 1–3 years, MEDIUM: 3–7 years, LOW: 7+ years, each with the revised Screen 4 wording and the "this is a general estimate" disclaimer) into a new data file, keyed by `riskKey`.
**Why:** Already written and reviewed during the design phase — this is a port, not new authoring.
**Files:** `src/utils/roadmap/timeline.js` *(new)*
**Time:** 15 minutes
**Dependencies:** None

---

### J2 · Port the Certifications-per-category dataset
**What:** Move the certifications content drafted during the (paused) ScoreGauge work — 2–3 certifications per category with a one-line "why" each — into a new data file, keyed by category. Apply the Learning-Plan/Certifications division-of-labor rule: this dataset is for formal, credential-granting resources only.
**Why:** Already drafted and reviewed; this closes out the stashed work rather than re-authoring it.
**Files:** `src/utils/roadmap/certifications.js` *(new)*
**Time:** 20 minutes
**Dependencies:** None

---

### J3 · Port the Similar Careers dataset, with the new framing
**What:** Move the "Careers That Often Emphasize Your Strongest Skills" content (3–5 roles per category, one-line reason each) into a new data file, keyed by category. Include the disclaimer text and the strengthened Screen 10 opening line ("This isn't instead of everything you just built...") as part of the same module, not scattered in a component.
**Why:** Already drafted; keeps the "not personalized career advice" disclaimer co-located with the content it governs.
**Files:** `src/utils/roadmap/similarCareers.js` *(new)*
**Time:** 20 minutes
**Dependencies:** None

---

### J4 · Author the Learning Plan resource library
**What:** For each of the 6 categories, 2–4 learning resources (course, video, article), each tagged with: estimated time commitment, cost (free/paid), and format (reading/video/hands-on) — so the personalization engine (Group O) can filter by the user's stated time/budget/learning-style.
**Why:** This is new authoring, not a port — nothing like it exists in V1. Directly serves "Personalized Learning Plan."
**Files:** `src/utils/roadmap/learningResources.js` *(new)*
**Time:** 90 minutes
**Dependencies:** None

---

### J5 · Author the Recommended Tools dataset
**What:** For each category, 1–2 concrete AI-tool use-cases framed as "use AI to do your current job better" (per the Screen 7 design intent) — not generic software recommendations. Each entry: the tool/technique, a one-sentence how-to, and the one-line reasoning tying it back to the category.
**Why:** New content. This is the "AI stops being the threat and becomes something you use" reframe — arguably one of the highest-leverage sections in the whole report, per the design-phase discussion.
**Files:** `src/utils/roadmap/tools.js` *(new)*
**Time:** 60 minutes
**Dependencies:** None

---

### J6 · Extend the Workplace Moves (Tips) dataset per category — CONTENT FINALIZED
**What:** V1's `RESOURCES.tips` is keyed only by risk tier (HIGH/MEDIUM/LOW), two tips each. Replaced with a category-keyed dataset — two moves per category, manager-framed by default with a union-framed variant where it genuinely applies (not forced on every category) — matching the confirmed "Workplace Moves" rename. Every entry passes the lunch-break test: no advice conditional on an external event happening first; each one is self-initiated and names a concrete timeframe (today/this week/this month).

**Finalized content, ready to port into the data file:**

- **Accountability:** *(1)* "This week, ask your supervisor if you can own one small process start to finish — restocking, scheduling, a specific type of customer issue, whatever's realistic. Owning one thing completely matters more than helping with ten things partway." *(Union variant: "If you're in a union role, check with your rep first — new responsibility can sometimes affect job classification or pay grade.")* *(2)* "This week, pick one recurring annoyance or inefficiency in your day-to-day work, and bring your supervisor not just the problem but one specific idea to fix it."
- **Trust & Relationships:** *(1)* "This week, tell your manager directly about one piece of positive feedback you've gotten recently from a coworker, client, or vendor — even something small and informal. Don't wait for a review to bring it up." *(2)* "This week, check in with one coworker, client, or vendor you deal with regularly about something other than work — just once. Real trust is built in the moments that aren't about the task."
- **Human Judgment:** *(1)* "Starting today, keep a running one-line note every time you make a judgment call at work — what you decided and why. In a few months, that's real, written proof of the judgment you use every day." *(2)* "This week, think back over the last month and pick one good call you made that wasn't obvious from the outside. Mention it to your supervisor in one sentence — no big deal, just so it's on the record."
- **Problem Solving:** *(1)* "This week, ask your supervisor directly: 'Is there anything that keeps coming up that nobody's found a good fix for?' Then take a shot at it." *(2)* "This week, think of one thing you've figured out how to do better or faster than the official way, and write it down in a sentence or two. That's the start of a track record."
- **Physical Presence:** *(1)* "This week, ask your supervisor about cross-training on one specific piece of equipment or task outside your normal role." *(2)* "This week, ask your supervisor if there's a hands-on project or task coming up that needs an extra set of hands, and volunteer before they finish asking."
- **Licensing & Credentials:** *(1)* "This month, look up the one most common license or certification in your field and find out exactly what it requires. You don't have to start it — just know what's involved." *(2)* "If you're already working toward a license or certification, mention it to your supervisor this month — it's the kind of thing that gets remembered when responsibilities, or promotions, come up."

**Why:** Current V1 tips are broad-strokes; Workplace Moves needs tighter, more specific advice tied to the user's actual weak/strong categories, not just their overall tier. This is also where the lunch-break test (see Design Principles) was established as a standard for all future content.
**Files:** `src/utils/roadmap/workplaceMoves.js` *(new)*, references `src/pages/Results.jsx`'s existing `RESOURCES` for continuity
**Time:** 45 minutes *(content authoring complete; remaining time is porting into the data file)*
**Dependencies:** None

---

## Group K — Reveal Experience Shell

---

### K1 · Build the screen sequencer
**What:** A component that renders one "screen" at a time from an ordered list, advances on explicit user action (tap/click, not auto-scroll), and supports per-transition pacing (deliberate pause vs. near-instant) as configuration, not hardcoded per screen.
**Why:** This is the foundational container every other Group K–N task plugs into. Matches the "Apple setup" pacing model agreed during design.
**Files:** `src/components/roadmap/RevealSequencer.jsx` *(new)*
**Time:** 90 minutes
**Dependencies:** None

---

### K2 · Remove the page-count indicator; add ambient act-based progress
**What:** No visible "Screen 3 of 11." Instead, a subtle indicator (e.g., a thin fill bar with no number) reflecting progress through the *current act* only, resetting visually at each act boundary.
**Why:** A visible counter is what makes a sequence feel like a wizard instead of a conversation — explicitly identified as the top priority for the "continuous conversation" goal.
**Files:** `src/components/roadmap/RevealSequencer.jsx`, `src/index.css`
**Time:** 30 minutes
**Dependencies:** K1

---

### K3 · Implement the three-act visual grouping
**What:** Background tone shifts at act boundaries — Act 1 (Screens 0–4) dark-hero, Act 2 (Screens 5–9) white/light, Act 3 (Screen 10) light-distinct, Screen 11 returns to dark-hero to bookend with Screen 0–1. Reuses the alternating dark-hero/white pattern already established on the existing Results page.
**Why:** Ambient progress signal replacing the removed page-counter, and the mechanism that makes the Screen 0/11 callback land visually, not just verbally.
**Files:** `src/index.css`, `src/components/roadmap/RevealSequencer.jsx`
**Time:** 45 minutes
**Dependencies:** K1, K2

---

### K4 · Implement the phase-marker beat (Act 1 → Act 2)
**What:** The one-line wordless-in-spirit transition ("Now, here's exactly how.") between Screen 5 and Screen 6, as its own brief beat with the Act 2 background already applied.
**Why:** Re-arms attention before the four-screen toolkit stretch (Learn/Use/Workplace Moves/Prove), addressing the late-stage fatigue risk identified in the full-sequence review.
**Files:** `src/components/roadmap/RevealSequencer.jsx`
**Time:** 15 minutes
**Dependencies:** K1, K3

---

## Group L — Act 1 Screens: Where You Stand (0–4)

---

### L1 · Screen 0 — Welcome
**What:** Single line, full-bleed, dark-hero background: *"Let's look at your job — not through AI headlines, but through what's actually true for you."* One button: **Show Me.** Deliberate pause before advancing (per K1's pacing config).
**Why:** Answers "is this safe to engage with" before any data is shown; the tap is the user's first act of consent/control.
**Files:** `src/components/roadmap/screens/WelcomeScreen.jsx` *(new)*
**Time:** 20 minutes
**Dependencies:** K1

---

### L2 · Screen 1 — Score
**What:** Reuses the existing score reveal (count-up animation, range bar, marker slide-in) from `Results.jsx`, adapted into a standalone reveal screen. Near-instant transition into Screen 2 (per K1's pacing config) — this is the one gap in the sequence that should barely be felt.
**Why:** The anchor of the whole report; already built and battle-tested in V1, just re-hosted as a reveal screen.
**Files:** `src/components/roadmap/screens/ScoreScreen.jsx` *(new, largely extracted from `Results.jsx`)*
**Time:** 45 minutes
**Dependencies:** K1, L1

---

### L3 · Screen 2 — Why You Received This Score
**What:** Revised copy per the design phase: names the strongest category with reasoning, and only *gestures* at the weak category ("One area is pulling your score down, and we'll get into exactly what... on the next screen") — no detail here, per the Screen 2/4 division-of-labor rule.
**Why:** Restores the control that a bare number momentarily removes.
**Files:** `src/components/roadmap/screens/WhyScreen.jsx` *(new)*
**Time:** 30 minutes
**Dependencies:** L2

---

### L4 · Screen 3 — Your Biggest Strengths
**What:** Full explanation + example tasks for the top 2 categories; a lighter quick-list (label + rank only) for the remaining 4, per the pacing fix. Ends by naming the weakest category as the setup line into Screen 4.
**Why:** Comprehensive strengths picture, lead-with-strength coaching principle; lightened per the dense-screens-adjacent finding.
**Files:** `src/components/roadmap/screens/StrengthsScreen.jsx` *(new)*
**Time:** 40 minutes
**Dependencies:** L3, J3 (category metadata reuse)

---

### L5 · Screen 4 — Tasks Most Likely to Change + Timeline (merged)
**What:** Full detail on the weak-category automation risk (the detail deliberately withheld from Screen 2), the merged timeline (from J1's dataset), and the explicit agency-restoring closing line: *"None of this is locked in. What happens between now and then is still up to you — and that's exactly what the rest of this plan is for."*
**Why:** The hardest content in the reveal; must prove it can end in control on its own, not rely on the transition into Screen 5 to do that work.
**Files:** `src/components/roadmap/screens/TasksChangingScreen.jsx` *(new)*
**Time:** 45 minutes
**Dependencies:** L4, J1

---

## Group M — Act 2 Screens: Your Plan (5–9)

---

### M1 · Screen 5 — AI Protection Plan
**What:** Adapts V1's existing Career Playbook (30/90/365-day actions, `src/utils/playbook.js`) into a reveal screen. Embeds the first personalization micro-question inline: *"About how many hours a week could you realistically put toward this?"*
**Why:** The pivot screen — this is the actual advice the rest of the report exists to deliver credibly.
**Files:** `src/components/roadmap/screens/ProtectionPlanScreen.jsx` *(new, reuses `src/utils/playbook.js`)*
**Time:** 45 minutes
**Dependencies:** L5, K4

---

### M2 · Screen 6 — Personalized Learning Plan
**What:** Filters J4's learning-resource library by the time-budget answer from M1, and embeds a second micro-question: *"Free resources only, or open to paid options too?"* Shows 1–3 matched resources max, never a long unfiltered list.
**Why:** Directly serves the "personalized without overwhelming" goal — fewer, better-matched resources over an exhaustive list.
**Files:** `src/components/roadmap/screens/LearningPlanScreen.jsx` *(new)*
**Time:** 45 minutes
**Dependencies:** M1, J4

---

### M3 · Screen 7 — Recommended Tools ("Use")
**What:** Surfaces 1–2 entries from J5's tools dataset, matched to the user's weakest/most-automatable category. Zero setup framing — "open this, try this, tonight."
**Why:** The AI-as-instrument reframe; the biggest emotional turn available in the plan section.
**Files:** `src/components/roadmap/screens/ToolsScreen.jsx` *(new)*
**Time:** 30 minutes
**Dependencies:** M2, J5

---

### M4 · Screen 8 — Workplace Moves (renamed from Tips)
**What:** Surfaces 2–3 entries from J6's dataset, manager-framed or union-framed depending on a lightweight personalization signal (or defaulting to manager-framed if skipped).
**Why:** Low-effort, high-leverage workplace-political actions distinct from resource-based learning.
**Files:** `src/components/roadmap/screens/WorkplaceMovesScreen.jsx` *(new)*
**Time:** 30 minutes
**Dependencies:** M3, J6

---

### M5 · Screen 9 — Recommended Certifications ("Prove")
**What:** Surfaces 1–2 entries from J2's dataset, tied to the user's weakest category (closing the diagnose→detail→solve thread started in Screens 2 and 4), filtered by the budget answer from M2.
**Why:** Formal credentialing is one of the most durable protections in the whole framework; closes the long-distance content thread deliberately, rather than repeating description already given.
**Files:** `src/components/roadmap/screens/CertificationsScreen.jsx` *(new)*
**Time:** 30 minutes
**Dependencies:** M4, J2

---

## Group N — Act 3 Screens: Looking Ahead (10–11)

---

### N1 · Screen 10 — Careers That Often Emphasize Your Strongest Skills
**What:** Surfaces 3–5 entries from J3's dataset, tied to the user's strongest category. Opens with the strengthened line: *"This isn't instead of everything you just built — it's simply what else is out there..."* Includes the "illustrative examples, not personalized advice" disclaimer.
**Why:** The safety-net section — arrives last, after a real plan to strengthen the current role has already been delivered, per the "protect current career first" principle.
**Files:** `src/components/roadmap/screens/SimilarCareersScreen.jsx` *(new)*
**Time:** 30 minutes
**Dependencies:** M5, J3

---

### N2 · Screen 11 — Your Roadmap Is Ready (close)
**What:** Dark-hero background (bookending Screens 0–1). Callback copy: *"This was supposed to be about what's actually true for you — not a headline, not a scare. You have a real plan now, built around what's already working in your favor. One thing matters more than the rest: [highest-leverage action]. Pick it, and start there."* Below: Save My Roadmap, See the Full Report, Share.
**Why:** The emotional climax of the reveal, merged with the practical save/share mechanism rather than treating them as separate beats.
**Files:** `src/components/roadmap/screens/RoadmapReadyScreen.jsx` *(new)*
**Time:** 45 minutes
**Dependencies:** N1, requires the "highest-leverage action" selection logic (simplest version: the top item from the Protection Plan's 30-day list)

---

## Group O — Reference Mode

---

### O1 · Build the single-page reference view
**What:** The same content from Screens 0–11, minus the pacing/sequencing mechanics — one scrollable page, in the visual style of today's `Results.jsx` (alternating dark-hero/white sections), reachable via "See the Full Report" from any reveal screen or on any return visit.
**Why:** Reveal mode is for the first impression; reference mode is for skimming, printing, sharing, and returning — a pure wizard can't do any of those well.
**Files:** `src/pages/CareerRoadmap.jsx` *(new — the eventual likely replacement/successor to `Results.jsx`, exact relationship TBD at implementation time)*
**Time:** 90 minutes
**Dependencies:** All of Groups L–N (reference mode reuses their content, not their sequencing)

---

### O2 · Print stylesheet for PDF export
**What:** A `@media print` stylesheet for the reference-mode page, and a "Download PDF" button triggering `window.print()` — per the earlier decision to avoid a PDF-generation library.
**Why:** Zero new dependencies, works everywhere, consistent with the smallest-footprint choice made during the design phase.
**Files:** `src/index.css`
**Time:** 45 minutes
**Dependencies:** O1

---

## Group P — Progress Tracking

---

### P1 · Extend share-link encoding for saved roadmaps
**What:** Extend `src/utils/share.js`'s encode/decode pattern to represent a roadmap state (not just a one-time result) — likely a timestamped snapshot rather than a single score, so a later re-check-in can compare against it.
**Why:** The chosen progress-tracking mechanism, resolving the "no accounts" vs. "track progress over time" tension from the design phase — reuses proven V1 infrastructure instead of introducing accounts.
**Files:** `src/utils/share.js`
**Time:** 60 minutes
**Dependencies:** None (can be built independent of the reveal UI)

---

### P2 · "Save My Roadmap" flow
**What:** Wires Screen 11's Save button (N2) to P1's encoding, producing a bookmarkable/emailable link.
**Why:** The mechanism, made real.
**Files:** `src/pages/CareerRoadmap.jsx`, `src/components/roadmap/screens/RoadmapReadyScreen.jsx`
**Time:** 30 minutes
**Dependencies:** N2, P1

---

### P3 · Lightweight "what's changed?" re-check-in flow
**What:** A short flow (6–8 questions max, not the full 30) for a returning user, covering only the factors most likely to have shifted. Produces an updated score for comparison against the saved snapshot.
**Why:** Explicitly identified during design as the difference between a feature people use once and one they actually return to — full 30-question retakes are too much friction for a check-in.
**Files:** `src/pages/RoadmapCheckIn.jsx` *(new)*
**Time:** 90 minutes
**Dependencies:** P1

---

### P4 · Before/after score comparison view
**What:** A simple visual (not a full new score reveal) showing the saved score next to the current one, with a one-line summary of what moved.
**Why:** The concrete "you're improving" payoff that makes Progress Tracking feel real.
**Files:** `src/pages/CareerRoadmap.jsx`
**Time:** 45 minutes
**Dependencies:** P3

---

### P5 · Protection Plan checklist
**What:** Lets a user mark individual Protection Plan action items complete, independent of a full re-assessment — stored in the same saved-roadmap link (P1), not a separate mechanism.
**Why:** Gives a sense of progress between formal re-check-ins; small completions build momentum toward the next one.
**Files:** `src/components/roadmap/screens/ProtectionPlanScreen.jsx`, `src/utils/share.js`
**Time:** 45 minutes
**Dependencies:** M1, P1

---

## Group Q — Final QA & Release

---

### Q1 · Full reveal-mode walkthrough test, multiple personas
**What:** Walk the entire Screen 0–11 sequence for at least three synthetic personas spanning LOW/MEDIUM/HIGH risk, verifying every embedded personalization question, every dataset lookup, and every act transition renders correctly.
**Files:** No code changes — test only
**Time:** 45 minutes
**Dependencies:** All of Groups K–N

---

### Q2 · Reference-mode test
**What:** Verify the single-page view matches reveal-mode content exactly, prints cleanly, and the existing V1 share/copy-as-text/share-on-X mechanisms still work unmodified.
**Files:** No code changes — test only
**Time:** 30 minutes
**Dependencies:** O1, O2

---

### Q3 · Progress-tracking round-trip test
**What:** Save a roadmap, simulate returning later, run the re-check-in flow, confirm the before/after comparison and checklist state persist correctly through the link alone (no server storage).
**Files:** No code changes — test only
**Time:** 30 minutes
**Dependencies:** All of Group P

---

### Q4 · Mobile smoke test for the reveal UI
**What:** Verify screen transitions, tap targets on embedded personalization questions, and act-background rendering all work at real mobile widths — same rigor as V1's I3.
**Files:** Likely minor fixes to `src/index.css`
**Time:** 30 minutes
**Dependencies:** Q1

---

### Q5 · Version 2 release checkpoint
**What:** Once Q1–Q4 pass, tag `v2.0.0` following the same pattern as `v1.0.0` — annotated tag, message summarizing full V2 scope, pushed to `origin`.
**Files:** No code changes
**Time:** 15 minutes
**Dependencies:** Q1, Q2, Q3, Q4

---

## Summary

| Group | Theme | Tasks |
|-------|-------|-------|
| J | Content Data Foundations | J1–J6 |
| K | Reveal Experience Shell | K1–K4 |
| L | Act 1 Screens (Where You Stand) | L1–L5 |
| M | Act 2 Screens (Your Plan) | M1–M5 |
| N | Act 3 Screens (Looking Ahead) | N1–N2 |
| O | Reference Mode | O1–O2 |
| P | Progress Tracking | P1–P5 |
| Q | Final QA & Release | Q1–Q5 |

## Recommended build order

J (all content data, fully independent) → K (shell) → L → M → N (screens, in act order, each depending on the previous) → O (reference mode, once all screen content exists) → P (progress tracking, can start in parallel with O once J1 is done) → Q last.
