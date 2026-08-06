import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAnswers } from '../App';
import { calculateResults } from '../utils/scoring';
import { decodeShareState, encodeRoadmapSnapshot, decodeRoadmapSnapshot } from '../utils/share';
import { PLAYBOOK, playbookLevel } from '../utils/playbook';
import { TIMELINE, TIMELINE_DISCLAIMER } from '../utils/roadmap/timeline.js';
import { LEARNING_RESOURCES } from '../utils/roadmap/learningResources.js';
import { TOOLS, TOOLS_NOTE } from '../utils/roadmap/tools.js';
import { WORKPLACE_MOVES } from '../utils/roadmap/workplaceMoves.js';
import { CERTIFICATIONS } from '../utils/roadmap/certifications.js';
import { SIMILAR_CAREERS, SIMILAR_CAREERS_DISCLAIMER, SIMILAR_CAREERS_INTRO } from '../utils/roadmap/similarCareers.js';

// ─── Career Roadmap — Reference Mode (Group O) ─────────────────────────────────
// The same content as Reveal Screens 1-11 (Screen 0/Welcome and the K4 phase-
// marker beat are pure onboarding/pacing chrome, excluded here), collapsed
// into one scrollable, printable, shareable page -- no tap-to-advance.
//
// Deliberately does NOT import the 13 Reveal screen components: every one of
// them renders its own Continue button tied to RevealSequencer's onAdvance
// contract, which has no meaning on a page with no "next screen." Instead
// this file reads the same underlying data (scoring.js, playbook.js, the six
// roadmap/*.js files) directly, the same read-only-reuse pattern every screen
// component already uses -- this is a third copy of the small score-reveal
// logic (Results.jsx -> ScoreScreen -> here), matching that existing
// precedent rather than introducing a new one. No changes to scoring.js,
// playbook.js, any roadmap/*.js file, RevealSequencer.jsx, or the screen
// components themselves.
//
// hoursBudget is shared page-wide state (Protection Plan and Learning Plan
// both read it) -- an improvement the single-page format allows over the
// sequenced Reveal, where Learning Plan could only ever see the Protection
// Plan's answer after the fact.

const SCORE_LABELS = { LOW: 'Resilient', MEDIUM: 'Developing', HIGH: 'Under Pressure' };
const SCORED_IDS = ['Q6','Q7','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q25','Q28'];

const HOURS_OPTIONS = [
  { key: 'low',  label: 'A few minutes a week' },
  { key: 'mid',  label: '1–3 hours a week' },
  { key: 'high', label: '5+ hours a week' },
];

const STEP_LABELS = { thisWeek: 'This Week', thisMonth: 'This Month', ongoing: 'Ongoing' };
const STEPS_BY_BUDGET = {
  low:  ['thisWeek'],
  mid:  ['thisWeek', 'thisMonth'],
  high: ['thisWeek', 'thisMonth', 'ongoing'],
};

function ScoreRangeBar({ score }) {
  const MAX = 30;
  const targetPct = Math.max(1.5, Math.min(98.5, (score / MAX) * 100));
  const [markerPct, setMarkerPct] = useState(0);
  useEffect(() => {
    const frameId = requestAnimationFrame(() => setMarkerPct(targetPct));
    return () => cancelAnimationFrame(frameId);
  }, [targetPct]);

  return (
    <div className="score-range-bar" aria-hidden="true">
      <div className="score-range-track">
        <div className="score-zone score-zone--high"   style={{ width: '50%' }} />
        <div className="score-zone score-zone--medium" style={{ width: '26.7%' }} />
        <div className="score-zone score-zone--low"    style={{ width: '23.3%' }} />
        <div className="score-marker" style={{ left: `${markerPct}%` }} />
      </div>
      <div className="score-range-legend">
        <span>High Risk<br /><em>0&ndash;15</em></span>
        <span>Medium Risk<br /><em>16&ndash;23</em></span>
        <span>Low Risk<br /><em>24&ndash;30</em></span>
      </div>
    </div>
  );
}

function ScoreSection({ finalScore, riskKey, riskLabel }) {
  const [displayScore, setDisplayScore] = useState(0);
  const riskClass = riskKey.toLowerCase();

  useEffect(() => {
    if (!finalScore) return;
    const duration = 900;
    const start = performance.now();
    let frameId;
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round((1 - Math.pow(1 - t, 3)) * finalScore));
      if (t < 1) frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [finalScore]);

  return (
    <section className="results-hero">
      <div className="container">
        <p className="results-eyebrow">Your AI Resistance Score</p>
        <div className="results-score-display">
          <span className="results-score-number">{displayScore}</span>
          <span className="results-score-denom">/ 30</span>
        </div>
        <p className="results-score-label">{SCORE_LABELS[riskKey]}</p>
        <div className={`results-risk-badge results-risk-badge--${riskClass}`}>{riskLabel}</div>
        <ScoreRangeBar score={finalScore} />
      </div>
    </section>
  );
}

function WhySection({ topProtector }) {
  const strongLabel = topProtector?.label ?? 'your strongest area';
  return (
    <section className="results-section results-section--white">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">Why You Received This Score</div>
          <h2 className="results-section-title">
            Your strongest area is <strong>{strongLabel}</strong>
          </h2>
          <p className="results-section-desc">
            That&rsquo;s one of the factors AI has the hardest time replacing &mdash; and it&rsquo;s already working in your favor. One area is pulling your score down, and we&rsquo;ll get into exactly what it is further down this page.
          </p>
        </div>
      </div>
    </section>
  );
}

function StrengthsSection({ rankedCategories }) {
  const primary = rankedCategories.slice(0, 2);
  const rest = rankedCategories.slice(2, 6);
  const weakest = rankedCategories[rankedCategories.length - 1];

  return (
    <section className="results-section">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">Your Biggest Strengths</div>
          <h2 className="results-section-title">What&rsquo;s already working in your favor</h2>
        </div>

        <div className="playbook-grid">
          {primary.map((category, i) => (
            <div className="playbook-card" key={category.key}>
              <span className="playbook-card-rank">Your #{i + 1} strength</span>
              <h3 className="playbook-card-title">{category.label}</h3>
              <p className="playbook-card-context">{category.protectsJobWhy}</p>
              <div className="protector-tags">
                {category.exampleTasks.map(task => (
                  <span className="protector-tag" key={task}>{task}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <ul className="strength-quicklist">
          {rest.map((category, i) => (
            <li className="strength-quicklist-item" key={category.key}>
              <span className="strength-quicklist-rank">#{i + 3}</span>
              <span>{category.label}</span>
            </li>
          ))}
        </ul>

        <p className="results-section-desc" style={{ marginTop: '20px' }}>
          But there&rsquo;s one area we haven&rsquo;t looked at yet: <strong>{weakest.label}</strong>. That&rsquo;s covered further down this page.
        </p>
      </div>
    </section>
  );
}

function TasksChangingSection({ weakestCategory, automationRisks, riskKey }) {
  const timeline = TIMELINE[riskKey];
  return (
    <section className="results-section results-section--white">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">Tasks Most Likely to Change</div>
          <h2 className="results-section-title">
            <strong>{weakestCategory.label}</strong> is putting the most pressure on your score
          </h2>
        </div>

        {automationRisks.length > 0 ? (
          <div className="automation-grid">
            {automationRisks.map(risk => (
              <div className="automation-card" key={risk.key}>
                <div className="automation-card-dot" aria-hidden="true" />
                <div>
                  <h3 className="automation-card-title">{risk.label}</h3>
                  <p className="automation-card-desc">{risk.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="results-callout results-callout--positive">
            <p>No major automation signals showed up in your answers specifically &mdash; but every role changes over time, which is exactly what the timeline below is about.</p>
          </div>
        )}

        <div className="results-callout results-callout--warning" style={{ marginTop: '16px' }}>
          <p>{timeline.estimate}</p>
        </div>
        <p className="results-section-desc" style={{ marginTop: '10px', fontSize: '0.8rem' }}>{TIMELINE_DISCLAIMER}</p>

        <p className="results-section-desc" style={{ marginTop: '20px', fontWeight: 600 }}>
          None of this is locked in. What happens between now and then is still up to you &mdash; and that&rsquo;s exactly what the rest of this plan is for.
        </p>
      </div>
    </section>
  );
}

function ProtectionPlanSection({ rankedCategories, hoursBudget, onSelectHours, checklist, onToggleItem }) {
  const weakest = [...rankedCategories].reverse().slice(0, 2);

  return (
    <section className="results-section">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">AI Protection Plan</div>
          <h2 className="results-section-title">Your action plan, based on your scores</h2>
          <p className="results-section-desc">
            These are the two areas where a small improvement would make the biggest difference. Start with the first one &mdash; the second can wait a month.
          </p>
        </div>

        <div className="playbook-grid">
          {weakest.map((category, i) => {
            const level = playbookLevel(category.score);
            const data = PLAYBOOK[category.key];
            const badgeClass =
              category.score <= 2 ? 'playbook-score-badge--low'
              : category.score === 3 ? 'playbook-score-badge--mid'
              : 'playbook-score-badge--high';
            return (
              <div className="playbook-card" key={category.key}>
                <div className="playbook-card-top">
                  <span className="playbook-card-rank">{i === 0 ? 'Start here' : 'Then this'}</span>
                  <span className={`playbook-score-badge ${badgeClass}`}>{category.score}<span className="playbook-score-denom">/5</span></span>
                </div>
                <h3 className="playbook-card-title">{category.label}</h3>
                <p className="playbook-card-context">{data.context[level]}</p>
                <div className="playbook-timeline">
                  {[
                    { timeframe: 'days30', label: 'This Week' },
                    { timeframe: 'days90', label: 'Next Few Months' },
                    { timeframe: 'year1',  label: 'Long-Term' },
                  ].map(({ timeframe, label }) => {
                    const checklistKey = `${category.key}:${timeframe}`;
                    const complete = !!checklist[checklistKey];
                    return (
                      <div className={`playbook-item${complete ? ' playbook-item--complete' : ''}`} key={timeframe}>
                        <label className="playbook-item-checkbox-row">
                          <input
                            type="checkbox"
                            checked={complete}
                            onChange={() => onToggleItem(category.key, timeframe)}
                            aria-label={`Mark "${label}" complete for ${category.label}`}
                          />
                          <span className="playbook-item-label">{label}</span>
                        </label>
                        <p className="playbook-item-text">{data[timeframe][level]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="protection-plan-question">
          <p className="protection-plan-question-text">About how many hours a week could you realistically put toward this?</p>
          <div className="protection-plan-options">
            {HOURS_OPTIONS.map(opt => (
              <button
                type="button"
                key={opt.key}
                className={`protection-plan-option${hoursBudget === opt.key ? ' protection-plan-option--selected' : ''}`}
                onClick={() => onSelectHours(opt.key)}
                aria-pressed={hoursBudget === opt.key}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LearningPlanSection({ weakestCategory, hoursBudget }) {
  const resource = LEARNING_RESOURCES[weakestCategory.key];
  const stepKeys = STEPS_BY_BUDGET[hoursBudget] ?? STEPS_BY_BUDGET.mid;

  return (
    <section className="results-section results-section--white">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">Personalized Learning Plan</div>
          <h2 className="results-section-title">Your learning plan, sized to your time</h2>
          <p className="results-section-desc">
            For <strong>{weakestCategory.label}</strong>, here&rsquo;s <strong>{resource.skill}</strong> &mdash; one focused skill, matched to how much time you said you have above.
          </p>
        </div>
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
      </div>
    </section>
  );
}

function ToolsSection({ weakestCategory }) {
  const tool = TOOLS[weakestCategory.key];
  return (
    <section className="results-section">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">Recommended Tools</div>
          <h2 className="results-section-title">One small way to use AI tonight</h2>
          <p className="results-section-desc">
            For <strong>{weakestCategory.label}</strong>, here&rsquo;s one way AI can help you do your job better &mdash; not replace it.
          </p>
        </div>
        <div className="playbook-card">
          <h3 className="playbook-card-title">{weakestCategory.label}</h3>
          <p className="playbook-card-context">{tool.why}</p>
          <div className="playbook-timeline">
            <div className="playbook-item">
              <span className="playbook-item-label">Learning Time</span>
              <p className="playbook-item-text">{tool.learningTime}</p>
            </div>
            <div className="playbook-item">
              <span className="playbook-item-label">This Week</span>
              <p className="playbook-item-text">{tool.thisWeek}</p>
            </div>
          </div>
        </div>
        <p className="results-section-desc" style={{ marginTop: '14px', fontSize: '0.82rem', fontStyle: 'italic' }}>{TOOLS_NOTE}</p>
      </div>
    </section>
  );
}

function WorkplaceMovesSection({ weakestCategory }) {
  const [isUnion, setIsUnion] = useState(false);
  const moves = WORKPLACE_MOVES[weakestCategory.key];

  return (
    <section className="results-section results-section--white">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">Workplace Moves</div>
          <h2 className="results-section-title">Two moves you can make at work</h2>
          <p className="results-section-desc">
            For <strong>{weakestCategory.label}</strong>, here are two small, practical moves &mdash; no big ask, no waiting for the right moment.
          </p>
        </div>

        <button
          type="button"
          className={`protection-plan-option${isUnion ? ' protection-plan-option--selected' : ''}`}
          onClick={() => setIsUnion(u => !u)}
          aria-pressed={isUnion}
          style={{ marginBottom: '18px' }}
        >
          I&rsquo;m in a union
        </button>

        <div className="resources-tips">
          {moves.map((move, i) => (
            <div className="resources-tip-card" key={i}>
              <span className="resources-tip-num" aria-hidden="true">{i + 1}</span>
              <div>
                <p className="resources-tip-text">{move.text}</p>
                {isUnion && move.unionVariant && (
                  <p className="workplace-moves-union-note">{move.unionVariant}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificationsSection({ weakestCategory }) {
  const certs = CERTIFICATIONS[weakestCategory.key];
  return (
    <section className="results-section">
      <div className="container results-container">
        <div className="results-section-hdr">
          <div className="section-label">Recommended Certifications</div>
          <h2 className="results-section-title">Formal credentials worth exploring</h2>
          <p className="results-section-desc">
            For <strong>{weakestCategory.label}</strong>, here&rsquo;s a lookup you can start this week &mdash; no big commitment, just the first step.
          </p>
        </div>
        <div className="certifications-list">
          {certs.map((cert, i) => (
            <div className="certifications-card" key={i}>
              <h3 className="playbook-card-title">{cert.name}</h3>
              <p className="playbook-card-context">{cert.why}</p>
              <div className="playbook-timeline">
                <div className="playbook-item">
                  <span className="playbook-item-label">This Week</span>
                  <p className="playbook-item-text">{cert.thisWeek}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="results-section-desc" style={{ marginTop: '20px' }}>
          That&rsquo;s the full picture on <strong>{weakestCategory.label}</strong> &mdash; what&rsquo;s pulling your score down, why, and one concrete way to build it up.
        </p>
      </div>
    </section>
  );
}

function SimilarCareersSection({ topProtector }) {
  const data = SIMILAR_CAREERS[topProtector.key];
  return (
    <section className="resources-section">
      <div className="container results-container">
        <p className="similar-careers-opener">{SIMILAR_CAREERS_INTRO}</p>
        <div className="resources-hdr">
          <div className="section-label">Careers That Often Emphasize Your Strongest Skills</div>
          <h2 className="resources-title">Where {topProtector.label} often leads</h2>
          <p className="resources-intro">
            People with strong <strong>{topProtector.label}</strong> often do well in roles like these &mdash; {data.reason}.
          </p>
        </div>
        <div className="similar-careers-roles">
          {data.roles.map(role => (
            <span className="protector-tag" key={role}>{role}</span>
          ))}
        </div>
        <p className="similar-careers-disclaimer">{SIMILAR_CAREERS_DISCLAIMER}</p>
      </div>
    </section>
  );
}

function ClosingSection({ weakestCategory, results, checklist, onDownloadPdf }) {
  const [saved, setSaved] = useState(false);
  const level = playbookLevel(weakestCategory.score);
  const action = PLAYBOOK[weakestCategory.key].days30[level];

  // Same real save logic as RoadmapReadyScreen.jsx (P2) -- builds a
  // /roadmap?snapshot= link via P1's encodeRoadmapSnapshot and copies it.
  // checklist (new) is passed the same way RoadmapReadyScreen.jsx's own
  // handleSave already does, closing the gap Q3 documented for Reference mode.
  function handleSave() {
    const encoded = encodeRoadmapSnapshot(results, undefined, checklist);
    const url = `${window.location.origin}/roadmap?snapshot=${encoded}`;
    navigator.clipboard.writeText(url)
      .then(() => { setSaved(true); setTimeout(() => setSaved(false), 2000); })
      .catch(() => {});
  }

  return (
    <section className="results-hero career-roadmap-close">
      <div className="container">
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
          <button type="button" className="btn-ghost-dark" onClick={onDownloadPdf}>Download PDF</button>
          <button type="button" className="btn-ghost-dark">Share</button>
        </div>
      </div>
    </section>
  );
}

export default function CareerRoadmap() {
  const { answers } = useAnswers();
  const [searchParams] = useSearchParams();
  const [hoursBudget, setHoursBudget] = useState(null);

  const shareParam = searchParams.get('share');
  const sharedData = shareParam ? decodeShareState(shareParam) : null;
  const isSharedView = sharedData !== null;

  // Saved-roadmap links (P2) use a distinct ?snapshot= param and decoder from
  // one-time ?share= links -- decodeShareState can technically also decode a
  // snapshot string (it ignores the extra timestamp field), which would make
  // a saved link silently indistinguishable from a plain share if it reused
  // ?share=. Keeping them separate avoids that ambiguity.
  const snapshotParam = searchParams.get('snapshot');
  const snapshotData = snapshotParam ? decodeRoadmapSnapshot(snapshotParam) : null;
  const isSnapshotView = snapshotData !== null;

  // Live Progress View (P4) — a distinct ?compare= param and mode, never
  // reusing or altering ?snapshot='s meaning. decodeRoadmapSnapshot is only
  // ever called on compareParam when isSnapshotView/isSharedView are both
  // false, so ?snapshot= and ?share= always take absolute precedence: a
  // snapshot link's behavior is untouched by this feature's existence.
  const compareParam = searchParams.get('compare');
  const compareData = (!isSnapshotView && !isSharedView && compareParam) ? decodeRoadmapSnapshot(compareParam) : null;
  const isCompareView = compareData !== null;

  // Protection Plan checklist -- seeded from whichever snapshot is already
  // being decoded (snapshotData for a saved-link view, compareData as a
  // starting point for the live-vs-saved compare view), so a returning user
  // sees their previously-checked items restored. Neither ?share= links
  // (decodeShareState, no checklist field) nor a fresh live view have
  // anything to seed from, so both correctly default to {} -- same "additive,
  // sensible default if skipped" pattern hoursBudget already uses.
  const [checklist, setChecklist] = useState(() => (snapshotData ?? compareData)?.checklist ?? {});

  function handleToggleChecklistItem(categoryKey, timeframe) {
    const checklistKey = `${categoryKey}:${timeframe}`;
    setChecklist(prev => ({ ...prev, [checklistKey]: !prev[checklistKey] }));
  }

  const hasAnswers = SCORED_IDS.some(id => answers[id] !== undefined);
  const liveResults = hasAnswers ? calculateResults(answers) : null;

  if (!isSharedView && !isSnapshotView && !isCompareView && !hasAnswers) {
    return (
      <div className="results-page">
        <div className="results-empty-page">
          <div className="container">
            <h1>No Results Yet</h1>
            <p>Complete the assessment first to get your AI Resistance Score.</p>
            <Link to="/assessment" className="btn-primary">Take the Assessment</Link>
          </div>
        </div>
      </div>
    );
  }

  const results =
    isSnapshotView ? snapshotData
    : isSharedView ? sharedData
    : isCompareView ? (liveResults ?? compareData)
    : liveResults;
  const { finalScore, riskKey, riskLabel, rankedCategories, automationRisks, topProtectors } = results;
  const weakestCategory = rankedCategories[rankedCategories.length - 1];
  const topProtector = topProtectors[0] ?? rankedCategories[0];

  const compareDelta = (isCompareView && liveResults) ? liveResults.finalScore - compareData.finalScore : null;
  const compareDeltaText = compareDelta === null ? null
    : compareDelta > 0 ? `Your score moved up ${compareDelta} point${compareDelta === 1 ? '' : 's'} since you saved this roadmap.`
    : compareDelta < 0 ? `Your score moved down ${Math.abs(compareDelta)} point${Math.abs(compareDelta) === 1 ? '' : 's'} since you saved this roadmap.`
    : "Your score hasn't changed since you saved this roadmap.";

  return (
    <div className="results-page career-roadmap-page">
      {isSnapshotView && (
        <div className="results-shared-banner">
          <div className="container">
            <span>Viewing a roadmap saved on {new Date(results.savedAt).toLocaleDateString()}</span>
            <Link to="/assessment" className="results-shared-banner-cta">Take your own assessment &rarr;</Link>
            {hasAnswers && (
              <Link to={`/roadmap?compare=${snapshotParam}`} className="results-shared-banner-cta">See My Progress Since This Save &rarr;</Link>
            )}
          </div>
        </div>
      )}
      {isCompareView && liveResults && (
        <div className="results-shared-banner">
          <div className="container">
            <div className="compare-progress-banner">
              <span>Comparing to your roadmap saved on {new Date(compareData.savedAt).toLocaleDateString()}: {compareData.finalScore}/30</span>
              <span className="compare-progress-now">Now: {liveResults.finalScore}/30 ({compareDelta >= 0 ? '+' : ''}{compareDelta})</span>
            </div>
            <p className="compare-progress-summary">{compareDeltaText}</p>
          </div>
        </div>
      )}
      {isCompareView && !liveResults && (
        <div className="results-shared-banner">
          <div className="container">
            <span>We can&rsquo;t compare &mdash; no current assessment found on this device. Here&rsquo;s the roadmap as it was saved on {new Date(compareData.savedAt).toLocaleDateString()}.</span>
            <Link to="/assessment" className="results-shared-banner-cta">Take the Assessment &rarr;</Link>
          </div>
        </div>
      )}
      <ScoreSection finalScore={finalScore} riskKey={riskKey} riskLabel={riskLabel} />
      <WhySection topProtector={topProtector} />
      <StrengthsSection rankedCategories={rankedCategories} />
      <TasksChangingSection weakestCategory={weakestCategory} automationRisks={automationRisks} riskKey={riskKey} />
      <ProtectionPlanSection rankedCategories={rankedCategories} hoursBudget={hoursBudget} onSelectHours={setHoursBudget} checklist={checklist} onToggleItem={handleToggleChecklistItem} />
      <LearningPlanSection weakestCategory={weakestCategory} hoursBudget={hoursBudget ?? 'mid'} />
      <ToolsSection weakestCategory={weakestCategory} />
      <WorkplaceMovesSection weakestCategory={weakestCategory} />
      <CertificationsSection weakestCategory={weakestCategory} />
      <SimilarCareersSection topProtector={topProtector} />
      <ClosingSection weakestCategory={weakestCategory} results={results} checklist={checklist} onDownloadPdf={() => window.print()} />
    </div>
  );
}
