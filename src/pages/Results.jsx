import { useRef, useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAnswers } from '../App';
import { calculateResults } from '../utils/scoring';
import { encodeShareState, decodeShareState, generateTextSummary } from '../utils/share';
import { Helmet } from 'react-helmet-async';
import WhatIfPanel from '../components/WhatIfPanel';

// ─── Resources ────────────────────────────────────────────────────────────────
const RESOURCES = {
  HIGH: {
    headline: 'You still have time to get ahead of this.',
    intro: 'A lot of people are in the same spot right now. The ones who take one small step today will be okay.',
    startHere: 'Pick one free resource below. Spend 30 minutes on it this week. You do not need to learn everything at once — just start somewhere.',
    links: [
      { name: 'AFL-CIO: Workers & AI',  url: 'https://aflcio.org/reports/workers-first-ai', desc: 'Written for workers, not bosses. Explains what AI means for your job and what your rights are.' },
      { name: 'Google AI Essentials',   url: 'https://ai.google/learn-ai-skills',            desc: 'Free courses from Google. Teaches you how to use AI tools at work. No experience needed to start.' },
      { name: 'IBM SkillsBuild',        url: 'https://skillsbuild.org',                       desc: 'Free job training. A few hours can get you started on a skill employers actually want right now.' },
      { name: 'OpenAI Academy',         url: 'https://academy.openai.com',                    desc: 'Short lessons on how to use AI tools like ChatGPT to help you get more done at work.' },
    ],
    tips: [
      "Ask your boss or union rep what AI tools are coming to your workplace. Knowing early gives you time to prepare — most people wait until it's too late.",
      "Look at jobs in your company that need more judgment, people skills, or leadership. Those roles are harder to automate, and moving into one is worth thinking about.",
    ],
  },
  MEDIUM: {
    headline: "You're in decent shape. Keep building on it.",
    intro: 'Your job has real strengths. A little effort now keeps you ahead of the curve.',
    startHere: "Look at your lowest category scores above. That's your best starting point — a small improvement there makes the biggest difference.",
    links: [
      { name: 'Google AI Essentials', url: 'https://ai.google/learn-ai-skills',            desc: 'Free from Google. Learn to use AI tools to do your current job better and faster.' },
      { name: 'OpenAI Academy',       url: 'https://academy.openai.com',                    desc: 'Short, practical lessons on using AI at work. Useful no matter what kind of job you have.' },
      { name: 'IBM SkillsBuild',      url: 'https://skillsbuild.org',                       desc: 'Free training to help you add skills and move into roles with more job protection.' },
      { name: 'AFL-CIO: Workers & AI',url: 'https://aflcio.org/reports/workers-first-ai',   desc: 'Good reading if you want to understand your rights as AI comes into your workplace.' },
    ],
    tips: [
      "Try using one AI tool at work this week — even just to help you write an email or plan a task. Workers who use AI tend to be seen as more valuable, not less.",
      "Think about getting a certification or taking on more responsibility at work. Both make you harder to replace — and they show up directly in your score.",
    ],
  },
  LOW: {
    headline: "Your job is in great shape. Here's how to make it even stronger.",
    intro: 'Workers who have natural job protection AND know how to use AI tools are very hard to replace. That\'s where you want to be.',
    startHere: "Pick one AI tool and try it this week to make part of your job easier. You're adding a new skill on top of strong ones you already have.",
    links: [
      { name: 'Google AI Essentials', url: 'https://ai.google/learn-ai-skills',            desc: 'Free from Google. Learn how to use AI as a tool to save time and do your job even better.' },
      { name: 'OpenAI Academy',       url: 'https://academy.openai.com',                    desc: 'Short lessons on using AI tools like ChatGPT to get more done without more effort.' },
      { name: 'IBM SkillsBuild',      url: 'https://skillsbuild.org',                       desc: 'Free courses to add more skills on top of the strong foundation you already have.' },
      { name: 'AFL-CIO: Workers & AI',url: 'https://aflcio.org/reports/workers-first-ai',   desc: 'Know your rights as AI comes into your workplace — even when your job feels safe.' },
    ],
    tips: [
      "People in low-risk jobs who also know how to use AI tools become very hard to replace. It puts you in the best possible spot.",
      "Teaching coworkers how to do parts of your job does not make you replaceable — it shows you are a leader. That adds even more protection.",
    ],
  },
};

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ResourcesSection({ riskKey }) {
  const data = RESOURCES[riskKey];
  if (!data) return null;

  return (
    <section className="resources-section">
      <div className="container results-container">
        <div className="resources-hdr">
          <div className="section-label">What You Can Do Next</div>
          <h2 className="resources-title">{data.headline}</h2>
          <p className="resources-intro">{data.intro}</p>
        </div>

        <div className="resources-start-here">
          <span className="resources-start-label">Start Here</span>
          <p className="resources-start-text">{data.startHere}</p>
        </div>

        <h3 className="resources-subheading">Free learning resources</h3>
        <div className="resources-links-grid">
          {data.links.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="resource-card">
              <span className="resource-card-name">{link.name}<ExternalIcon /></span>
              <p className="resource-card-desc">{link.desc}</p>
            </a>
          ))}
        </div>

        <h3 className="resources-subheading">Two practical steps</h3>
        <div className="resources-tips">
          {data.tips.map((tip, i) => (
            <div className="resources-tip-card" key={i}>
              <span className="resources-tip-num" aria-hidden="true">{i + 1}</span>
              <p className="resources-tip-text">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScoreRangeBar({ score }) {
  const MAX = 30;
  const markerPct = Math.max(1.5, Math.min(98.5, (score / MAX) * 100));

  return (
    <div className="score-range-bar" aria-hidden="true">
      <div className="score-range-track">
        <div className="score-zone score-zone--high"   style={{ width: '50%' }} />
        <div className="score-zone score-zone--medium" style={{ width: '26.7%' }} />
        <div className="score-zone score-zone--low"    style={{ width: '23.3%' }} />
        <div className="score-marker" style={{ left: `${markerPct}%` }} />
      </div>
      <div className="score-range-legend">
        <span>High Risk<br /><em>0–15</em></span>
        <span>Medium Risk<br /><em>16–23</em></span>
        <span>Low Risk<br /><em>24–30</em></span>
      </div>
    </div>
  );
}

// IDs of scored questions — used to check if assessment was completed
const SCORED_IDS = ['Q6','Q7','Q8','Q9','Q10','Q11','Q12','Q13','Q14','Q15','Q16','Q17','Q18','Q19','Q20','Q21','Q22','Q23','Q24','Q25','Q28'];

export default function Results() {
  const { answers, setAnswers } = useAnswers();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [copied, setCopied]         = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  const shareParam = searchParams.get('share');
  const sharedData = shareParam ? decodeShareState(shareParam) : null;
  const isSharedView = sharedData !== null;

  const hasAnswers = SCORED_IDS.some(id => answers[id] !== undefined);

  // Count-up animation for the hero score number
  useEffect(() => {
    const target = isSharedView
      ? (sharedData?.finalScore ?? 0)
      : (hasAnswers ? calculateResults(answers).finalScore : 0);
    if (!target) return;
    const duration = 900;
    const start = performance.now();
    let frameId;
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      setDisplayScore(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fire-and-forget: save anonymous result once per completed assessment (skip shared views)
  const hasFiredRef = useRef(false);
  useEffect(() => {
    if (!hasAnswers || isSharedView || hasFiredRef.current) return;
    hasFiredRef.current = true;
    const { finalScore, riskKey, categories, aiExposurePenalty, automationRisks } = calculateResults(answers);
    const encoded  = encodeShareState({ finalScore, riskKey, categories, aiExposurePenalty, automationRisks });
    const shareUrl = `${window.location.origin}/results?share=${encoded}`;
    fetch('/api/save-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, finalScore, riskKey, shareUrl }),
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isSharedView && !hasAnswers) {
    return (
      <div className="results-page">
        <div className="results-empty-page">
          <div className="container">
            <div className="results-empty-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6"  y="28" width="8" height="14" rx="2" fill="#DDE3EE"/>
                <rect x="20" y="18" width="8" height="24" rx="2" fill="#DDE3EE"/>
                <rect x="34" y="8"  width="8" height="34" rx="2" fill="#DDE3EE"/>
              </svg>
            </div>
            <h1>No Results Yet</h1>
            <p>Complete the assessment first to get your AI Resistance Score.</p>
            <Link to="/assessment" className="btn-primary">Take the Assessment</Link>
          </div>
        </div>
      </div>
    );
  }

  const { categories, rankedCategories, aiExposurePenalty, finalScore, riskKey, riskLabel, summary, automationRisks, topProtectors } =
    isSharedView ? sharedData : calculateResults(answers);
  const riskClass = riskKey.toLowerCase();
  const shareUrl  = isSharedView
    ? window.location.href
    : `${window.location.origin}/results?share=${encodeShareState({ finalScore, riskKey, categories, aiExposurePenalty, automationRisks })}`;

  const ogImage   = `https://aijobwatch.org/og-${riskClass}.png`;
  const pageTitle = `AI Resistance Score: ${finalScore}/30 (${riskLabel}) | AI Job Watch`;
  const pageDesc  = `Scored ${finalScore}/30 on the AI Job Watch assessment — ${riskLabel}. Take the free quiz to see how AI-proof your job is.`;

  function handleCopyLink() {
    navigator.clipboard.writeText(shareUrl)
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => {});
  }

  function handleCopyText() {
    const text = generateTextSummary({ finalScore, riskLabel, rankedCategories, aiExposurePenalty, automationRisks, topProtectors });
    navigator.clipboard.writeText(text)
      .then(() => { setCopiedText(true); setTimeout(() => setCopiedText(false), 2000); })
      .catch(() => {});
  }

  function handleShareX() {
    const text = `I just checked my AI risk score — got ${finalScore}/30 (${riskKey} Risk). Check yours free:`;
    const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweet, '_blank', 'noopener,noreferrer');
  }

  function handleRetake() {
    setAnswers({});
    navigate('/assessment');
  }

  return (
    <div className="results-page">

      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Shared-view notice */}
      {isSharedView && (
        <div className="results-shared-banner">
          <div className="container">
            <span>You&rsquo;re viewing a shared result.</span>
            <Link to="/assessment" className="results-shared-banner-cta">Take your own assessment &rarr;</Link>
          </div>
        </div>
      )}

      {/* Score Hero */}
      <section className="results-hero">
        <div className="container">
          <p className="results-eyebrow">Your AI Resistance Score</p>
          <div className="results-score-display">
            <span className="results-score-number">{displayScore}</span>
            <span className="results-score-denom">/ 30</span>
          </div>
          <div className={`results-risk-badge results-risk-badge--${riskClass}`}>
            {riskLabel}
          </div>
          <ScoreRangeBar score={finalScore} />
          <div className="results-share-row">
            <button
              type="button"
              className={`btn-copy-link${copied ? ' btn-copy-link--copied' : ''}`}
              onClick={handleCopyLink}
              aria-label="Copy share link to clipboard"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
            <button
              type="button"
              className={`btn-copy-text${copiedText ? ' btn-copy-text--copied' : ''}`}
              onClick={handleCopyText}
              aria-label="Copy plain-text summary to clipboard"
            >
              {copiedText ? '✓ Copied!' : 'Copy as Text'}
            </button>
            <button
              type="button"
              className="btn-share-x"
              onClick={handleShareX}
              aria-label="Share on X (Twitter)"
            >
              Share on X
            </button>
          </div>
        </div>
      </section>

      {/* Personalized Summary */}
      <section className="results-section results-section--white">
        <div className="container results-container">
          <div className={`summary-card summary-card--${riskClass}`}>
            <div className={`summary-card-bar summary-card-bar--${riskClass}`} aria-hidden="true" />
            <div className="summary-card-body">
              <p className="section-label">Personalized Summary</p>
              <h2 className="summary-headline">{summary.headline}</h2>
              <p className="summary-body">{summary.body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Breakdown */}
      <section className="results-section">
        <div className="container results-container">
          <div className="results-section-hdr">
            <div className="section-label">Score Breakdown</div>
            <h2 className="results-section-title">How your job scores across 6 factors</h2>
            <p className="results-section-desc">Each factor is scored 1–5. Higher means stronger protection. The AI Exposure Penalty is subtracted from your total.</p>
          </div>

          <div className="category-breakdown">
            {rankedCategories.map(cat => {
              const fillClass = cat.score >= 4 ? 'fill--strong' : cat.score >= 3 ? 'fill--mid' : 'fill--weak';
              return (
                <div className="category-row" key={cat.key}>
                  <div className="category-row-top">
                    <span className="category-row-label">{cat.label}</span>
                    <span className="category-row-score">{cat.score}<span className="category-row-max">/5</span></span>
                  </div>
                  <div className="category-bar-track">
                    <div className={`category-bar-fill ${fillClass}`} style={{ width: `${(cat.score / 5) * 100}%` }} />
                  </div>
                </div>
              );
            })}

            <div className="category-row category-row--penalty">
              <div className="category-row-top">
                <span className="category-row-label">
                  AI Exposure Penalty
                  <span className="penalty-note"> (subtracted)</span>
                </span>
                <span className="category-row-score category-row-score--penalty">
                  &minus;{aiExposurePenalty}
                </span>
              </div>
              <div className="category-bar-track">
                <div className="category-bar-fill fill--penalty" style={{ width: `${(aiExposurePenalty / 3) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What-If Explorer */}
      <section className="results-section whatif-section">
        <div className="container results-container">
          <div className="whatif-section-hdr">
            <div>
              <div className="section-label">Explore Scenarios</div>
              <h2 className="results-section-title">What-If Explorer</h2>
              <p className="results-section-desc">
                Adjust your category scores to see how small changes would affect your AI Resistance Score.
              </p>
            </div>
            <button
              type="button"
              className={`whatif-toggle-btn${showWhatIf ? ' whatif-toggle-btn--open' : ''}`}
              onClick={() => setShowWhatIf(v => !v)}
              aria-expanded={showWhatIf}
            >
              {showWhatIf ? 'Hide Explorer' : 'Open Explorer'}
            </button>
          </div>
          {showWhatIf && (
            <WhatIfPanel categories={categories} aiExposurePenalty={aiExposurePenalty} />
          )}
        </div>
      </section>

      {/* What Protects Your Job */}
      <section className="results-section results-section--white">
        <div className="container results-container">
          <div className="results-section-hdr">
            <div className="section-label">What Protects Your Job</div>
            <h2 className="results-section-title">Your strongest defenses against automation</h2>
            <p className="results-section-desc">These are the parts of your role that AI struggles to replicate — your natural moat.</p>
          </div>

          {topProtectors.length > 0 ? (
            <div className="protectors-grid">
              {topProtectors.map(cat => (
                <div className="protector-card" key={cat.key}>
                  <div className="protector-card-top">
                    <h3 className="protector-card-label">{cat.label}</h3>
                    <span className="protector-score-badge">{cat.score}/5</span>
                  </div>
                  <p className="protector-card-why">{cat.protectsJobWhy}</p>
                  <div className="protector-tags">
                    {cat.exampleTasks.map(task => (
                      <span className="protector-tag" key={task}>{task}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="results-callout results-callout--warning">
              <p>None of your categories scored high enough to serve as a strong protective factor right now. Building skills in judgment, trust-based work, or earning credentials in your field are the most direct ways to improve your position.</p>
            </div>
          )}
        </div>
      </section>

      {/* What Could Be Automated */}
      <section className="results-section">
        <div className="container results-container">
          <div className="results-section-hdr">
            <div className="section-label">What Could Be Automated</div>
            <h2 className="results-section-title">Areas worth watching</h2>
            <p className="results-section-desc">Based on your answers, these are the tasks in your role most exposed to automation pressure.</p>
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
              <p>Based on your answers, no major automation signals were detected in your role. Your work appears to rely heavily on human judgment, physical presence, or relationship-driven tasks — all of which are difficult to automate.</p>
            </div>
          )}
        </div>
      </section>

      {/* What You Can Do Next */}
      <ResourcesSection riskKey={riskKey} />

      {/* Retake / Take assessment CTA */}
      <section className="results-cta-band">
        <div className="container">
          <h2>{isSharedView ? 'Want to check your own score?' : 'Want to explore a different role?'}</h2>
          <p>{isSharedView ? 'Take the free assessment and get your personalized AI Resistance Score.' : 'Retake the assessment with different answers, or share the link with a coworker so they can check their own score.'}</p>
          <div className="results-cta-actions">
            <button className="btn-primary" onClick={handleRetake} type="button">
              {isSharedView ? 'Take the Assessment' : 'Retake Assessment'}
            </button>
            {!isSharedView && (
              <Link to="/about" className="btn-ghost-dark">
                About this project
              </Link>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
