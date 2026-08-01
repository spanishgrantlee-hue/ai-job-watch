// ─── Your Biggest Strengths (Screen 3) ─────────────────────────────────────────
// Full explanation + example tasks for the top 2 categories; a lighter
// label+rank-only quick list for the remaining 4. Closes by naming the
// weakest category as the setup line into Screen 4 -- no detail here, that's
// TasksChangingScreen's job. Reads rankedCategories straight from
// calculateResults() (scoring.js's CATEGORY_META already carries label,
// protectsJobWhy, exampleTasks) -- no new data, no scoring changes.

export default function StrengthsScreen({ rankedCategories, onAdvance }) {
  const primary = rankedCategories.slice(0, 2);
  const rest = rankedCategories.slice(2, 6);
  const weakest = rankedCategories[rankedCategories.length - 1];

  return (
    <div className="strengths-screen">
      <p className="strengths-eyebrow">Your Biggest Strengths</p>

      <div className="strengths-primary">
        {primary.map((category, i) => (
          <div className="strengths-primary-card" key={category.key}>
            <span className="strengths-rank">Your #{i + 1} strength</span>
            <h2 className="strengths-primary-label">{category.label}</h2>
            <p className="strengths-primary-why">{category.protectsJobWhy}</p>
            <ul className="strengths-tasks">
              {category.exampleTasks.map(task => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ul className="strengths-quicklist">
        {rest.map((category, i) => (
          <li className="strengths-quick-item" key={category.key}>
            <span className="strengths-quick-rank">#{i + 3}</span>
            <span className="strengths-quick-label">{category.label}</span>
          </li>
        ))}
      </ul>

      <p className="strengths-transition">
        But there&rsquo;s one area we haven&rsquo;t looked at yet: <strong>{weakest.label}</strong>. That&rsquo;s what the next screen is about.
      </p>

      <button type="button" className="btn-ghost-dark strengths-cta" onClick={onAdvance}>
        Continue
      </button>
    </div>
  );
}
