import { TIMELINE, TIMELINE_DISCLAIMER } from '../../../utils/roadmap/timeline.js';

// ─── Tasks Most Likely to Change + Timeline (Screen 4) ─────────────────────────
// Delivers the detail withheld from Screen 2/3: names the weakest category,
// then the task-level detail behind it (automationRisks, already computed by
// calculateResults() from scoring.js's AUTOMATION_SIGNALS), then J1's merged
// timeline. Closes with the exact agency-restoring line from the spec --
// this screen has to end in control on its own, not rely on Screen 5 to do it.

export default function TasksChangingScreen({ weakestCategory, automationRisks, riskKey, onAdvance }) {
  const timeline = TIMELINE[riskKey];

  return (
    <div className="tasks-changing-screen">
      <p className="tasks-changing-eyebrow">Tasks Most Likely to Change</p>

      <p className="tasks-changing-weak">
        <strong>{weakestCategory.label}</strong> is the area putting the most pressure on your score.
      </p>

      {automationRisks.length > 0 ? (
        <ul className="tasks-changing-risks">
          {automationRisks.map(risk => (
            <li className="tasks-changing-risk-item" key={risk.key}>
              <h3 className="tasks-changing-risk-title">{risk.label}</h3>
              <p className="tasks-changing-risk-desc">{risk.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tasks-changing-fallback">
          No major automation signals showed up in your answers specifically &mdash; but every role changes over time, which is exactly what the timeline below is about.
        </p>
      )}

      <div className="tasks-changing-timeline">
        <p className="tasks-changing-timeline-estimate">{timeline.estimate}</p>
        <p className="tasks-changing-timeline-disclaimer">{TIMELINE_DISCLAIMER}</p>
      </div>

      <p className="tasks-changing-closing">
        None of this is locked in. What happens between now and then is still up to you &mdash; and that&rsquo;s exactly what the rest of this plan is for.
      </p>

      <button type="button" className="btn-ghost-dark tasks-changing-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
