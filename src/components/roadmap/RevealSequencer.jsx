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
// - background: 'hero' | 'light' | 'light-distinct' — visual section tone
//               (used by K3, not by this component directly)

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

  return (
    <div className="reveal-sequencer">
      <div key={current.id} className={`reveal-screen ${pacingClass}`}>
        <Screen onAdvance={advance} isLast={isLast} />
      </div>
    </div>
  );
}
