// ─── Roadmap progress (Protection Plan checklist + hours-per-week) ────────────
// Remembers, in this browser only, which Protection Plan steps the user has
// ticked and how many hours a week they said they have, so both survive a
// reload or a later visit. Shared by /roadmap (live view) and /reveal.
//
// Stored under their own keys -- never inside the answers object -- so they
// stay local: Results' save-result call sends `answers` to the server, and
// these must never ride along with it.
//
// Only the live /roadmap view and /reveal read or write these. ?share=,
// ?snapshot= and ?compare= views keep using what their own link carries (the
// hours choice is never in a link), so a link someone opens can never
// overwrite (or be mixed into) their own progress.

import { questions } from './questions.js';

const ROADMAP_CHECKLIST_KEY = 'aijobwatch_roadmap_checklist';
const ROADMAP_HOURS_KEY = 'aijobwatch_roadmap_hours';
const HOURS_KEYS = ['low', 'mid', 'high'];

const TIMEFRAMES = ['days30', 'days90', 'year1'];

export function loadChecklist() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ROADMAP_CHECKLIST_KEY));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function saveChecklist(checklist) {
  try {
    localStorage.setItem(ROADMAP_CHECKLIST_KEY, JSON.stringify(checklist));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — safe to ignore
  }
}

export function clearChecklist() {
  try {
    localStorage.removeItem(ROADMAP_CHECKLIST_KEY);
  } catch {
    // localStorage unavailable — safe to ignore
  }
}

// Hours-per-week choice: 'low' | 'mid' | 'high', or null when never chosen.
// Anything unrecognized reads as null -- today's default (no option selected,
// Learning Plan falls back to 'mid'), so users with older saved progress and
// no hours key see exactly what they saw before.
export function loadHours() {
  try {
    const value = localStorage.getItem(ROADMAP_HOURS_KEY);
    return HOURS_KEYS.includes(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveHours(key) {
  if (!HOURS_KEYS.includes(key)) return;
  try {
    localStorage.setItem(ROADMAP_HOURS_KEY, key);
  } catch {
    // localStorage unavailable — safe to ignore
  }
}

// Retake / Start Over: a new assessment starts with a completely fresh plan.
export function clearRoadmapProgress() {
  clearChecklist();
  try {
    localStorage.removeItem(ROADMAP_HOURS_KEY);
  } catch {
    // localStorage unavailable — safe to ignore
  }
}

// The two categories the Protection Plan shows: the user's two weakest.
// Shared by CareerRoadmap.jsx and Results.jsx so the steps Results counts are
// always exactly the steps /roadmap displays.
export function protectionPlanCategories(rankedCategories) {
  return [...rankedCategories].reverse().slice(0, 2);
}

// Progress across the steps currently shown (2 categories × 3 timeframes).
// Ticks for categories not currently shown stay stored but aren't counted.
export function countProgress(checklist, rankedCategories) {
  const keys = protectionPlanCategories(rankedCategories)
    .flatMap(category => TIMEFRAMES.map(timeframe => `${category.key}:${timeframe}`));
  return { done: keys.filter(key => checklist[key]).length, total: keys.length };
}

// ─── Check-in questions for the Protection Plan ───────────────────────────────
// The questions that feed a category's score are the ones whose answer
// choices carry a score for it -- the same `choice.scores[category]` values
// scoring.js averages (its getScore() reads exactly these). Deriving the list
// here, instead of copying scoring.js's formulas, keeps one source of truth;
// they only disagree if a question gains a score key that scoring.js's
// formula for that category doesn't include.
export function questionsForCategory(categoryKey) {
  return questions
    .filter(q => q.choices?.some(choice => choice.scores && categoryKey in choice.scores))
    .map(q => q.id);
}

const questionNumber = (id) => Number(id.slice(1));

// The check-in's base questions plus every question behind the worker's two
// Protection Plan categories, de-duplicated and in assessment order -- so the
// steps the plan asks for (a certification, a client relationship, hands-on
// work...) can actually show up in the re-score.
export function checkInQuestionIds(rankedCategories, baseIds) {
  const ids = new Set(baseIds);
  for (const category of protectionPlanCategories(rankedCategories)) {
    for (const id of questionsForCategory(category.key)) ids.add(id);
  }
  return [...ids].sort((a, b) => questionNumber(a) - questionNumber(b));
}
