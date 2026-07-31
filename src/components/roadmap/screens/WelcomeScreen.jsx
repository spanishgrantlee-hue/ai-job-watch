// ─── Welcome (Screen 0) ─────────────────────────────────────────────────────────
// The opening beat of the Reveal experience. Dark-hero background comes from
// this screen's own config entry (RevealSequencer's background mechanism, K3) —
// not set here. Advances only when the user taps Show Me, same as every screen.

export default function WelcomeScreen({ onAdvance }) {
  return (
    <div className="welcome-screen">
      <p className="welcome-line">
        Let&rsquo;s look at your job &mdash; not through AI headlines, but through what&rsquo;s actually true for you.
      </p>
      <button type="button" className="btn-primary btn-lg welcome-cta" onClick={onAdvance}>
        Show Me
      </button>
    </div>
  );
}
