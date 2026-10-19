// Read-only job-stats list function (Milestone 8). Returns every job title
// whose total sample size across all of its job_stats_daily rows meets
// MIN_SAMPLE_SIZE -- the data-fetching piece the /explore page calls. No
// writes, GET only, no filtering/sorting (that's deferred until
// job_titles.industry is actually populated).
//
// Totals each title's daily rows exactly the way get-job-stats.js does
// (sample sizes summed, averages/percentages weighted by each day's sample
// size, stat_date = most recent day), then applies the same sample-size gate
// to that total, so the two endpoints can never disagree about which titles
// are available.

import { getSql } from './_db/client.js';
import { MIN_SAMPLE_SIZE } from './get-job-stats.js';

function json(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const sql = getSql();

  const rows = await sql`
    SELECT jt.canonical_name, jt.slug, jt.industry,
           MAX(jsd.stat_date)                                                         AS stat_date,
           SUM(jsd.sample_size)::int                                                  AS sample_size,
           ROUND(SUM(jsd.avg_score     * jsd.sample_size) / SUM(jsd.sample_size), 1) AS avg_score,
           ROUND(SUM(jsd.risk_low_pct  * jsd.sample_size) / SUM(jsd.sample_size), 2) AS risk_low_pct,
           ROUND(SUM(jsd.risk_med_pct  * jsd.sample_size) / SUM(jsd.sample_size), 2) AS risk_med_pct,
           ROUND(SUM(jsd.risk_high_pct * jsd.sample_size) / SUM(jsd.sample_size), 2) AS risk_high_pct
    FROM job_titles jt
    JOIN job_stats_daily jsd ON jsd.job_title_id = jt.id
    GROUP BY jt.id
    HAVING SUM(jsd.sample_size) >= ${MIN_SAMPLE_SIZE}
    ORDER BY jt.canonical_name
  `;

  const jobs = rows.map((row) => ({
    canonicalName: row.canonical_name,
    slug: row.slug,
    industry: row.industry,
    statDate: row.stat_date,
    avgScore: Number(row.avg_score),
    sampleSize: row.sample_size,
    riskLowPct: Number(row.risk_low_pct),
    riskMedPct: Number(row.risk_med_pct),
    riskHighPct: Number(row.risk_high_pct),
  }));

  return json({ jobs }, 200);
};

export const config = { path: '/api/job-stats-list' };
