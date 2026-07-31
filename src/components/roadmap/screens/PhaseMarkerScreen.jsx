// ─── Phase Marker ───────────────────────────────────────────────────────────────
// The brief connective beat between Act 1 and Act 2 (Screen 5 -> Screen 6 in the
// full sequence). No other UI — just the line, tapped to continue like every
// other screen (RevealSequencer never auto-advances on a timer).

export default function PhaseMarkerScreen({ onAdvance }) {
  return (
    <div className="phase-marker-screen">
      <button type="button" className="phase-marker-tap" onClick={onAdvance}>
        <p className="phase-marker-line">Now, here&rsquo;s exactly how.</p>
      </button>
    </div>
  );
}
