// ─── Roadmap progress (Protection Plan checklist) ─────────────────────────────
// Remembers which Protection Plan steps the user has ticked on /roadmap, in
// this browser only, so progress survives a reload or a later visit.
//
// Stored under its own key -- never inside the answers object -- so it stays
// local: Results' save-result call sends `answers` to the server, and this
// must never ride along with it.
//
// Only the live /roadmap view reads or writes this. ?share=, ?snapshot= and
// ?compare= views keep using the checklist carried in their own link, so a
// link someone opens can never overwrite (or be mixed into) their own
// progress.

const ROADMAP_CHECKLIST_KEY = 'aijobwatch_roadmap_checklist';

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
