import { useState } from 'react';
import { CATEGORY_META, RISK_THRESHOLDS } from '../utils/scoring';
import { CAT_ORDER } from '../utils/share';

function projectRisk(score) {
  if (score >= 24) return 'LOW';
  if (score >= 16) return 'MEDIUM';
  return 'HIGH';
}

export default function WhatIfPanel({ categories, aiExposurePenalty }) {
  const [scores, setScores]   = useState({ ...categories });
  const [penalty, setPenalty] = useState(aiExposurePenalty);

  const rawTotal  = CAT_ORDER.reduce((sum, k) => sum + scores[k], 0);
  const projected = Math.max(0, Math.min(30, rawTotal - penalty));
  const projRisk  = projectRisk(projected);
  const riskMeta  = RISK_THRESHOLDS[projRisk];

  const isChanged = CAT_ORDER.some(k => scores[k] !== categories[k]) || penalty !== aiExposurePenalty;

  function adjust(key, delta) {
    setScores(prev => ({
      ...prev,
      [key]: Math.max(1, Math.min(5, prev[key] + delta)),
    }));
  }

  function reset() {
    setScores({ ...categories });
    setPenalty(aiExposurePenalty);
  }

  return (
    <div className="whatif-panel">
      <div className="whatif-intro">
        <h3 className="whatif-title">What-If Explorer</h3>
        <p className="whatif-desc">
          Adjust each category score to see how your AI Resistance Score would change.
        </p>
      </div>

      <div className="whatif-rows">
        {CAT_ORDER.map(key => {
          const score   = scores[key];
          const changed = score !== categories[key];
          return (
            <div className={`whatif-row${changed ? ' whatif-row--changed' : ''}`} key={key}>
              <span className="whatif-row-label">{CATEGORY_META[key].label}</span>
              <div className="whatif-row-controls">
                <button
                  type="button"
                  className="whatif-step"
                  onClick={() => adjust(key, -1)}
                  disabled={score <= 1}
                  aria-label={`Decrease ${CATEGORY_META[key].label}`}
                >−</button>
                <span className="whatif-row-score" aria-live="polite">
                  {score}<span className="whatif-row-max">/5</span>
                </span>
                <button
                  type="button"
                  className="whatif-step"
                  onClick={() => adjust(key, +1)}
                  disabled={score >= 5}
                  aria-label={`Increase ${CATEGORY_META[key].label}`}
                >+</button>
              </div>
            </div>
          );
        })}

        <div className={`whatif-row whatif-row--penalty${penalty !== aiExposurePenalty ? ' whatif-row--changed' : ''}`}>
          <span className="whatif-row-label">
            AI Exposure Penalty
            <span className="whatif-penalty-note"> (subtracted)</span>
          </span>
          <div className="whatif-row-controls">
            <button
              type="button"
              className="whatif-step"
              onClick={() => setPenalty(p => Math.max(0, p - 1))}
              disabled={penalty <= 0}
              aria-label="Decrease AI Exposure Penalty"
            >−</button>
            <span className="whatif-row-score whatif-row-score--penalty" aria-live="polite">
              −{penalty}
            </span>
            <button
              type="button"
              className="whatif-step"
              onClick={() => setPenalty(p => Math.min(5, p + 1))}
              disabled={penalty >= 5}
              aria-label="Increase AI Exposure Penalty"
            >+</button>
          </div>
        </div>
      </div>

      <div className={`whatif-projection whatif-projection--${projRisk.toLowerCase()}`}>
        <div className="whatif-projection-score">
          <span className="whatif-projection-number">{projected}</span>
          <span className="whatif-projection-denom">/ 30</span>
        </div>
        <div className="whatif-projection-label">{riskMeta.label}</div>
      </div>

      {isChanged && (
        <button type="button" className="whatif-reset" onClick={reset}>
          Reset to my actual scores
        </button>
      )}
    </div>
  );
}
