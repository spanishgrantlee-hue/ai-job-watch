import { useState } from 'react';
import { PACING } from './pacing.js';

// ─── Reveal Sequencer ───────────────────────────────────────────────────────────
// Renders exactly one "screen" at a time from an ordered list, advancing only
// when the current screen explicitly calls onAdvance (never on a timer or
// auto-scroll). Each screen entry:
//   { id, component, pacing, act, background }
// - component:  the screen's React component, rendered with { onAdvance, isLast }
// - pacing:     PACING.DELIBERATE | PACING.INSTANT — maps to a transition CSS
//               class so timing lives in one stylesheet, not copy-pasted per screen
// - act:        1 | 2 | 3 — which act this screen belongs to (used by K2's
//               ambient progress bar, not by this component directly)
// - background: 'hero' | 'light' | 'light-distinct' — visual section tone,
//               mapped to a reveal-bg-* class independent of act grouping

export default function RevealSequencer({ screens, onComplete }) {
  const [index, setIndex] = useState(0);

  const current = screens[index];
  const isLast = index === screens.length - 1;

  function advance() {
    if (isLast) {
      onComplete?.();
      return;
    }
    setIndex(i => i + 1);
  }

  const Screen = current.component;
  const pacingClass = current.pacing === PACING.INSTANT
    ? 'reveal-transition-instant'
    : 'reveal-transition-deliberate';

  // Ambient progress — reflects position within the CURRENT act only, so it
  // resets (rather than crawling toward 100%) at each act boundary. No visible
  // count is shown; aria-* attributes below are for screen readers only.
  const actScreens = screens.filter(s => s.act === current.act);
  const actPosition = actScreens.findIndex(s => s.id === current.id);
  const actProgressPct = actScreens.length > 0 ? ((actPosition + 1) / actScreens.length) * 100 : 0;

  // Background tone is driven purely by this screen's own config, independent
  // of its act — this is what lets Screen 11 use the dark-hero tone (a
  // deliberate bookend with Screen 0-1) even though it's grouped into Act 3
  // for progress-bar purposes.
  const backgroundClass = `reveal-bg-${current.background}`;

  return (
    <div className={`reveal-sequencer ${backgroundClass}`}>
      <div
        className="reveal-progress-track"
        role="progressbar"
        aria-valuenow={actPosition + 1}
        aria-valuemin={1}
        aria-valuemax={actScreens.length}
        aria-label="Progress through this part"
      >
        <div className="reveal-progress-fill" style={{ width: `${actProgressPct}%` }} />
      </div>
      <div key={current.id} className={`reveal-screen ${pacingClass}`}>
        <Screen onAdvance={advance} isLast={isLast} />
      </div>
    </div>
  );
}
