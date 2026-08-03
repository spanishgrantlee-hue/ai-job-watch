import { SIMILAR_CAREERS, SIMILAR_CAREERS_DISCLAIMER, SIMILAR_CAREERS_INTRO } from '../../../utils/roadmap/similarCareers.js';

// ─── Similar Careers (Screen 10) ───────────────────────────────────────────────
// The safety-net section -- arrives last, tied to the user's STRONGEST
// category (topProtector), not the weakest thread M1-M5 shared. Awareness
// content only, no this-week action, matching similarCareers.js's (J3) own
// intent. Read-only import, no changes there. Uses J3's own committed
// SIMILAR_CAREERS_INTRO/SIMILAR_CAREERS_DISCLAIMER verbatim rather than
// re-authoring copy that would drift from what's already finalized.
// Act 3's light-distinct background comes from RevealSequencer's existing
// wrapper mechanism, not from this component.

export default function SimilarCareersScreen({ topProtector, onAdvance }) {
  const data = SIMILAR_CAREERS[topProtector.key];

  return (
    <div className="similar-careers-screen">
      <p className="similar-careers-opener">{SIMILAR_CAREERS_INTRO}</p>

      <div className="section-label">Careers That Often Emphasize Your Strongest Skills</div>
      <h2 className="results-section-title">Where {topProtector.label} often leads</h2>
      <p className="results-section-desc">
        People with strong <strong>{topProtector.label}</strong> often do well in roles like these &mdash; {data.reason}.
      </p>

      <div className="similar-careers-roles">
        {data.roles.map(role => (
          <span className="protector-tag" key={role}>{role}</span>
        ))}
      </div>

      <p className="similar-careers-disclaimer">{SIMILAR_CAREERS_DISCLAIMER}</p>

      <button type="button" className="btn-primary similar-careers-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
