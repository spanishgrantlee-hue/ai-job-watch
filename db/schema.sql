-- AI Job Watch — Version 3 aggregate-only database schema
-- Target: Neon (serverless Postgres). Holds ONLY anonymous, aggregated
-- job-title statistics -- never raw per-submission answers, which stay
-- in Netlify Blobs exactly as they already do today (netlify/functions/
-- save-result.js). Lowest granularity here is "job title + day", never
-- an individual.
--
-- Not yet run against a live database -- Milestone 2 (provisioning Neon)
-- is a separate, later, manual step. This file is the versioned source
-- of truth to run once that database exists. Verified with a standalone
-- PostgreSQL syntax parser (node-sql-parser), not yet against a live server.

CREATE TABLE job_titles (
  id             SERIAL PRIMARY KEY,
  canonical_name TEXT UNIQUE NOT NULL,   -- e.g. "Software Engineer" -- must match
                                          -- a value from CANONICAL_JOB_TITLES in
                                          -- src/utils/jobTitleMatch.js
  slug           TEXT UNIQUE NOT NULL,   -- e.g. "software-engineer", for /jobs/:slug
  industry       TEXT,                   -- optional, for /explore filtering
  bls_code       TEXT                    -- optional, future cross-reference
);

CREATE INDEX idx_job_titles_slug ON job_titles (slug);
CREATE INDEX idx_job_titles_industry ON job_titles (industry);

CREATE TABLE job_stats_daily (
  id             SERIAL PRIMARY KEY,
  job_title_id   INTEGER NOT NULL REFERENCES job_titles(id) ON DELETE CASCADE,
  stat_date      DATE NOT NULL,          -- one row per title per day -- this is
                                          -- what makes historical trend queries a
                                          -- plain date-range SELECT, no separate
                                          -- history table needed
  avg_score      NUMERIC(4,1) NOT NULL,
  sample_size    INTEGER NOT NULL,
  risk_low_pct   NUMERIC(5,2),
  risk_med_pct   NUMERIC(5,2),
  risk_high_pct  NUMERIC(5,2),
  UNIQUE (job_title_id, stat_date)
);

-- Supports "latest stats for this job title" (job_stats_daily page lookups)
-- and "trend over time for this job title" (date-range queries) with the
-- same index, since it's a prefix match on job_title_id.
CREATE INDEX idx_job_stats_daily_title_date ON job_stats_daily (job_title_id, stat_date DESC);

-- A minimum-sample-size guard belongs in application code at read time
-- (e.g. WHERE sample_size >= 5), not the schema -- keeps the threshold
-- easy to change later without a migration.
