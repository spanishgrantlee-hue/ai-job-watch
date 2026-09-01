import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { JOB_PAGE_CONTENT } from '../content/jobPageContent';

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

function StatsBody({ data }) {
  return (
    <>
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
    </>
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

      <StatsBody data={data} />

      <div className="job-stats-cta">
        <Link to="/assessment" className="btn-primary btn-lg">
          See where you stand →
        </Link>
      </div>
    </>
  );
}

// Day 4 SEO pilot: renders always-indexable editorial content for a slug
// with an entry in JOB_PAGE_CONTENT, plus the live stats block (StatsBody)
// whenever real data has cleared the sample-size gate. Slugs without an
// entry never reach this component -- see JobStatsView.
function StaticJobPage({ content, status, data }) {
  return (
    <>
      <div className="job-stats-hero">
        <p className="job-stats-eyebrow">Job Title Automation Risk</p>
        <h1>{content.h1}</h1>
        <p className="job-stats-industry">{content.jobLabel}</p>
      </div>

      <div className="about-section">
        {content.intro.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>

      <div className="about-section">
        <h2>How {content.jobLabel} Scores on Each Factor</h2>
        <div className="category-table">
          {content.factors.map((f) => (
            <div key={f.name} className="category-table-row">
              <div className="cat-table-name">{f.name}</div>
              <div className="cat-table-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {status === 'available' && <StatsBody data={data} />}

      <div className="about-section">
        <h2>A Few Common Questions</h2>
        {content.faqs.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </div>

      <div className="about-cta">
        <Link to="/assessment" className="btn-primary btn-lg">
          Take the Free Assessment →
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
  const staticContent = JOB_PAGE_CONTENT[slug];

  const pageTitle = staticContent
    ? staticContent.title
    : status === 'available'
      ? `${data.canonicalName} AI Risk Stats | AI Job Watch`
      : 'Job Stats | AI Job Watch';
  const pageDesc = staticContent
    ? staticContent.metaDescription
    : status === 'available'
      ? `See the average AI automation risk score and risk breakdown reported by ${data.sampleSize} anonymous ${data.canonicalName} assessment takers.`
      : 'Anonymous, aggregated AI automation risk stats by job title.';
  const pageUrl = `https://aijobwatch.org/jobs/${slug}`;
  // A slug with static editorial content is indexable on its own merits,
  // regardless of whether live stats have cleared the sample-size gate yet.
  const robotsContent = (staticContent || status === 'available') ? 'index,follow' : 'noindex,follow';

  const faqStructuredData = staticContent && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: staticContent.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="page-wrap">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta name="robots" content={robotsContent} />
        {faqStructuredData && (
          <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        )}
      </Helmet>
      <div className="job-stats-page">
        {staticContent ? (
          <StaticJobPage content={staticContent} status={status} data={data} />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
