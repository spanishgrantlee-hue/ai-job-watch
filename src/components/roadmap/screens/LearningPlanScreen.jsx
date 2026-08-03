import { LEARNING_RESOURCES } from '../../../utils/roadmap/learningResources.js';

// ─── Personalized Learning Plan (Screen 6) ─────────────────────────────────────
// Uses M1's hoursBudget answer to decide how many of the weakest category's
// three existing milestone steps to show (low = This Week only, mid = +This
// Month, high = +Ongoing) -- never invents new content, only reveals more or
// less of what learningResources.js (J4) already has. Read-only import, no
// changes there. Defaults to 'mid' if M1's question was skipped.
//
// No second (cost) micro-question: every entry in J4 is already free/low-cost,
// so a free-vs-paid answer would have no visible effect on what's shown.

const STEP_LABELS = {
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  ongoing: 'Ongoing',
};

const STEPS_BY_BUDGET = {
  low:  ['thisWeek'],
  mid:  ['thisWeek', 'thisMonth'],
  high: ['thisWeek', 'thisMonth', 'ongoing'],
};

export default function LearningPlanScreen({ weakestCategory, hoursBudget, onAdvance }) {
  const resource = LEARNING_RESOURCES[weakestCategory.key];
  const stepKeys = STEPS_BY_BUDGET[hoursBudget] ?? STEPS_BY_BUDGET.mid;

  return (
    <div className="learning-plan-screen">
      <div className="section-label">Personalized Learning Plan</div>
      <h2 className="results-section-title">Your learning plan, sized to your time</h2>
      <p className="results-section-desc">
        For <strong>{weakestCategory.label}</strong>, here&rsquo;s <strong>{resource.skill}</strong> &mdash; one focused skill, matched to how much time you said you have.
      </p>
      <p className="playbook-card-context">{resource.why}</p>

      <div className="playbook-timeline">
        {stepKeys.map(key => {
          const step = resource[key];
          const label = step.time ? `${STEP_LABELS[key]} (${step.time})` : STEP_LABELS[key];
          return (
            <div className="playbook-item" key={key}>
              <span className="playbook-item-label">{label}</span>
              <p className="playbook-item-text">{step.text}</p>
            </div>
          );
        })}
      </div>

      <button type="button" className="btn-primary learning-plan-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
