import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RISK_CONFIG = {
  LOW: {
    label: 'LOW RISK',
    color: 'var(--success)',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    headline: 'Your job is well-protected',
    summary:
      'Strong structural barriers make your role difficult to automate. Human judgment, physical presence, and professional licensing all work in your favour. Keep investing in the skills that make you irreplaceable.',
  },
  MEDIUM: {
    label: 'MEDIUM RISK',
    color: 'var(--warning)',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.35)',
    headline: 'Some areas need attention',
    summary:
      'Parts of your role show meaningful automation exposure. The good news: your human-intensive tasks still provide protection. Proactively building new skills and deepening your expertise will help you stay ahead.',
  },
  HIGH: {
    label: 'HIGH RISK',
    color: 'var(--danger)',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.35)',
    headline: 'Significant automation exposure',
    summary:
      'Your role has structural characteristics that make it vulnerable to AI displacement. This is the time to take action — explore adjacent roles, pursue new certifications, or consider a career pivot toward areas with stronger human protection.',
  },
};

const CATEGORY_DESCRIPTIONS = {
  Accountability:
    'How much others depend on your personal judgment and professional accountability.',
  Trust: 'How central relationship-building and interpersonal trust are to your role.',
  Judgment: 'How often you make nuanced decisions that rules alone cannot cover.',
  'Problem Solving': 'How frequently you tackle novel problems without a predefined answer.',
  'Physical Presence': 'How much your role requires physical location or manual action.',
  Licensing: 'How much formal credentials or regulations protect your position.',
};

function ScoreGauge({ score, max = 30 }) {
  const pct = Math.min(1, score / max);
  const radius = 90;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - pct);

  let color;
  if (score >= 24) color = 'var(--success)';
  else if (score >= 16) color = 'var(--warning)';
  else color = 'var(--danger)';

  return (
    <div className="gauge-wrap">
      <svg viewBox="0 0 200 110" className="gauge-svg">
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 10 100 A 90 90 0 0 1 190 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="gauge-center">
        <div className="gauge-score" style={{ color }}>{score}</div>
        <div className="gauge-max">out of 30</div>
      </div>
    </div>
  );
}

function CategoryBar({ name, score, max = 5 }) {
  const pct = (score / max) * 100;
  return (
    <div className="cat-bar-row">
      <div className="cat-bar-header">
        <span className="cat-name">{name}</span>
        <span className="cat-score">{score}<span className="cat-max">/{max}</span></span>
      </div>
      <div className="cat-track">
        <div
          className="cat-fill"
          style={{
            width: `${pct}%`,
            background:
              score >= 4
                ? 'var(--success)'
                : score >= 3
                ? 'var(--accent)'
                : score >= 2
                ? 'var(--warning)'
                : 'var(--danger)',
          }}
        />
      </div>
      <p className="cat-desc">{CATEGORY_DESCRIPTIONS[name]}</p>
    </div>
  );
}

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.scores) navigate('/assessment');
  }, [state, navigate]);

  if (!state?.scores) return null;

  const { scores, answers } = state;
  const { categories, aiExposure, total, riskLevel } = scores;
  const cfg = RISK_CONFIG[riskLevel];
  const jobTitle = answers?.Q1 || 'Your Role';

  return (
    <div className="page-wrap">
    <div className="results-page">
      <div className="results-header">
        <div className="results-title-block">
          <p className="results-subtitle">Assessment results for</p>
          <h1 className="results-title">{jobTitle}</h1>
        </div>
      </div>

      {/* Score Hero */}
      <div className="score-hero">
        <div className="score-gauge-col">
          <ScoreGauge score={total} />
        </div>
        <div className="score-info-col">
          <div
            className="risk-badge"
            style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
          >
            {cfg.label}
          </div>
          <h2 className="score-headline">{cfg.headline}</h2>
          <p className="score-summary">{cfg.summary}</p>
          <div className="score-formula">
            <div className="formula-label">Score breakdown</div>
            <div className="formula-parts">
              {Object.entries(categories).map(([name, val]) => (
                <div key={name} className="formula-part">
                  <span className="formula-val">{val}</span>
                  <span className="formula-name">{name}</span>
                </div>
              ))}
              <div className="formula-minus">−</div>
              <div className="formula-part penalty">
                <span className="formula-val">{aiExposure}</span>
                <span className="formula-name">AI Exposure</span>
              </div>
              <div className="formula-equals">=</div>
              <div className="formula-part total">
                <span className="formula-val">{total}</span>
                <span className="formula-name">Final Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="results-section">
        <h2 className="results-section-title">Category Breakdown</h2>
        <p className="results-section-sub">
          Each category is scored 1–5. Higher scores mean stronger protection in that area.
        </p>
        <div className="category-bars">
          {Object.entries(categories).map(([name, score]) => (
            <CategoryBar key={name} name={name} score={score} />
          ))}
        </div>
      </div>

      {/* AI Exposure Panel */}
      <div className="results-section">
        <div className="exposure-panel">
          <div className="exposure-left">
            <h3>AI Exposure Penalty</h3>
            <p>
              This score captures how much AI has already penetrated your work — measured by
              repeatability, digital deliverability, and how quickly someone could replace you. A
              higher penalty means more exposure.
            </p>
          </div>
          <div className="exposure-score">
            <div
              className="exposure-number"
              style={{
                color:
                  aiExposure <= 1
                    ? 'var(--success)'
                    : aiExposure <= 3
                    ? 'var(--warning)'
                    : 'var(--danger)',
              }}
            >
              {aiExposure}
            </div>
            <div className="exposure-label">out of 5</div>
          </div>
        </div>
      </div>

      {/* Risk Scale Reference */}
      <div className="results-section">
        <h2 className="results-section-title">Where You Fall on the Scale</h2>
        <div className="scale-bar-wrap">
          <div className="scale-bar">
            <div className="scale-zone zone-high">≤15<br/>HIGH</div>
            <div className="scale-zone zone-medium">16–23<br/>MEDIUM</div>
            <div className="scale-zone zone-low">24+<br/>LOW</div>
            <div
              className="scale-marker"
              style={{ left: `${Math.min(98, Math.max(2, (total / 30) * 100))}%` }}
            >
              <div className="scale-marker-dot" />
              <div className="scale-marker-label">{total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="results-actions">
        <Link to="/assessment" className="btn-primary">
          Retake Assessment
        </Link>
        <Link to="/" className="btn-ghost">
          Back to Home
        </Link>
      </div>

      <p className="results-disclaimer">
        This tool provides a structural analysis based on your answers. It is not a guarantee of
        employment outcomes. Use it as one input among many when thinking about your career.
      </p>
    </div>
    </div>
  );
}
