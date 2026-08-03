import { CERTIFICATIONS } from '../../../utils/roadmap/certifications.js';

// ─── Recommended Certifications (Screen 9) ─────────────────────────────────────
// Closes the diagnose (Screen 2) -> detail (Screen 4) -> solve (here) thread
// for the user's weakest category, from J2's certifications.js (read-only
// import, no changes there). Pure display -- no personalization captured.
//
// costPreference is accepted but currently unused: M2 (the screen meant to
// capture a free-vs-paid answer) hasn't been built yet, and certifications.js
// has no structured cost field to filter against. Accepting the prop now means
// wiring in a real filter later won't require changing this component's
// signature again.

export default function CertificationsScreen({ weakestCategory, costPreference, onAdvance }) { // eslint-disable-line no-unused-vars
  const certs = CERTIFICATIONS[weakestCategory.key];

  return (
    <div className="certifications-screen">
      <div className="section-label">Recommended Certifications</div>
      <h2 className="results-section-title">Formal credentials worth exploring</h2>
      <p className="results-section-desc">
        For <strong>{weakestCategory.label}</strong>, here&rsquo;s a lookup you can start this week &mdash; no big commitment, just the first step.
      </p>

      <div className="certifications-list">
        {certs.map((cert, i) => (
          <div className="certifications-card" key={i}>
            <h3 className="playbook-card-title">{cert.name}</h3>
            <p className="playbook-card-context">{cert.why}</p>
            <div className="playbook-timeline">
              <div className="playbook-item">
                <span className="playbook-item-label">This Week</span>
                <p className="playbook-item-text">{cert.thisWeek}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="certifications-closing">
        That&rsquo;s the full picture on <strong>{weakestCategory.label}</strong> &mdash; what&rsquo;s pulling your score down, why, and one concrete way to build it up.
      </p>

      <button type="button" className="btn-primary certifications-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
