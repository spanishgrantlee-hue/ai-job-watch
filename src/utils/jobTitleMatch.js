// Job-title normalization — Version 3 foundation only (VERSION3 planning:
// ROADMAP.md's "Industry Intelligence & Benchmarking"). Pure logic, no
// wiring into any page/component/database yet -- deliberately scoped that
// way so every later V3 feature (benchmarking, leaderboard, /jobs/:slug)
// can reuse this without this milestone having to decide on infrastructure.

export const CANONICAL_JOB_TITLES = [
  'Software Engineer', 'Registered Nurse', 'Truck Driver', 'Teacher',
  'Warehouse Associate', 'Customer Service Representative', 'Project Manager',
  'Electrician', 'Accountant', 'Sales Representative', 'Administrative Assistant',
  'Marketing Manager', 'Data Analyst', 'Mechanic', 'Construction Worker',
  'Retail Associate', 'Human Resources Manager', 'Graphic Designer',
  'Financial Analyst', 'Police Officer', 'Chef', 'Plumber', 'Real Estate Agent',
  'Paralegal', 'Dental Hygienist', 'Physical Therapist', 'Pharmacist',
  'Social Worker', 'Welder', 'Longshoreman', 'Bus Driver', 'Insurance Agent',
];

// Common abbreviations/aliases mapped directly, bypassing fuzzy matching.
const ALIASES = {
  'swe': 'Software Engineer',
  'software dev': 'Software Engineer',
  'software developer': 'Software Engineer',
  'dev': 'Software Engineer',
  'rn': 'Registered Nurse',
  'nurse': 'Registered Nurse',
  'cdl driver': 'Truck Driver',
  'trucker': 'Truck Driver',
  'pm': 'Project Manager',
  'cust service rep': 'Customer Service Representative',
  'csr': 'Customer Service Representative',
  'admin assistant': 'Administrative Assistant',
  'admin asst': 'Administrative Assistant',
  'hr manager': 'Human Resources Manager',
  'da': 'Data Analyst',
  'realtor': 'Real Estate Agent',
  'cop': 'Police Officer',
  'pt': 'Physical Therapist',
  'warehouse worker': 'Warehouse Associate',
};

const SENIORITY_TOKENS = new Set([
  'sr', 'senior', 'jr', 'junior', 'lead', 'principal',
  'entry', 'entry-level', 'i', 'ii', 'iii', 'iv', 'associate', 'staff',
]);

function stripPunctuation(s) {
  return s.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ').replace(/\s+/g, ' ').trim();
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

function similarity(a, b) {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

const MATCH_THRESHOLD = 0.72;

// Whole-string similarity under-scores truncated-word abbreviations
// ("software eng" vs "software engineer") because the missing suffix is
// large relative to the longer canonical string. A word-by-word prefix
// check (each input token is a real prefix, >=3 chars, of the matching
// canonical token) catches exactly that case without loosening the general
// fuzzy threshold everywhere else.
function tokenPrefixMatch(inputTokens, canonicalTokens) {
  if (inputTokens.length !== canonicalTokens.length) return false;
  return inputTokens.every((tok, i) => tok.length >= 3 && canonicalTokens[i].startsWith(tok));
}

/**
 * Normalizes free-text job-title input to one of CANONICAL_JOB_TITLES, or
 * null if nothing matches confidently. Never throws on bad input.
 * @param {string} rawInput
 * @returns {string|null}
 */
export function normalizeJobTitle(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return null;
  const cleaned = stripPunctuation(rawInput.toLowerCase());
  if (!cleaned) return null;

  if (ALIASES[cleaned]) return ALIASES[cleaned];

  const strippedInput = cleaned.split(' ').filter(t => t && !SENIORITY_TOKENS.has(t)).join(' ');
  if (ALIASES[strippedInput]) return ALIASES[strippedInput];

  const inputTokens = strippedInput.split(' ').filter(Boolean);
  let bestMatch = null;
  let bestScore = 0;
  for (const canonical of CANONICAL_JOB_TITLES) {
    const canonicalLower = canonical.toLowerCase();
    if (canonicalLower === strippedInput || canonicalLower === cleaned) return canonical;
    if (tokenPrefixMatch(inputTokens, canonicalLower.split(' '))) return canonical;
    const score = Math.max(similarity(strippedInput, canonicalLower), similarity(cleaned, canonicalLower));
    if (score > bestScore) { bestScore = score; bestMatch = canonical; }
  }

  return bestScore >= MATCH_THRESHOLD ? bestMatch : null;
}
