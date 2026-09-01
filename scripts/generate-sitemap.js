// Regenerates sitemap.xml from the actual route list + the canonical job
// title list, so it can't silently drift out of sync the way the hand-written
// public/sitemap.xml did (stuck at 3 URLs for months while new routes were
// added). Run automatically as part of `npm run build` (see package.json).
//
// Deliberately reads CANONICAL_JOB_TITLES from src/utils/jobTitleMatch.js
// (pure logic, no DB/browser dependency) rather than hitting the live
// /api/job-stats-list endpoint at build time, so the build stays hermetic.
// Titles that haven't cleared the sample-size gate yet are still listed here
// but are excluded from indexing via <meta name="robots" content="noindex">
// on JobStats.jsx, so there's no thin-content risk from listing them.
//
// Run with: node scripts/generate-sitemap.js
// Output: dist/sitemap.xml

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { CANONICAL_JOB_TITLES, slugify } from '../src/utils/jobTitleMatch.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const BASE_URL = 'https://aijobwatch.org';

const today = new Date().toISOString().slice(0, 10);

const staticUrls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/assessment', changefreq: 'monthly', priority: '0.9' },
  { loc: '/explore', changefreq: 'weekly', priority: '0.8' },
  { loc: '/about', changefreq: 'yearly', priority: '0.5' },
  { loc: '/will-ai-replace-my-job', changefreq: 'monthly', priority: '0.8' },
  { loc: '/ai-job-risk-assessment', changefreq: 'monthly', priority: '0.8' },
];

const jobUrls = CANONICAL_JOB_TITLES.map((title) => ({
  loc: `/jobs/${slugify(title)}`,
  changefreq: 'weekly',
  priority: '0.6',
}));

const urls = [...staticUrls, ...jobUrls];

const body = urls
  .map(
    ({ loc, changefreq, priority }) => `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${body}

</urlset>
`;

mkdirSync(DIST, { recursive: true });
writeFileSync(resolve(DIST, 'sitemap.xml'), xml);

console.log(`Wrote dist/sitemap.xml with ${urls.length} URLs.`);
