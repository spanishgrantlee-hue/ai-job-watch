import { PLAYBOOK, playbookLevel } from '../../../utils/playbook.js';

// ─── Your Roadmap Is Ready (Screen 11, close) ──────────────────────────────────
// The emotional climax of the Reveal, dark-hero background bookending
// Screens 0-1 (already wired in K3). Closes on the user's weakest category's
// single 30-day action from playbook.js (read-only import, no changes there) --
// N1 opened Act 3 on the strongest category; this closes on the weakest,
// same thread M1-M5 shared.
//
// Save My Roadmap / See the Full Report / Share are symmetric placeholders:
// Groups O (reference mode) and P (progress tracking) don't exist yet, so none
// of the three do real work. onSave/onShare are optional no-ops until then;
// "See the Full Report" calls onAdvance, the natural exit from the last screen.

export default function RoadmapReadyScreen({ weakestCategory, onSave, onShare, onAdvance }) {
  const level = playbookLevel(weakestCategory.score);
  const action = PLAYBOOK[weakestCategory.key].days30[level];

  return (
    <div className="roadmap-ready-screen">
      <p className="why-line">
        This was supposed to be about what&rsquo;s actually true for you &mdash; not a headline, not a scare. You have a real plan now, built around what&rsquo;s already working in your favor.
      </p>

      <p className="roadmap-ready-action-label">One thing matters more than the rest:</p>
      <div className="tasks-changing-timeline">
        <p className="tasks-changing-timeline-estimate">{action}</p>
      </div>

      <p className="why-line">Pick it, and start there.</p>

      <div className="roadmap-ready-actions">
        <button type="button" className="btn-ghost-dark" onClick={() => onSave?.()}>
          Save My Roadmap
        </button>
        <button type="button" className="btn-ghost-dark" onClick={() => onAdvance?.()}>
          See the Full Report
        </button>
        <button type="button" className="btn-ghost-dark" onClick={() => onShare?.()}>
          Share
        </button>
      </div>
    </div>
  );
}
