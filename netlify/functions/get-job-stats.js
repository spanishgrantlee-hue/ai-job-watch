// Read-only job-stats query function (Milestone 5). Given a job-title slug,
// returns that title's latest aggregate stats from job_stats_daily -- the
// data-fetching piece a future /jobs/:slug page would call. No writes, GET
// only, no page/routing built here.
//
// Implements the minimum-sample-size guard db/schema.sql's own header
// comment flagged as unfinished: "belongs in application code at read
// time, not the schema" -- this is that application code. A title with no
// stats yet, or fewer than MIN_SAMPLE_SIZE submissions in its latest day,
// is reported as unavailable rather than exposing a near-identifying
// small-sample statistic.

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

  const statsRows = await sql`
    SELECT stat_date, avg_score, sample_size, risk_low_pct, risk_med_pct, risk_high_pct
    FROM job_stats_daily
    WHERE job_title_id = ${jobTitleRow.id}
    ORDER BY stat_date DESC
    LIMIT 1
  `;
  const latestStatsRow = statsRows[0] ?? null;

  return json(buildStatsResponse(jobTitleRow, latestStatsRow), 200);
};

export const config = { path: '/api/job-stats' };
