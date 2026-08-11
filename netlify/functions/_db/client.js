/* global process */
// Minimal Neon serverless Postgres connection helper. Reads DATABASE_URL
// from the environment -- a Netlify secret (Production scope), set directly
// in Netlify's dashboard, never committed or stored anywhere in this repo.
// Fails fast with a clear, actionable error if it's missing, rather than
// silently returning broken results. Query surface for db/schema.sql's
// aggregate-only tables (job_titles, job_stats_daily) -- never raw
// per-submission data, which stays in Netlify Blobs (see save-result.js).

import { neon } from '@neondatabase/serverless';

let cachedSql = null;

/**
 * Returns the shared Neon serverless SQL tag function, creating it on
 * first use and reusing it after (Netlify Functions can be re-invoked on
 * a warm instance, so this avoids reconstructing it every call).
 * @returns {import('@neondatabase/serverless').NeonQueryFunction}
 */
export function getSql() {
  if (cachedSql) return cachedSql;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Configure it as a Netlify environment variable ' +
      '(Production scope) pointing at the Neon database -- see db/schema.sql for the schema it expects.'
    );
  }

  cachedSql = neon(connectionString);
  return cachedSql;
}

/**
 * Tagged-template query helper, e.g.:
 *   const rows = await query`SELECT * FROM job_titles WHERE slug = ${slug}`;
 * Neon's driver parameterizes template values automatically -- never build
 * query strings by concatenation.
 */
export function query(strings, ...values) {
  return getSql()(strings, ...values);
}
