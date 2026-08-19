import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function formatStatDate(stat_date) {
  // Neon's DATE column may come back as a plain 'YYYY-MM-DD' string or a
  // full ISO timestamp depending on driver serialization -- slicing first
  // guards against both instead of assuming one shape.
  const dateOnly = String(stat_date).slice(0, 10);
  return new Date(`${dateOnly}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// Fetches /api/job-stats for the given slug and classifies the response into
// one of five UI states: loading, available, unavailable (not enough data),
// not_found (no such job title), or error (bad request / network failure).
function useJobStats(slug) {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/job-stats?slug=${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) return setState({ status: 'not_found', data: null });
        if (!res.ok) return setState({ status: 'error', data: null });
        const body = await res.json();
        setState({ status: body.available ? 'available' : 'unavailable', data: body });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}

function EmptyState({ title, message }) {
  return (
    <div className="job-stats-empty">
      <h1>{title}</h1>
      <p>{message}</p>
      <Link to="/assessment" className="btn-primary btn-lg">
        Take the Assessment →
      </Link>
    </div>
  );
}

function StatsView({ data }) {
  return (
    <>
      <div className="job-stats-hero">
        <p className="job-stats-eyebrow">Job Title Automation Risk</p>
        <h1>{data.canonicalName}</h1>
        {data.industry && <p className="job-stats-industry">{data.industry}</p>}
      </div>

      <div className="job-stats-section">
        <div className="job-stats-score-row">
          <div className="job-stats-score-number">{data.avgScore}</div>
          <div className="job-stats-score-denom">/ 30 avg. AI Resistance Score</div>
        </div>
        <p className="job-stats-meta">
          Based on {data.sampleSize} anonymous {data.sampleSize === 1 ? 'response' : 'responses'} · last updated{' '}
          {formatStatDate(data.statDate)}
        </p>
      </div>

      <div className="job-stats-section">
        <h2>Risk distribution</h2>
        <div className="job-stats-risk-row">
          <div className="job-stats-risk-item job-stats-risk-item--low">
            <span className="job-stats-risk-pct">{data.riskLowPct}%</span>
            <span className="job-stats-risk-label">Low Risk</span>
          </div>
          <div className="job-stats-risk-item job-stats-risk-item--medium">
            <span className="job-stats-risk-pct">{data.riskMedPct}%</span>
            <span className="job-stats-risk-label">Medium Risk</span>
          </div>
          <div className="job-stats-risk-item job-stats-risk-item--high">
            <span className="job-stats-risk-pct">{data.riskHighPct}%</span>
            <span className="job-stats-risk-label">High Risk</span>
          </div>
        </div>
      </div>

      <div className="job-stats-cta">
        <Link to="/assessment" className="btn-primary btn-lg">
          See where you stand →
        </Link>
      </div>
    </>
  );
}

export default function JobStats() {
  const { slug } = useParams();
  // Keyed on slug so navigating between two /jobs/:slug URLs remounts this
  // view with fresh state, rather than reusing state across an in-place
  // param change.
  return <JobStatsView key={slug} slug={slug} />;
}

function JobStatsView({ slug }) {
  const { status, data } = useJobStats(slug);

  return (
    <div className="page-wrap">
      <Helmet>
        <title>
          {status === 'available' ? `${data.canonicalName} AI Risk Stats | AI Job Watch` : 'Job Stats | AI Job Watch'}
        </title>
        <meta
          name="description"
          content={
            status === 'available'
              ? `See the average AI automation risk score and risk breakdown reported by ${data.sampleSize} anonymous ${data.canonicalName} assessment takers.`
              : 'Anonymous, aggregated AI automation risk stats by job title.'
          }
        />
      </Helmet>
      <div className="job-stats-page">
        {status === 'loading' && <p className="job-stats-loading">Loading…</p>}

        {status === 'not_found' && (
          <EmptyState
            title="Job title not found"
            message="We don't have this job title in our database yet."
          />
        )}

        {status === 'error' && (
          <EmptyState
            title="Something went wrong"
            message="We couldn't load stats for this job title right now. Please try again in a moment."
          />
        )}

        {status === 'unavailable' && (
          <EmptyState
            title={data.canonicalName}
            message={
              data.reason === 'no_data_yet'
                ? "We haven't collected any assessment data for this job title yet."
                : "We don't have enough responses yet to show reliable stats for this job title."
            }
          />
        )}

        {status === 'available' && <StatsView data={data} />}
      </div>
    </div>
  );
}
