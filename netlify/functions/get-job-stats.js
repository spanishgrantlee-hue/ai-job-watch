// Read-only job-stats query function (Milestone 5). Given a job-title slug,
// returns that title's aggregate stats from job_stats_daily -- the
// data-fetching piece the /jobs/:slug page calls. No writes, GET only.
//
// job_stats_daily holds one row per title per day, and each row counts only
// the submissions the nightly job saw that day (aggregate-job-stats.js reads
// records "since the last run"). So a title's stats are the TOTAL across all
// of its rows: sample sizes summed, and averages/percentages weighted by each
// day's sample size. (Reading only the latest row treated one day's count as
// the whole history, so stats never accumulated past a single day.)
//
// Implements the minimum-sample-size guard db/schema.sql's own header
// comment flagged as unfinished: "belongs in application code at read
// time, not the schema" -- this is that application code. A title with no
// stats yet, or fewer than MIN_SAMPLE_SIZE submissions in total, is reported
// as unavailable rather than exposing a near-identifying small-sample
// statistic.

import { getSql } from './_db/client.js';

export const MIN_SAMPLE_SIZE = 5;

export function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length > 0 && slug.length <= 100 && /^[a-z0-9-]+$/.test(slug);
}

/**
 * Pure response-shaping logic, given a job_titles row and its latest
 * job_stats_daily row (or null if none exists yet). No I/O -- fully
 * unit-testable without a live database.
 */
export function buildStatsResponse(jobTitleRow, latestStatsRow) {
  if (!latestStatsRow || latestStatsRow.sample_size < MIN_SAMPLE_SIZE) {
    return {
      available: false,
      canonicalName: jobTitleRow.canonical_name,
      slug: jobTitleRow.slug,
      reason: !latestStatsRow ? 'no_data_yet' : 'insufficient_sample_size',
    };
  }
  return {
    available: true,
    canonicalName: jobTitleRow.canonical_name,
    slug: jobTitleRow.slug,
    industry: jobTitleRow.industry,
    statDate: latestStatsRow.stat_date,
    avgScore: Number(latestStatsRow.avg_score),
    sampleSize: latestStatsRow.sample_size,
    riskLowPct: Number(latestStatsRow.risk_low_pct),
    riskMedPct: Number(latestStatsRow.risk_med_pct),
    riskHighPct: Number(latestStatsRow.risk_high_pct),
  };
}

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

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!isValidSlug(slug)) {
    return json({ error: 'Invalid or missing slug parameter' }, 400);
  }

  const sql = getSql();

  const titleRows = await sql`
    SELECT id, canonical_name, slug, industry FROM job_titles WHERE slug = ${slug}
  `;
  if (titleRows.length === 0) {
    return json({ error: 'Job title not found' }, 404);
  }
  const jobTitleRow = titleRows[0];

  // Totals across every day (same column names buildStatsResponse expects).
  // stat_date is the most recent day with data. HAVING returns no row for a
  // title with no stats yet, so that case still reads as 'no_data_yet'. Every
  // stored row has sample_size >= 1 (the nightly job only writes titles it
  // matched), so the weighted divisions can't divide by zero.
  const statsRows = await sql`
    SELECT MAX(stat_date)                                                 AS stat_date,
           SUM(sample_size)::int                                          AS sample_size,
           ROUND(SUM(avg_score     * sample_size) / SUM(sample_size), 1) AS avg_score,
           ROUND(SUM(risk_low_pct  * sample_size) / SUM(sample_size), 2) AS risk_low_pct,
           ROUND(SUM(risk_med_pct  * sample_size) / SUM(sample_size), 2) AS risk_med_pct,
           ROUND(SUM(risk_high_pct * sample_size) / SUM(sample_size), 2) AS risk_high_pct
    FROM job_stats_daily
    WHERE job_title_id = ${jobTitleRow.id}
    HAVING COUNT(*) > 0
  `;
  const latestStatsRow = statsRows[0] ?? null;

  return json(buildStatsResponse(jobTitleRow, latestStatsRow), 200);
};

export const config = { path: '/api/job-stats' };
