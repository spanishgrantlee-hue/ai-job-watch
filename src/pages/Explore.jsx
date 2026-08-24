import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Fetches /api/job-stats-list and classifies the response into one of four
// UI states: loading, populated (jobs.length > 0), empty (jobs.length === 0,
// nothing has cleared the sample-size gate yet), or error.
function useJobStatsList() {
  const [state, setState] = useState({ status: 'loading', jobs: [] });

  useEffect(() => {
    let cancelled = false;

    fetch('/api/job-stats-list')
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) return setState({ status: 'error', jobs: [] });
        const body = await res.json();
        const jobs = Array.isArray(body.jobs) ? body.jobs : [];
        setState({ status: jobs.length > 0 ? 'populated' : 'empty', jobs });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', jobs: [] });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export default function Explore() {
  const { status, jobs } = useJobStatsList();

  return (
    <div className="page-wrap">
      <Helmet>
        <title>Explore Job Risk Stats | AI Job Watch</title>
        <meta
          name="description"
          content="Browse anonymous, aggregated AI automation risk stats by job title."
        />
      </Helmet>
      <div className="explore-page">
        <div className="explore-hero">
          <h1>Explore Job Risk Stats</h1>
          <p className="explore-lead">
            Anonymous, aggregated AI Resistance Scores reported by real assessment takers, by job title.
          </p>
        </div>

        {status === 'loading' && <p className="explore-loading">Loading…</p>}

        {status === 'error' && (
          <div className="explore-empty">
            <p>We couldn't load job stats right now. Please try again in a moment.</p>
          </div>
        )}

        {status === 'empty' && (
          <div className="explore-empty">
            <p>
              No job titles have enough responses yet to show reliable stats. Check back soon as more
              people take the assessment.
            </p>
            <Link to="/assessment" className="btn-primary btn-lg">
              Take the Assessment →
            </Link>
          </div>
        )}

        {status === 'populated' && (
          <div className="explore-list">
            {jobs.map((job) => (
              <Link key={job.slug} to={`/jobs/${job.slug}`} className="explore-row">
                <div className="explore-row-name">{job.canonicalName}</div>
                <div className="explore-row-stats">
                  <span className="explore-row-score">{job.avgScore} / 30</span>
                  <span className="explore-row-sample">
                    {job.sampleSize} {job.sampleSize === 1 ? 'response' : 'responses'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
