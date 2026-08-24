// Read-only job-stats list function (Milestone 8). Returns every job title
// whose latest job_stats_daily row meets MIN_SAMPLE_SIZE -- the data-fetching
// piece the /explore page calls. No writes, GET only, no filtering/sorting
// (that's deferred until job_titles.industry is actually populated).
//
// Gets each title's latest stats row first, then applies the sample-size
// gate -- same order of operations as get-job-stats.js's buildStatsResponse,
// so the two endpoints can never disagree about which titles are available.

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
    SELECT canonical_name, slug, industry, stat_date, avg_score, sample_size,
           risk_low_pct, risk_med_pct, risk_high_pct
    FROM (
      SELECT DISTINCT ON (jt.id)
        jt.canonical_name, jt.slug, jt.industry,
        jsd.stat_date, jsd.avg_score, jsd.sample_size,
        jsd.risk_low_pct, jsd.risk_med_pct, jsd.risk_high_pct
      FROM job_titles jt
      JOIN job_stats_daily jsd ON jsd.job_title_id = jt.id
      ORDER BY jt.id, jsd.stat_date DESC
    ) latest
    WHERE sample_size >= ${MIN_SAMPLE_SIZE}
    ORDER BY canonical_name
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
