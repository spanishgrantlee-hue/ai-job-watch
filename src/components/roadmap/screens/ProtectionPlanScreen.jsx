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

const HOURS_OPTIONS = [
  { key: 'low',  label: 'A few minutes a week' },
  { key: 'mid',  label: '1–3 hours a week' },
  { key: 'high', label: '5+ hours a week' },
];

function PlanCard({ category, rank }) {
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
        <div className="playbook-item">
          <span className="playbook-item-label">This Week</span>
          <p className="playbook-item-text">{data.days30[level]}</p>
        </div>
        <div className="playbook-item">
          <span className="playbook-item-label">Next Few Months</span>
          <p className="playbook-item-text">{data.days90[level]}</p>
        </div>
        <div className="playbook-item">
          <span className="playbook-item-label">Long-Term</span>
          <p className="playbook-item-text">{data.year1[level]}</p>
        </div>
      </div>
    </div>
  );
}

export default function ProtectionPlanScreen({ rankedCategories, onAnswerHours, onAdvance }) {
  const [selectedHours, setSelectedHours] = useState(null);
  const weakest = [...rankedCategories].reverse().slice(0, 2);

  function handleSelectHours(key) {
    setSelectedHours(key);
    onAnswerHours?.(key);
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
          <PlanCard key={cat.key} category={cat} rank={idx + 1} />
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
