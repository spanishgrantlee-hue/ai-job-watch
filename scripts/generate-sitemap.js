// Regenerates sitemap.xml from the actual route list + the canonical job
// title list, so it can't silently drift out of sync the way the hand-written
// public/sitemap.xml did (stuck at 3 URLs for months while new routes were
// added). Run automatically as part of `npm run build` (see package.json).
//
// Deliberately reads CANONICAL_JOB_TITLES from src/utils/jobTitleMatch.js
// (pure logic, no DB/browser dependency) rather than hitting the live
// /api/job-stats-list endpoint at build time, so the build stays hermetic.
// Titles that haven't cleared the sample-size gate yet, and have no static
// editorial content (see the jobUrls filter below), are excluded from this
// sitemap entirely -- they're noindex on JobStats.jsx, and Search Console
// showed a batch of 30+ such near-duplicate URLs was suppressing crawl
// attention on the rest of the site (Day 13).
//
// Run with: node scripts/generate-sitemap.js
// Output: dist/sitemap.xml

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { CANONICAL_JOB_TITLES, slugify } from '../src/utils/jobTitleMatch.js';
import { JOB_PAGE_CONTENT } from '../src/content/jobPageContent.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIST = resolve(ROOT, 'dist');
const BASE_URL = 'https://aijobwatch.org';

// Returns the last commit date (YYYY-MM-DD) touching a single file, or null
// if git has no history for it -- a shallow clone (Netlify's build
// environment depth is unconfirmed) or an untracked file are both handled
// the same way: no date, not a guess. Never falls back to the build date --
// a fabricated "today" lastmod is worse than omitting the field, which the
// sitemap spec explicitly allows.
function gitLastModified(relativePath) {
  try {
    const output = execFileSync(
      'git',
      ['log', '-1', '--format=%cd', '--date=short', '--', relativePath],
      { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] }
    ).toString().trim();
    return output || null;
  } catch {
    return null;
  }
}

// A URL's real freshness is the most recent commit across every source file
// that actually renders it (e.g. the job-page template plus its content
// data). Returns null -- never today's date -- if none resolve.
function lastModifiedDate(relativePaths) {
  const dates = relativePaths.map(gitLastModified).filter((d) => d !== null);
  return dates.length === 0 ? null : dates.reduce((latest, d) => (d > latest ? d : latest));
}

const ROUTE_SOURCE_FILES = {
  '/': ['src/pages/Home.jsx'],
  '/assessment': ['src/pages/Assessment.jsx'],
  '/explore': ['src/pages/Explore.jsx'],
  '/about': ['src/pages/About.jsx'],
  '/will-ai-replace-my-job': ['src/pages/WillAiReplaceMyJob.jsx'],
  '/ai-job-risk-assessment': ['src/pages/AiJobRiskAssessment.jsx'],
};

// Every /jobs/:slug page with static content is rendered by the same
// template plus its entry in jobPageContent.js -- either one changing
// means the page changed.
const JOB_PAGE_SOURCE_FILES = ['src/pages/JobStats.jsx', 'src/content/jobPageContent.js'];

const staticUrls = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/assessment', changefreq: 'monthly', priority: '0.9' },
  { loc: '/explore', changefreq: 'weekly', priority: '0.8' },
  { loc: '/about', changefreq: 'yearly', priority: '0.5' },
  { loc: '/will-ai-replace-my-job', changefreq: 'monthly', priority: '0.8' },
  { loc: '/ai-job-risk-assessment', changefreq: 'monthly', priority: '0.8' },
].map((url) => ({ ...url, lastmod: lastModifiedDate(ROUTE_SOURCE_FILES[url.loc]) }));

// Only list job slugs that are actually indexable (have static editorial
// content -- see src/content/jobPageContent.js). The other canonical titles
// render a noindex empty state until real data clears the sample-size gate,
// and listing 30+ near-duplicate noindex URLs in the sitemap wastes crawl
// budget Google could spend on pages that are actually worth indexing.
const jobUrls = CANONICAL_JOB_TITLES
  .filter((title) => JOB_PAGE_CONTENT[slugify(title)])
  .map((title) => ({
    loc: `/jobs/${slugify(title)}`,
    changefreq: 'weekly',
    priority: '0.6',
    lastmod: lastModifiedDate(JOB_PAGE_SOURCE_FILES),
  }));

const urls = [...staticUrls, ...jobUrls];

const body = urls
  .map(({ loc, changefreq, priority, lastmod }) => {
    const lastmodLine = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
    return `  <url>
    <loc>${BASE_URL}${loc}</loc>${lastmodLine}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${body}

</urlset>
`;

mkdirSync(DIST, { recursive: true });
writeFileSync(resolve(DIST, 'sitemap.xml'), xml);

console.log(`Wrote dist/sitemap.xml with ${urls.length} URLs.`);
