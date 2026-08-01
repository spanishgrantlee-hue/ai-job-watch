// ─── Why You Received This Score (Screen 2) ────────────────────────────────────
// Always names the strongest category with reasoning, regardless of risk tier
// (unlike Results.jsx's getScoreContextWhy, which skips this for HIGH risk) --
// per the "lead with strength" principle. Only gestures at the weak category;
// no detail here, that's Screen 4/TasksChangingScreen's job.

export default function WhyScreen({ topProtector, onAdvance }) {
  const strongLabel = topProtector?.label ?? 'your strongest area';

  return (
    <div className="why-screen">
      <p className="why-line">
        Your strongest area is <strong>{strongLabel}</strong>. That&rsquo;s one of the factors AI has the hardest time replacing &mdash; and it&rsquo;s already working in your favor.
      </p>
      <p className="why-line">
        One area is pulling your score down, and we&rsquo;ll get into exactly what it is on the next screen.
      </p>
      <button type="button" className="btn-ghost-dark why-screen-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
