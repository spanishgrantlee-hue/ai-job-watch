import { useState } from 'react';
import { CATEGORY_META, RISK_THRESHOLDS } from '../utils/scoring';
import { CAT_ORDER } from '../utils/share';

function projectRisk(score) {
  if (score >= 24) return 'LOW';
  if (score >= 16) return 'MEDIUM';
  return 'HIGH';
}

// Per-category coaching sentences — shown when that category drives the biggest change.
const CAT_SENTENCES = {
  accountability: {
    up:   "Raising Accountability is doing the most work here — clear decision-making authority is one of the hardest things for AI to replicate.",
    down: "Accountability carries a lot of weight in your total — it's one of the strongest protections you can have.",
  },
  trust: {
    up:   "Improving Trust & Relationships is driving most of this gain — client and team bonds are among the hardest things to automate.",
    down: "Trust & Relationships plays an outsized role here — it's one of the most durable protections a worker can have.",
  },
  judgment: {
    up:   "Raising Human Judgment is moving the needle — experience-driven decisions are exactly where AI still struggles.",
    down: "Human Judgment is a core protection — when it drops, your score feels it directly.",
  },
  problemSolving: {
    up:   "Improving Problem Solving is helping here — handling novel situations is still firmly in human territory.",
    down: "Problem Solving adds real resilience to your score — it's worth protecting when you can.",
  },
  physicalPresence: {
    up:   "Physical Presence is a genuine moat — work that requires you on-site is difficult and expensive to automate.",
    down: "Physical Presence provides meaningful protection — when it drops, your exposure increases directly.",
  },
  licensing: {
    up:   "Building Licensing & Credentials creates a real barrier — even when the tech is capable, regulations slow automation down.",
    down: "Licensing & Credentials is one of the most direct protections you can build — reducing it noticeably affects your result.",
  },
};

function getWhySentence(scores, categories, penalty, aiExposurePenalty, projected, baseScore, projRisk, baseRisk) {
  const delta = projected - baseScore;
  if (delta === 0) return null;

  // Find category with the largest absolute change
  let biggestKey = null;
  let biggestDelta = 0;
  CAT_ORDER.forEach(k => {
    const d = scores[k] - categories[k];
    if (Math.abs(d) > Math.abs(biggestDelta)) {
      biggestDelta = d;
      biggestKey = k;
    }
  });

  // penaltyDelta > 0 means user reduced it (good for score)
  const penaltyDelta = aiExposurePenalty - penalty;
  const penaltyIsBiggest = Math.abs(penaltyDelta) > Math.abs(biggestDelta);

  // Band moved up — lead with the milestone
  if (delta > 0 && projRisk !== baseRisk) {
    const bandName = RISK_THRESHOLDS[projRisk].label;
    if (penaltyIsBiggest) {
      return `Reducing your AI exposure is the key move here — and it's enough to reach ${bandName} territory.`;
    }
    const label = CATEGORY_META[biggestKey]?.label ?? 'that category';
    return `Strengthening ${label} is the key move — and it's enough to move you into ${bandName} territory.`;
  }

  // Score went up, same band
  if (delta > 0) {
    if (penaltyIsBiggest) {
      return "Reducing your AI exposure is driving most of this gain — it's one of the most direct levers you have.";
    }
    return CAT_SENTENCES[biggestKey]?.up ?? null;
  }

  // Score went down
  if (penaltyIsBiggest) {
    return "A higher AI exposure penalty directly subtracts from your total — it's one of the biggest single factors in your score.";
  }
  return CAT_SENTENCES[biggestKey]?.down ?? null;
}

export default function WhatIfPanel({ categories, aiExposurePenalty, baseScore, baseRisk }) {
  const [scores, setScores]   = useState({ ...categories });
  const [penalty, setPenalty] = useState(aiExposurePenalty);

  const rawTotal  = CAT_ORDER.reduce((sum, k) => sum + scores[k], 0);
  const projected = Math.max(0, Math.min(30, rawTotal - penalty));
  const projRisk  = projectRisk(projected);
  const riskMeta  = RISK_THRESHOLDS[projRisk];

  const isChanged = CAT_ORDER.some(k => scores[k] !== categories[k]) || penalty !== aiExposurePenalty;
  const whySentence = isChanged
    ? getWhySentence(scores, categories, penalty, aiExposurePenalty, projected, baseScore, projRisk, baseRisk)
    : null;

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
      <p className="whatif-desc">
        Your lowest scores have the most room to improve. Raise any score below to see how your projected total changes.
      </p>

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
              onClick={() => setPenalty(p => Math.min(3, p + 1))}
              disabled={penalty >= 3}
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
        {whySentence && (
          <p className="whatif-projection-why">{whySentence}</p>
        )}
      </div>

      {isChanged && (
        <button type="button" className="whatif-reset" onClick={reset}>
          Back to my real scores
        </button>
      )}
    </div>
  );
}
