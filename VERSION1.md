# Version 1 — Complete Implementation Checklist

> **Scope:** Polish, SEO, shareability, UX improvements, performance.
> **No new database. No auth. No paid features.**
> Every task below is the smallest logical unit of work. Do them in order — dependencies are noted.

---

## Group A — SEO Foundation

---

### A1 · Create `robots.txt` ✓ DONE
**What:** A plain-text file telling search engines which pages to crawl.
**Why:** Without it, Google may deprioritize or unpredictably crawl the site. Required baseline for any indexing strategy.
**Files:** `public/robots.txt` *(new file)*
**Time:** 5 minutes
**Dependencies:** None

---

### A2 · Create `sitemap.xml` ✓ DONE
**What:** An XML file listing all four public URLs with their priority and change frequency.
**Why:** Tells Google exactly what pages exist and how often they change. Speeds up indexing of `/about`, `/assessment`, and future `/results/shared` pages.
**Files:** `public/sitemap.xml` *(new file)*
**Time:** 10 minutes
**Dependencies:** None

---

### A3 · Install `react-helmet-async` ✓ DONE
**What:** Add the `react-helmet-async` npm package to the project.
**Why:** Allows each page component to inject its own `<title>`, `<meta>`, and `<link>` tags into `<head>` at runtime. The "async" variant is required for React 19 (avoids the stale-closure issue in the original `react-helmet`).
**Files:** `package.json`, `package-lock.json`
**Time:** 5 minutes
**Dependencies:** None

---

### A4 · Wrap the app with `HelmetProvider` ✓ DONE
**What:** Import `HelmetProvider` from `react-helmet-async` and wrap the return value of `App.jsx` with it.
**Why:** Every page-level `<Helmet>` component must be a descendant of exactly one `HelmetProvider`. This is the single setup step that makes A5–A9 work.
**Files:** `src/main.jsx` or `src/App.jsx`
**Time:** 5 minutes
**Dependencies:** A3

---

### A5 · Add default meta tags to `index.html` ✓ DONE
**What:** Add `<meta name="description">`, a default `<title>`, Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`), and Twitter Card tags to the `<head>` of `index.html`.
**Why:** These are the fallback tags that crawlers and link-preview bots see before React renders. Every page that doesn't override them inherits these. Also the only tags a bot will ever see without JavaScript execution.
**Files:** `index.html`
**Time:** 15 minutes
**Dependencies:** None (independent of Helmet setup)

---

### A6 · Add `<Helmet>` to `Home.jsx` ✓ DONE
**What:** Import `Helmet` from `react-helmet-async` and add a `<Helmet>` block at the top of the Home component with a page-specific title (`"Is Your Job Safe from AI? | AI Job Watch"`) and description focused on the assessment tool.
**Why:** Home is the highest-traffic page. A specific, keyword-rich title and description improve click-through rate from search results.
**Files:** `src/pages/Home.jsx`
**Time:** 10 minutes
**Dependencies:** A3, A4

---

### A7 · Add `<Helmet>` to `About.jsx` ✓ DONE
**What:** Page-specific title (`"About AI Job Watch | Methodology & Scoring"`) and a description covering the scoring methodology and privacy stance.
**Why:** The About page will be linked from other sites covering AI policy and labor — a proper title makes those links count.
**Files:** `src/pages/About.jsx`
**Time:** 10 minutes
**Dependencies:** A3, A4

---

### A8 · Add `<Helmet>` to `Assessment.jsx` ✓ DONE
**What:** Page-specific title (`"AI Job Assessment | AI Job Watch"`) and a description focused on the 30-question format and instant result.
**Why:** People search for "AI job risk assessment" and similar phrases. This page needs its own title so it can rank independently from the home page.
**Files:** `src/pages/Assessment.jsx`
**Time:** 10 minutes
**Dependencies:** A3, A4

---

### A9 · Add JSON-LD structured data to `Home.jsx` ✓ DONE
**What:** Inject a `<script type="application/ld+json">` block using Helmet containing Schema.org `WebApplication` or `Quiz` markup — name, description, url, application category.
**Why:** Structured data enables Google rich results (e.g., a "Take the Quiz" action button directly in search results). This is a significant click-through rate multiplier at no cost.
**Files:** `src/pages/Home.jsx`
**Time:** 20 minutes
**Dependencies:** A3, A4

---

## Group B — OG Images

---

### B1 · Create default OG image ✓ DONE
**What:** A 1200×630px image (`public/og-default.png`) branded with the AI Job Watch name, a one-line description ("Find out how safe your job is from AI automation"), and the site's color scheme.
**Why:** Every social share, iMessage link preview, and Slack unfurl shows this image. It's the first visual impression of the brand.
**Files:** `public/og-default.png` *(new file)*
**Time:** 30 minutes
**Dependencies:** None

---

### B2 · Create HIGH RISK OG image ✓ DONE
**What:** A 1200×630px image (`public/og-high.png`) designed around the HIGH risk state — the same branding as B1 but with a distinct visual that indicates "high risk" (e.g., a red accent, a risk indicator graphic).
**Why:** When a user with a HIGH risk score shares their result link, this image will show in the preview, making the share visually distinct and more likely to generate engagement from worried coworkers.
**Files:** `public/og-high.png` *(new file)*
**Time:** 20 minutes
**Dependencies:** B1 (reuse branding established there)

---

### B3 · Create MEDIUM RISK OG image ✓ DONE
**What:** Same as B2 but for the MEDIUM risk state (`public/og-medium.png`), with an amber/orange visual treatment.
**Files:** `public/og-medium.png` *(new file)*
**Time:** 15 minutes
**Dependencies:** B1, B2

---

### B4 · Create LOW RISK OG image ✓ DONE
**What:** Same pattern, LOW risk state (`public/og-low.png`), green visual treatment.
**Files:** `public/og-low.png` *(new file)*
**Time:** 15 minutes
**Dependencies:** B1, B2

---

## Group C — Shareable Results Link

---

### C1 · Create `src/utils/share.js` — `encodeShareState()` ✓ DONE
**What:** A utility function that takes the calculated results object (`{ finalScore, riskKey, categories, aiExposurePenalty }`) and encodes it into a compact, URL-safe Base64 string using a short-key JSON format (e.g., `{"s":18,"r":"MEDIUM","c":[3,2,4,2,3,2],"e":2}`).
**Why:** The share URL must be self-contained — no server lookup, no database. All result data needed to reconstruct the results page travels in the URL itself. This function produces that string.
**Files:** `src/utils/share.js` *(new file)*
**Time:** 25 minutes
**Dependencies:** None

---

### C2 · Add `decodeShareState()` to `src/utils/share.js` ✓ DONE
**What:** The inverse of C1. Takes a Base64 string from the URL and returns the structured results object. Must handle malformed/corrupted input gracefully (return `null` on failure).
**Why:** The Results page needs to reconstruct the full results display from just the URL string. Graceful error handling prevents a broken share link from crashing the page.
**Files:** `src/utils/share.js`
**Time:** 20 minutes
**Dependencies:** C1

---

### C3 · Add "Copy Link" button to `Results.jsx` ✓ DONE
**What:** A button in the results hero section that calls `encodeShareState()`, builds the full share URL (`https://aijobwatch.com/results?share=<encoded>`), writes it to the clipboard using `navigator.clipboard.writeText()`, and shows a brief "Copied!" confirmation state.
**Why:** This is the primary sharing action. A direct clipboard copy is the fastest possible share action — no extra dialog, no navigation.
**Files:** `src/pages/Results.jsx`, `src/index.css`
**Time:** 25 minutes
**Dependencies:** C1

---

### C4 · Add "Share on X" button to `Results.jsx` ✓ DONE
**What:** A second share button that opens a new tab to `https://twitter.com/intent/tweet?text=...&url=...` with a pre-written tweet ("I just checked my AI risk score — got [X]/30 [MEDIUM] Risk. Check yours free:"). Opens in a new tab via `window.open`.
**Why:** Twitter/X is where tech workers share tools like this. A pre-filled tweet removes friction entirely. This is the single most cost-effective viral distribution mechanism available at v1.
**Files:** `src/pages/Results.jsx`, `src/index.css`
**Time:** 20 minutes
**Dependencies:** C1

---

### C5 · Render shared results from URL in `Results.jsx` ✓ DONE
**What:** At the top of the `Results` component, check for a `?share=` query parameter using `useSearchParams()`. If present, call `decodeShareState()` and use that data to populate the results display instead of `calculateResults(answers)`. Show a banner ("You're viewing someone else's results — take the assessment yourself") when in shared view mode.
**Why:** This is what makes the share link actually work. Without this, the share URL routes to the empty-state "No Results Yet" screen.
**Files:** `src/pages/Results.jsx`
**Time:** 50 minutes
**Dependencies:** C2

---

### C6 · Add dynamic `<Helmet>` to `Results.jsx` ✓ DONE
**What:** When results are available (either from assessment or from shared URL), inject a `<Helmet>` block with: a dynamic title (`"My AI Risk Score: 18/30 Medium Risk | AI Job Watch"`), a dynamic description summarizing the result, `og:image` pointing to the appropriate risk-tier OG image (B2/B3/B4), and `og:url` pointing to the share URL.
**Why:** When someone shares the link on Twitter, LinkedIn, or iMessage, the platform fetches the page and reads these tags. A generic title ("AI Job Watch") gets ignored. A personal title ("Score: 18/30 — Medium Risk") generates curiosity and clicks.
**Files:** `src/pages/Results.jsx`
**Time:** 25 minutes
**Dependencies:** A3, A4, B2, B3, B4, C5

---

### C7 · Extend `save-result.js` to store the share URL ✓ DONE
**What:** After saving to Netlify Blobs, compute the share URL using the same encoding logic (duplicated or imported as a Node-compatible version) and include `shareUrl` in the stored blob record.
**Why:** Future analytics and the v3 benchmarking feature will benefit from having the share URL stored alongside the result. Also allows generating a leaderboard or "recent results" feed later.
**Files:** `netlify/functions/save-result.js`, potentially `src/utils/share.js` (may need a CJS-compatible version or inline duplication for the serverless context)
**Time:** 30 minutes
**Dependencies:** C1

---

## Group D — Copy Results as Text

---

### D1 · Create `generateTextSummary()` in `src/utils/share.js` ✓ DONE
**What:** A function that takes the results object and returns a plain-text multi-line string: score, risk level, top 3 categories, and the personalized summary headline. Formatted cleanly for pasting into Slack, email, or a text message.
**Why:** Not everyone wants to share a link. Many users will want to paste their score into a work chat or send it to a friend. Plain text is the most portable format.
**Files:** `src/utils/share.js`
**Time:** 20 minutes
**Dependencies:** None (results object structure already known)

---

### D2 · Add "Copy as Text" button to `Results.jsx` ✓ DONE
**What:** A button (near the share buttons from C3/C4) that calls `generateTextSummary()`, copies the result to clipboard, and shows a "Copied!" confirmation.
**Why:** Gives users a second sharing option for contexts where a link isn't appropriate. Increases total sharing surface area at near-zero implementation cost.
**Files:** `src/pages/Results.jsx`, `src/index.css`
**Time:** 15 minutes
**Dependencies:** D1

---

## Group E — What-If Mode

---

### E1 · `WhatIfPanel.jsx` — category-level score explorer ✓ DONE
**What:** `src/components/WhatIfPanel.jsx` lets users adjust the 6 category scores (Accountability, Trust, Judgment, Problem Solving, Physical Presence, Licensing) and the AI Exposure Penalty directly via +/− stepper controls, rather than the 6 raw questions originally scoped (Q6, Q7, Q8, Q16, Q22, Q25). Live-recalculates a projected score/risk band and surfaces a per-category "why" coaching sentence explaining what's driving the change.
**Why:** Adjusting category scores — the same units used throughout the rest of the results page — is a more direct, meaningful lever than 6 arbitrary raw questions, and pairs naturally with the coaching content elsewhere on the page. Redesigned from the original slider/question-based spec during the "refactor What-If Explorer as coaching tool" pass.
**Files:** `src/components/WhatIfPanel.jsx`
**Time:** 60 minutes
**Dependencies:** Familiarity with `scoring.js` and `share.js` (`CAT_ORDER`, `CATEGORY_META`)

---

### E2 · Wire What-If mode into `Results.jsx` ✓ DONE
**What:** A `showWhatIf` boolean toggles a "Try adjusting my scores" / "Hide" button in the "How to Improve Your Score" section. When open, `WhatIfPanel` renders inline with the user's real `categories`, `aiExposurePenalty`, `finalScore`, and `riskKey` as props, and manages its own internal what-if state — it does not override `calculateResults` for the rest of the page, and there's no separate "What-If Mode" banner or explicit "Your score: X → What-If score: Y" comparison. Instead, the panel shows the live projected score/risk band plus a narrative coaching sentence describing what's driving the change.
**Why:** A self-contained, always-in-place panel keeps the rest of the results page (Career Playbook, What Protects Your Job, etc.) anchored to the user's real score while still making "what if" exploration interactive — avoids the risk of the whole page silently switching to hypothetical numbers and confusing the user about which score is real.
**Files:** `src/pages/Results.jsx`
**Time:** 45 minutes
**Dependencies:** E1

---

### E3 · Style WhatIfPanel in `index.css` ✓ DONE
**What:** ~47 `.whatif-*` selectors covering the panel container, category adjustment rows, +/− stepper buttons, the projected-score display (color-coded by projected risk tier), and the coaching sentence. Matches the app's existing design tokens (CSS variables, spacing, radius).
**Why:** The feature is only valuable if it's clear and easy to use, and needs to visually distinguish "projected" from "real" without a jarring full-page mode switch.
**Files:** `src/index.css`
**Time:** 35 minutes
**Dependencies:** E1, E2

---

## Group F — Assessment UX Polish

---

### F1 · Verify and improve progress display in `Assessment.jsx`
**What:** The progress bar already shows "Section X of Y — Title" and "X% complete". Verify the percentage feels accurate (currently `currentSection / TOTAL_SECTIONS` — entering section 1 shows 14%, which may feel off). Consider changing the formula to `(currentSection - 1) / TOTAL_SECTIONS` so it starts at 0% and reaches 100% on the final section.
**Why:** A progress bar that starts at 14% on question 1 creates a misleading sense of how much is left. Starting at 0% is more honest. This is a one-line change but matters for first impressions.
**Files:** `src/pages/Assessment.jsx`
**Time:** 10 minutes
**Dependencies:** None

---

### F2 · Keyboard navigation for choice buttons ✓ DONE
**What:** `QuestionBlock`'s `.choice-btn` list implements a roving-tabindex `role="radiogroup"` pattern: `ArrowDown`/`ArrowRight` moves to the next choice, `ArrowUp`/`ArrowLeft` to the previous, `Home`/`End` jump to first/last, and moving focus also selects (matching native radio behavior). Verified live via keyboard-only browser testing on 2026-07-22.
**Why:** Power users and accessibility-conscious users navigate forms with a keyboard. Currently, tabbing to a choice group and pressing Enter does nothing useful — you have to mouse-click each answer. This is also required for WCAG 2.1 AA compliance (`role="radiogroup"` implies keyboard navigation).
**Files:** `src/pages/Assessment.jsx`
**Time:** 45 minutes
**Dependencies:** None

---

### F3 · Sticky navigation on all screen sizes ✓ DONE
**What:** Fixed `.assessment-nav` to the bottom of the viewport on all screen sizes (not just mobile), with screen-specific button sizing and padding. Body gets bottom padding at all three breakpoints to prevent questions from being hidden behind the bar.
**Why:** On mobile, the Next button can be two or three full screens below the first question on multi-question sections. Users get confused and abandon. Extended to all screen sizes after testing revealed the same friction on desktop during longer sections.
**Files:** `src/index.css`
**Time:** 25 minutes
**Dependencies:** None

---

## Group G — Results Page Animations

---

### G1 · Animate the score number counting up ✓ DONE
**What:** `Results.jsx`'s mount `useEffect` runs a `requestAnimationFrame` loop that animates `displayScore` from 0 to the real `finalScore` over 900ms using a cubic ease-out curve (`1 - (1-t)^3`). The score hero renders `{displayScore}` in place of the raw value.
**Why:** Counting-up animations on score reveals are one of the most effective attention-holding techniques for assessment results. They create anticipation, make the number feel earned, and increase time-on-page.
**Files:** `src/pages/Results.jsx`
**Time:** 30 minutes
**Dependencies:** None

---

### G2 · Animate the score range bar marker — NOT YET IMPLEMENTED
**What:** `ScoreRangeBar` (`Results.jsx:190-209`) computes `markerPct` synchronously from the final `finalScore` prop and renders `.score-marker` at its resting position immediately on mount. There is no animation state, no `useEffect`, no `requestAnimationFrame`/`setTimeout`, and `.score-marker` in `index.css` has no `transition` property — the marker appears instantly rather than sliding into place. The task as originally scoped (animate `markerPct` from 0, add a `left` transition) has not been done.
**Why:** The marker sliding into position on the risk bar reinforces where the user sits and provides a satisfying visual moment that makes the result feel significant.
**Files:** `src/pages/Results.jsx`, `src/index.css`
**Time:** 20 minutes
**Dependencies:** None

---

### G3 · Stagger-reveal category breakdown cards — NOT YET IMPLEMENTED
**What:** `.category-row` (`index.css:1150`) has no `@keyframes`, no `animation` property, and no per-row `animation-delay` — cards render instantly with no reveal effect. The only `@keyframes` block in `index.css` (`whatif-enter`) belongs to the Group E What-If panel, not this feature. The `fadeInUp` stagger described below has not been built.
**Why:** The category breakdown is information-dense. Staggering the appearance directs the user's eye down the list sequentially rather than presenting everything at once, which feels overwhelming on first load.
**Files:** `src/index.css`, minor change to `src/pages/Results.jsx` (add delay via inline style)
**Time:** 25 minutes
**Dependencies:** None

---

## Group H — Performance & Lighthouse

---

### H1 · Add `loading="lazy"` to images
**What:** Add `loading="lazy"` to every `<img>` tag in `Home.jsx` that is below the fold (the hero image is above the fold and should use `loading="eager"` or no attribute).
**Why:** The hero image is already loaded eagerly. Below-fold images delay LCP and Total Blocking Time if loaded upfront. This is a one-attribute change that improves Lighthouse Performance score.
**Files:** `src/pages/Home.jsx`
**Time:** 10 minutes
**Dependencies:** None

---

### H2 · Add preconnect hints for GA4 and fonts
**What:** Add `<link rel="preconnect" href="https://www.googletagmanager.com">` and `<link rel="dns-prefetch" href="https://www.google-analytics.com">` to `<head>` in `index.html`.
**Why:** GA4 loads a script from `googletagmanager.com` that currently incurs a DNS + TLS handshake cost on every page load. Preconnect eliminates that overhead and improves Time to Interactive by ~100–300ms on cold connections.
**Files:** `index.html`
**Time:** 5 minutes
**Dependencies:** None

---

### H3 · Run Lighthouse audit and fix issues
**What:** Run `npm run build && npm run preview` locally, open Chrome DevTools → Lighthouse, run against all four pages, document scores, and fix anything scoring below 90 in Performance, Accessibility, Best Practices, and SEO.
**Why:** Lighthouse is the single source of truth for production readiness. This task is intentionally open-ended — the specific fixes depend on what the audit reveals. Known likely issues: missing `alt` tags, color contrast ratios on the dark hero, render-blocking resources.
**Files:** Any file flagged by the audit — likely `src/index.css`, `src/pages/Home.jsx`, `index.html`
**Time:** 60 minutes
**Dependencies:** All prior groups completed (so the audit reflects the full v1 state)

---

## Group I — Final QA & Release

---

### I1 · End-to-end share link test
**What:** Complete a full assessment → click Copy Link → paste URL in a new incognito tab → verify the results page renders correctly from the shared URL → verify the "You're viewing someone else's results" banner appears → click "Take the assessment yourself" and verify it routes to `/assessment`.
**Why:** The share link is the most complex new flow in v1. A manual round-trip test catches encoding edge cases (score = 0, all HIGH categories, etc.) that unit tests might miss.
**Files:** No code changes — test only
**Time:** 20 minutes
**Dependencies:** C1–C6 complete

---

### I2 · Keyboard navigation test on assessment ✓ DONE
**What:** Tabbed through Sections 1–2 of the assessment using only the keyboard, verified programmatically (`document.activeElement`, `getBoundingClientRect()`) rather than by visual inspection alone. Confirmed: Arrow/Home/End move and select within each radiogroup, Tab/Shift+Tab move correctly in and out of groups, Enter activates Next, and focus moves to the section heading on section transition. Found one real bug in the process — the sticky nav bar could render on top of the currently-focused choice button, hiding it from view (measured via bounding-rect overlap). Fixed with `scroll-margin-bottom` on `.choice-btn`, `.question-input`, and `.question-textarea`, re-verified at both the mobile and desktop breakpoints.
**Why:** Keyboard nav is easy to implement but hard to verify without actually doing it. Bugs here (focus traps, wrong arrow direction, hidden focus) are invisible to sighted mouse users but a complete blocker for screen reader and keyboard-only users.
**Files:** `src/index.css` (fix); no other code changes
**Time:** 15 minutes
**Dependencies:** F2 complete

---

### I3 · Mobile layout smoke test
**What:** Use Chrome DevTools device emulator (iPhone 14 viewport) to walk through Home → Assessment → Results. Verify: sticky Next button doesn't obscure questions, share buttons are tap-friendly (44px minimum touch target), score animations play correctly, OG image dimensions don't cause layout shift.
**Why:** The assessment form is particularly fragile on mobile due to the sticky progress bar + sticky Next button + scrollable question list all competing for viewport space.
**Files:** Likely minor fixes to `src/index.css`
**Time:** 25 minutes
**Dependencies:** F3 complete, G1–G3 complete

---

### I4 · Verify clean production build
**What:** Run `npm run build` and confirm zero errors, zero warnings that indicate missing assets or broken imports, and that `dist/index.html` contains the GA4 snippet and default meta tags.
**Why:** Vite's build can succeed even with warnings that indicate real issues (e.g., missing dynamic imports, unresolved assets). A clean build with eyes on the output is required before deploy.
**Files:** No code changes
**Time:** 10 minutes
**Dependencies:** All groups complete

---

### I5 · Commit and push Version 1
**What:** Stage all changed files, write a descriptive commit message summarizing v1 scope, push to `origin/main`.
**Why:** Creates a clean git checkpoint for v1. If v2 work introduces regressions, we have a known-good v1 state to diff against.
**Files:** All modified files
**Time:** 10 minutes
**Dependencies:** I1–I4 passing

---

## Summary

| Group | Theme | Tasks | Est. Time |
|-------|-------|-------|-----------|
| A | SEO Foundation | A1–A9 | ~1.5 hrs |
| B | OG Images | B1–B4 | ~1.5 hrs |
| C | Shareable Link | C1–C7 | ~3.5 hrs |
| D | Copy as Text | D1–D2 | ~35 min |
| E | What-If Mode | E1–E3 | ~2.5 hrs |
| F | Assessment UX | F1–F3 | ~1.5 hrs |
| G | Result Animations | G1–G3 | ~1.5 hrs |
| H | Performance | H1–H3 | ~1.5 hrs |
| I | QA & Release | I1–I5 | ~1.5 hrs |
| | **Total** | **35 tasks** | **~16 hrs** |

---

## Recommended Build Order

A1–A5 first (pure foundation, no risk), then C1–C2 (share utilities, no UI yet), then B1–B4 (images, unblocks C6), then C3–C7 (full share feature), then D, E, F, G, H in any order, then I last.
