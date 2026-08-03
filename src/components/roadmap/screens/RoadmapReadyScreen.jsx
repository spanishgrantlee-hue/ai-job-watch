import { useState } from 'react';
import { PLAYBOOK, playbookLevel } from '../../../utils/playbook.js';
import { encodeRoadmapSnapshot } from '../../../utils/share.js';

// ─── Your Roadmap Is Ready (Screen 11, close) ──────────────────────────────────
// The emotional climax of the Reveal, dark-hero background bookending
// Screens 0-1 (already wired in K3). Closes on the user's weakest category's
// single 30-day action from playbook.js (read-only import, no changes there) --
// N1 opened Act 3 on the strongest category; this closes on the weakest,
// same thread M1-M5 shared.
//
// Save My Roadmap (P2) is real: builds a /roadmap?snapshot= link via P1's
// encodeRoadmapSnapshot and copies it, same UX convention Results.jsx already
// uses for its Copy Link button. Takes `results` directly (calculateResults()
// shape) rather than an onSave callback -- this screen now does its own real
// work from the data it's given, same as every other screen, instead of
// delegating to a callback nobody has ever supplied.
//
// See the Full Report / Share remain as before: onAdvance is the natural exit
// from the last screen; onShare is still an inert placeholder -- Share isn't
// part of any Group P task.

export default function RoadmapReadyScreen({ weakestCategory, results, onShare, onAdvance }) {
  const [saved, setSaved] = useState(false);
  const level = playbookLevel(weakestCategory.score);
  const action = PLAYBOOK[weakestCategory.key].days30[level];

  function handleSave() {
    const encoded = encodeRoadmapSnapshot(results);
    const url = `${window.location.origin}/roadmap?snapshot=${encoded}`;
    navigator.clipboard.writeText(url)
      .then(() => { setSaved(true); setTimeout(() => setSaved(false), 2000); })
      .catch(() => {});
  }

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
        <button type="button" className="btn-ghost-dark" onClick={handleSave}>
          {saved ? '✓ Link Copied!' : 'Save My Roadmap'}
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
