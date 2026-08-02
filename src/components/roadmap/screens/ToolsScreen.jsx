import { TOOLS, TOOLS_NOTE } from '../../../utils/roadmap/tools.js';

// ─── Recommended Tools (Screen 7) ──────────────────────────────────────────────
// The AI-as-instrument reframe: one concrete, zero-setup AI use-case tied to
// the user's weakest category, from J5's tools.js (read-only import, no
// changes there). Pure display -- no personalization is captured here.
// Reuses the same playbook-card-title/playbook-card-context/playbook-timeline
// classes M1 already established for this light-background (Act 2) context.

export default function ToolsScreen({ weakestCategory, onAdvance }) {
  const tool = TOOLS[weakestCategory.key];

  return (
    <div className="tools-screen">
      <div className="section-label">Recommended Tools</div>
      <h2 className="results-section-title">One small way to use AI tonight</h2>
      <p className="results-section-desc">
        For <strong>{weakestCategory.label}</strong>, here&rsquo;s one way AI can help you do your job better &mdash; not replace it.
      </p>

      <div className="tools-card">
        <h3 className="playbook-card-title">{weakestCategory.label}</h3>
        <p className="playbook-card-context">{tool.why}</p>
        <div className="playbook-timeline">
          <div className="playbook-item">
            <span className="playbook-item-label">Learning Time</span>
            <p className="playbook-item-text">{tool.learningTime}</p>
          </div>
          <div className="playbook-item">
            <span className="playbook-item-label">This Week</span>
            <p className="playbook-item-text">{tool.thisWeek}</p>
          </div>
        </div>
      </div>

      <p className="tools-note">{TOOLS_NOTE}</p>

      <button type="button" className="btn-primary tools-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
