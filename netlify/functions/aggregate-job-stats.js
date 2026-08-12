// Nightly aggregation Scheduled Function (Milestone 4). Reads assessment
// records from the existing 'assessment-results' Blobs store (already
// populated by save-result.js) that are new since the last run, normalizes
// each record's job title (src/utils/jobTitleMatch.js), groups by canonical
// title, and upserts that day's aggregate stats into job_stats_daily --
// creating a job_titles row on demand if that canonical title hasn't been
// seen before.
//
// Cursor ("since last run") is its own small Blob key, not a new Postgres
// table -- keeps db/schema.sql untouched for this milestone. Never touches
// or exposes raw per-submission data beyond this function's own process;
// only aggregate rows (job title + day) ever reach Postgres.

import { getStore } from '@netlify/blobs';
import { getSql } from './_db/client.js';
import { normalizeJobTitle } from '../../src/utils/jobTitleMatch.js';

const CURSOR_STORE = 'job-stats-meta';
const CURSOR_KEY = 'last-run';
const RESULTS_STORE = 'assessment-results';

export function slugify(canonicalName) {
  return canonicalName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Groups raw assessment records by normalized job title and computes each
 * title's aggregate stats for one day. Pure function -- no I/O, fully
 * unit-testable without a live database or Blobs store.
 * @param {Array<{answers: object, finalScore: number, riskKey: string}>} records
 * @returns {Map<string, {avgScore: number, sampleSize: number, riskLowPct: number, riskMedPct: number, riskHighPct: number}>}
 */
export function computeDailyStats(records) {
  const byTitle = new Map();

  for (const record of records) {
    const canonical = normalizeJobTitle(record?.answers?.Q1);
    if (!canonical) continue; // unmatched free-text titles are excluded, never force-fit

    if (!byTitle.has(canonical)) {
      byTitle.set(canonical, { scores: [], riskCounts: { LOW: 0, MEDIUM: 0, HIGH: 0 } });
    }
    const bucket = byTitle.get(canonical);
    bucket.scores.push(record.finalScore);
    if (record.riskKey in bucket.riskCounts) bucket.riskCounts[record.riskKey]++;
  }

  const stats = new Map();
  for (const [title, { scores, riskCounts }] of byTitle) {
    const sampleSize = scores.length;
    const avgScore = scores.reduce((a, b) => a + b, 0) / sampleSize;
    const pct = (n) => Math.round((n / sampleSize) * 10000) / 100; // 2 decimal places
    stats.set(title, {
      avgScore: Math.round(avgScore * 10) / 10, // 1 decimal place
      sampleSize,
      riskLowPct: pct(riskCounts.LOW),
      riskMedPct: pct(riskCounts.MEDIUM),
      riskHighPct: pct(riskCounts.HIGH),
    });
  }
  return stats;
}

async function getOrCreateJobTitleId(sql, canonicalName) {
  const slug = slugify(canonicalName);
  const inserted = await sql`
    INSERT INTO job_titles (canonical_name, slug)
    VALUES (${canonicalName}, ${slug})
    ON CONFLICT (canonical_name) DO NOTHING
    RETURNING id
  `;
  if (inserted.length > 0) return inserted[0].id;

  const existing = await sql`SELECT id FROM job_titles WHERE canonical_name = ${canonicalName}`;
  return existing[0].id;
}

async function fetchNewRecordsSince(sinceISO) {
  const store = getStore(RESULTS_STORE);
  const { blobs } = await store.list();
  const records = [];
  for (const { key } of blobs) {
    const record = await store.get(key, { type: 'json' });
    if (record?.timestamp && record.timestamp > sinceISO) {
      records.push(record);
    }
  }
  return records;
}

export default async () => {
  const cursorStore = getStore(CURSOR_STORE);
  const lastRun = (await cursorStore.get(CURSOR_KEY, { type: 'text' })) ?? '1970-01-01T00:00:00.000Z';
  const runStartedAt = new Date().toISOString();
  const statDate = runStartedAt.slice(0, 10); // YYYY-MM-DD, UTC

  const records = await fetchNewRecordsSince(lastRun);
  const stats = computeDailyStats(records);

  const sql = getSql();
  for (const [title, s] of stats) {
    const jobTitleId = await getOrCreateJobTitleId(sql, title);
    await sql`
      INSERT INTO job_stats_daily (job_title_id, stat_date, avg_score, sample_size, risk_low_pct, risk_med_pct, risk_high_pct)
      VALUES (${jobTitleId}, ${statDate}, ${s.avgScore}, ${s.sampleSize}, ${s.riskLowPct}, ${s.riskMedPct}, ${s.riskHighPct})
      ON CONFLICT (job_title_id, stat_date) DO UPDATE SET
        avg_score = EXCLUDED.avg_score,
        sample_size = EXCLUDED.sample_size,
        risk_low_pct = EXCLUDED.risk_low_pct,
        risk_med_pct = EXCLUDED.risk_med_pct,
        risk_high_pct = EXCLUDED.risk_high_pct
    `;
  }

  await cursorStore.set(CURSOR_KEY, runStartedAt);

  return new Response(JSON.stringify({ ok: true, recordsProcessed: records.length, titlesUpdated: stats.size }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { schedule: '0 6 * * *' };
