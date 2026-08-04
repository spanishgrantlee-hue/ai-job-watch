import { useState } from 'react';
import { PLAYBOOK, playbookLevel } from '../../../utils/playbook.js';

// ─── AI Protection Plan (Screen 5) ─────────────────────────────────────────────
// Reuses Results.jsx's Career Playbook logic exactly (two weakest categories,
// Start-here/Then-this ranking, This-Week/Next-Few-Months/Long-Term structure)
// -- read-only reuse of playbook.js, no changes there. Act 2's first screen, so
// it reuses the existing light-background playbook-card CSS as-is.
//
// Embeds the first personalization micro-question. onAnswerHours is a plain
// prop callback (same pattern as every other data prop these screens receive)
// -- this component doesn't know or care how the answer is stored; that's
// decided by whatever assembles the full screen sequence later. Continue is
// never gated on answering it: personalization here is additive, not required.
//
// Checklist (P5): each of the 6 timeline items (2 categories x 3 timeframes)
// can be marked complete. Keyed "categoryKey:timeframe" to stay meaningful
// even if the weakest categories change later (e.g. after a check-in).
// initialChecklist/onChecklistChange follow the same "accept state + notify,
// don't own persistence" pattern as onAnswerHours -- the checklist itself is
// stored in the saved-roadmap snapshot (share.js), not owned by this screen.

const HOURS_OPTIONS = [
  { key: 'low',  label: 'A few minutes a week' },
  { key: 'mid',  label: '1–3 hours a week' },
  { key: 'high', label: '5+ hours a week' },
];

const TIMELINE_ITEMS = [
  { key: 'days30', label: 'This Week' },
  { key: 'days90', label: 'Next Few Months' },
  { key: 'year1',  label: 'Long-Term' },
];

function PlanCard({ category, rank, checklist, onToggleItem }) {
  const level = playbookLevel(category.score);
  const data = PLAYBOOK[category.key];
  if (!data) return null;

  const badgeClass =
    category.score <= 2 ? 'playbook-score-badge--low'
    : category.score === 3 ? 'playbook-score-badge--mid'
    : 'playbook-score-badge--high';

  return (
    <div className="playbook-card">
      <div className="playbook-card-top">
        <span className="playbook-card-rank">{rank === 1 ? 'Start here' : 'Then this'}</span>
        <span className={`playbook-score-badge ${badgeClass}`}>{category.score}<span className="playbook-score-denom">/5</span></span>
      </div>
      <h3 className="playbook-card-title">{category.label}</h3>
      <p className="playbook-card-context">{data.context[level]}</p>
      <div className="playbook-timeline">
        {TIMELINE_ITEMS.map(({ key: timeframe, label }) => {
          const checklistKey = `${category.key}:${timeframe}`;
          const complete = !!checklist[checklistKey];
          return (
            <div className={`playbook-item${complete ? ' playbook-item--complete' : ''}`} key={timeframe}>
              <label className="playbook-item-checkbox-row">
                <input
                  type="checkbox"
                  checked={complete}
                  onChange={() => onToggleItem(category.key, timeframe)}
                  aria-label={`Mark "${label}" complete for ${category.label}`}
                />
                <span className="playbook-item-label">{label}</span>
              </label>
              <p className="playbook-item-text">{data[timeframe][level]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProtectionPlanScreen({ rankedCategories, onAnswerHours, initialChecklist = {}, onChecklistChange, onAdvance }) {
  const [selectedHours, setSelectedHours] = useState(null);
  const [checklist, setChecklist] = useState(initialChecklist);
  const weakest = [...rankedCategories].reverse().slice(0, 2);

  function handleSelectHours(key) {
    setSelectedHours(key);
    onAnswerHours?.(key);
  }

  function handleToggleItem(categoryKey, timeframe) {
    const checklistKey = `${categoryKey}:${timeframe}`;
    const next = { ...checklist, [checklistKey]: !checklist[checklistKey] };
    setChecklist(next);
    onChecklistChange?.(next);
  }

  return (
    <div className="protection-plan-screen">
      <div className="section-label">AI Protection Plan</div>
      <h2 className="results-section-title">Your action plan, based on your scores</h2>
      <p className="results-section-desc">
        These are the two areas where a small improvement would make the biggest difference. Start with the first one &mdash; the second can wait a month.
      </p>

      <div className="playbook-grid">
        {weakest.map((cat, idx) => (
          <PlanCard key={cat.key} category={cat} rank={idx + 1} checklist={checklist} onToggleItem={handleToggleItem} />
        ))}
      </div>

      <div className="protection-plan-question">
        <p className="protection-plan-question-text">About how many hours a week could you realistically put toward this?</p>
        <div className="protection-plan-options">
          {HOURS_OPTIONS.map(opt => (
            <button
              type="button"
              key={opt.key}
              className={`protection-plan-option${selectedHours === opt.key ? ' protection-plan-option--selected' : ''}`}
              onClick={() => handleSelectHours(opt.key)}
              aria-pressed={selectedHours === opt.key}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button type="button" className="btn-primary protection-plan-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
