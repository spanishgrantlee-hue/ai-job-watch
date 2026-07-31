import { useEffect, useState } from 'react';

// ─── Score (Screen 1) ───────────────────────────────────────────────────────────
// Self-contained copy of the score-reveal moment from Results.jsx (count-up,
// range bar, marker slide-in) — not an import, since Results.jsx isn't touched.
// Reuses the same CSS classes Results.jsx already defines for this markup.
// Deliberately excludes the share row and "why" reasoning — those belong to
// Screen 11 and Screen 2 (WhyScreen) respectively, not this screen.

const SCORE_LABELS = { LOW: 'Resilient', MEDIUM: 'Developing', HIGH: 'Under Pressure' };

function ScoreRangeBar({ score }) {
  const MAX = 30;
  const targetPct = Math.max(1.5, Math.min(98.5, (score / MAX) * 100));

  const [markerPct, setMarkerPct] = useState(0);
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMarkerPct(targetPct));
    return () => cancelAnimationFrame(frameId);
  }, [targetPct]);

  return (
    <div className="score-range-bar" aria-hidden="true">
      <div className="score-range-track">
        <div className="score-zone score-zone--high"   style={{ width: '50%' }} />
        <div className="score-zone score-zone--medium" style={{ width: '26.7%' }} />
        <div className="score-zone score-zone--low"    style={{ width: '23.3%' }} />
        <div className="score-marker" style={{ left: `${markerPct}%` }} />
      </div>
      <div className="score-range-legend">
        <span>High Risk<br /><em>0&ndash;15</em></span>
        <span>Medium Risk<br /><em>16&ndash;23</em></span>
        <span>Low Risk<br /><em>24&ndash;30</em></span>
      </div>
    </div>
  );
}

export default function ScoreScreen({ finalScore, riskKey, riskLabel, onAdvance }) {
  const [displayScore, setDisplayScore] = useState(0);
  const riskClass = riskKey.toLowerCase();

  useEffect(() => {
    if (!finalScore) return;
    const duration = 900;
    const start = performance.now();
    let frameId;
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round((1 - Math.pow(1 - t, 3)) * finalScore));
      if (t < 1) frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [finalScore]);

  return (
    <div className="score-screen">
      <p className="results-eyebrow">Your AI Resistance Score</p>
      <div className="results-score-display">
        <span className="results-score-number">{displayScore}</span>
        <span className="results-score-denom">/ 30</span>
      </div>
      <p className="results-score-label">{SCORE_LABELS[riskKey]}</p>
      <div className={`results-risk-badge results-risk-badge--${riskClass}`}>
        {riskLabel}
      </div>
      <ScoreRangeBar score={finalScore} />
      <button type="button" className="btn-ghost-dark score-screen-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
