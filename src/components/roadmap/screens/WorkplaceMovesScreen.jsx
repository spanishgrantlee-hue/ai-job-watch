import { useState } from 'react';
import { WORKPLACE_MOVES } from '../../../utils/roadmap/workplaceMoves.js';

// ─── Workplace Moves (Screen 8) ────────────────────────────────────────────────
// Shows the user's weakest category's 2 moves from J6's dataset (read-only
// import, no changes there). The union toggle only visibly changes anything
// for Accountability's first move -- that's the only entry with a
// unionVariant in the current data, not a bug in this screen.
// onAnswerUnion is a plain callback prop, same pattern as M1's onAnswerHours
// -- never gates Continue, defaults to manager-framed if skipped.

export default function WorkplaceMovesScreen({ weakestCategory, onAnswerUnion, onAdvance }) {
  const [isUnion, setIsUnion] = useState(false);
  const moves = WORKPLACE_MOVES[weakestCategory.key];

  function handleToggleUnion() {
    const next = !isUnion;
    setIsUnion(next);
    onAnswerUnion?.(next);
  }

  return (
    <div className="workplace-moves-screen">
      <div className="section-label">Workplace Moves</div>
      <h2 className="results-section-title">Two moves you can make at work</h2>
      <p className="results-section-desc">
        For <strong>{weakestCategory.label}</strong>, here are two small, practical moves &mdash; no big ask, no waiting for the right moment.
      </p>

      <button
        type="button"
        className={`protection-plan-option${isUnion ? ' protection-plan-option--selected' : ''}`}
        onClick={handleToggleUnion}
        aria-pressed={isUnion}
      >
        I&rsquo;m in a union
      </button>

      <div className="resources-tips">
        {moves.map((move, i) => (
          <div className="resources-tip-card" key={i}>
            <span className="resources-tip-num" aria-hidden="true">{i + 1}</span>
            <div>
              <p className="resources-tip-text">{move.text}</p>
              {isUnion && move.unionVariant && (
                <p className="workplace-moves-union-note">{move.unionVariant}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="btn-primary workplace-moves-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
