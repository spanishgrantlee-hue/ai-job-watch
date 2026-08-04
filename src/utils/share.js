// Utilities for encoding and decoding shareable result URLs.
// encode → btoa(JSON) with URL-safe chars; decode → inverse.
// Both functions run in browser and Node 18+ (btoa/atob are globals in both).

import {
  CATEGORY_META,
  RISK_THRESHOLDS,
  RISK_SUMMARIES,
  AUTOMATION_SIGNALS,
} from './scoring.js';

// Fixed order — never reorder; decodeShareState relies on array positions.
export const CAT_ORDER = [
  'accountability',
  'trust',
  'judgment',
  'problemSolving',
  'physicalPresence',
  'licensing',
];

// Must match AUTOMATION_SIGNALS key order in scoring.js.
const SIGNAL_KEYS = ['routine', 'dataEntry', 'aiAlreadyHere', 'remoteInfo', 'replaceability'];

// Fixed order — never reorder; decodeRoadmapSnapshot's checklist bitmask
// relies on CAT_ORDER x TIMEFRAME_ORDER position (see P5). Matches
// PLAYBOOK's own days30/days90/year1 field names in playbook.js.
const TIMEFRAME_ORDER = ['days30', 'days90', 'year1'];

/**
 * Encodes a calculateResults() object into a compact, URL-safe Base64 string.
 *
 * Payload shape (before encoding):
 *   { s: finalScore, r: 'H'|'M'|'L', c: [6 category scores], e: aiExposurePenalty, a: bitmask }
 *
 * @param {object} results - return value of calculateResults()
 * @returns {string} URL-safe Base64 string, safe to use as a query-param value
 */
export function encodeShareState({ finalScore, riskKey, categories, aiExposurePenalty, automationRisks }) {
  const c = CAT_ORDER.map(k => categories[k]);

  // Encode triggered automation signals as a 5-bit bitmask (bit 0 = routine, etc.)
  const a = automationRisks.reduce((mask, risk) => {
    const idx = SIGNAL_KEYS.indexOf(risk.key);
    return idx >= 0 ? mask | (1 << idx) : mask;
  }, 0);

  const payload = JSON.stringify({ s: finalScore, r: riskKey[0], c, e: aiExposurePenalty, a });

  // Standard Base64 → URL-safe Base64 (RFC 4648 §5): replace + / and strip padding
  return btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Single-char risk key → full key used throughout the app
const RISK_CHAR = { H: 'HIGH', M: 'MEDIUM', L: 'LOW' };

/**
 * Decodes a share string produced by encodeShareState() back into the full
 * results object that Results.jsx expects (same shape as calculateResults()).
 *
 * Returns null if the string is missing, malformed, or fails validation —
 * callers must handle null gracefully.
 *
 * @param {string|null} encoded
 * @returns {object|null}
 */
export function decodeShareState(encoded) {
  if (!encoded) return null;
  try {
    // Reverse URL-safe substitutions and restore padding
    const b64    = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
    const p      = JSON.parse(atob(padded));

    // Validate required fields
    if (
      typeof p.s !== 'number' || p.s < 0 || p.s > 30 ||
      !RISK_CHAR[p.r] ||
      !Array.isArray(p.c) || p.c.length !== 6 || p.c.some(v => typeof v !== 'number') ||
      typeof p.e !== 'number' || p.e < 0 || p.e > 5 ||
      typeof p.a !== 'number' || p.a < 0 || p.a > 31
    ) return null;

    const riskKey    = RISK_CHAR[p.r];
    const categories = Object.fromEntries(CAT_ORDER.map((k, i) => [k, p.c[i]]));

    const rankedCategories = CAT_ORDER
      .map(key => ({ key, score: categories[key], ...CATEGORY_META[key] }))
      .sort((a, b) => b.score - a.score);

    // Reconstruct triggered automation signals from the bitmask
    const automationRisks = AUTOMATION_SIGNALS
      .filter((_, i) => p.a & (1 << i))
      .map(({ key, label, description }) => ({ key, label, description }));

    return {
      finalScore:       p.s,
      riskKey,
      riskLabel:        RISK_THRESHOLDS[riskKey].label,
      riskColor:        RISK_THRESHOLDS[riskKey].color,
      categories,
      rankedCategories,
      aiExposurePenalty: p.e,
      summary:          RISK_SUMMARIES[riskKey],
      automationRisks,
      topProtectors:    rankedCategories.filter(c => c.score >= 3).slice(0, 3),
    };
  } catch {
    return null;
  }
}

/**
 * Generates a plain-text summary of assessment results suitable for
 * copying into emails, messages, or social media posts.
 *
 * @param {object} results - return value of calculateResults() or decodeShareState()
 * @returns {string} multi-line plain text
 */
export function generateTextSummary({ finalScore, riskLabel, rankedCategories, aiExposurePenalty, automationRisks, topProtectors }) {
  const lines = [];

  lines.push(`AI Resistance Score: ${finalScore}/30 (${riskLabel})`);
  lines.push('');

  lines.push('Category Breakdown:');
  for (const cat of rankedCategories) {
    lines.push(`  ${cat.label}: ${cat.score}/5`);
  }
  lines.push(`  AI Exposure Penalty: −${aiExposurePenalty}`);

  if (topProtectors.length > 0) {
    lines.push('');
    lines.push('Strongest protections:');
    for (const cat of topProtectors) {
      lines.push(`  • ${cat.label} (${cat.score}/5)`);
    }
  }

  if (automationRisks.length > 0) {
    lines.push('');
    lines.push('Automation exposure:');
    for (const risk of automationRisks) {
      lines.push(`  • ${risk.label}`);
    }
  }

  lines.push('');
  lines.push('Find out yours → https://aijobwatch.org');

  return lines.join('\n');
}

/**
 * Encodes a calculateResults() object plus a timestamp into a compact,
 * URL-safe Base64 string — a "roadmap snapshot" for later progress-tracking
 * re-check-ins (Group P), as opposed to encodeShareState's one-time share
 * link. Deliberately a separate function rather than a change to
 * encodeShareState: keeps the existing share-link format (and every caller
 * that already depends on it) completely unchanged.
 *
 * Scope note: this captures score/result data only (finalScore, riskKey,
 * categories, aiExposurePenalty, automationRisks) plus when it was saved —
 * never personalization answers like hoursBudget or the union toggle, which
 * are transient UI preferences, not part of what a before/after comparison
 * needs to track.
 *
 * Payload shape (before encoding):
 *   { s: finalScore, r: 'H'|'M'|'L', c: [6 category scores], e: aiExposurePenalty, a: bitmask, t: savedAt, k: checklistBitmask }
 *
 * checklist (P5) is optional and defaults to nothing checked — Protection
 * Plan action items, keyed "categoryKey:timeframe" (e.g. "accountability:days30"),
 * packed as an 18-bit mask (6 categories x 3 timeframes) so old snapshot
 * links generated before P5 still decode correctly (missing k = all
 * unchecked, see decodeRoadmapSnapshot).
 *
 * @param {object} results - return value of calculateResults()
 * @param {number} [savedAt] - Unix ms timestamp; defaults to now
 * @param {object} [checklist] - { "categoryKey:timeframe": boolean }
 * @returns {string} URL-safe Base64 string, safe to use as a query-param value
 */
export function encodeRoadmapSnapshot({ finalScore, riskKey, categories, aiExposurePenalty, automationRisks }, savedAt = Date.now(), checklist = {}) {
  const c = CAT_ORDER.map(k => categories[k]);

  const a = automationRisks.reduce((mask, risk) => {
    const idx = SIGNAL_KEYS.indexOf(risk.key);
    return idx >= 0 ? mask | (1 << idx) : mask;
  }, 0);

  let k = 0;
  CAT_ORDER.forEach((catKey, ci) => {
    TIMEFRAME_ORDER.forEach((timeframe, ti) => {
      if (checklist[`${catKey}:${timeframe}`]) k |= (1 << (ci * TIMEFRAME_ORDER.length + ti));
    });
  });

  const payload = JSON.stringify({ s: finalScore, r: riskKey[0], c, e: aiExposurePenalty, a, t: savedAt, k });

  return btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Decodes a snapshot produced by encodeRoadmapSnapshot() back into the full
 * results object (same shape as decodeShareState), plus savedAt.
 *
 * Returns null if the string is missing, malformed, or fails validation —
 * callers must handle null gracefully.
 *
 * @param {string|null} encoded
 * @returns {object|null}
 */
export function decodeRoadmapSnapshot(encoded) {
  if (!encoded) return null;
  try {
    const b64    = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
    const p      = JSON.parse(atob(padded));

    // p.k (checklist bitmask) is intentionally NOT required: snapshot links
    // generated before P5 have no k field at all, and must keep decoding
    // successfully with checklist defaulting to nothing checked (see below).
    if (
      typeof p.s !== 'number' || p.s < 0 || p.s > 30 ||
      !RISK_CHAR[p.r] ||
      !Array.isArray(p.c) || p.c.length !== 6 || p.c.some(v => typeof v !== 'number') ||
      typeof p.e !== 'number' || p.e < 0 || p.e > 5 ||
      typeof p.a !== 'number' || p.a < 0 || p.a > 31 ||
      typeof p.t !== 'number' || p.t <= 0 ||
      (p.k !== undefined && (typeof p.k !== 'number' || p.k < 0 || p.k > 262143)) // 2^18 - 1
    ) return null;

    const riskKey    = RISK_CHAR[p.r];
    const categories = Object.fromEntries(CAT_ORDER.map((k, i) => [k, p.c[i]]));

    const rankedCategories = CAT_ORDER
      .map(key => ({ key, score: categories[key], ...CATEGORY_META[key] }))
      .sort((a, b) => b.score - a.score);

    const automationRisks = AUTOMATION_SIGNALS
      .filter((_, i) => p.a & (1 << i))
      .map(({ key, label, description }) => ({ key, label, description }));

    const k = typeof p.k === 'number' ? p.k : 0;
    const checklist = {};
    CAT_ORDER.forEach((catKey, ci) => {
      TIMEFRAME_ORDER.forEach((timeframe, ti) => {
        checklist[`${catKey}:${timeframe}`] = !!(k & (1 << (ci * TIMEFRAME_ORDER.length + ti)));
      });
    });

    return {
      finalScore:       p.s,
      riskKey,
      riskLabel:        RISK_THRESHOLDS[riskKey].label,
      riskColor:        RISK_THRESHOLDS[riskKey].color,
      categories,
      rankedCategories,
      aiExposurePenalty: p.e,
      summary:          RISK_SUMMARIES[riskKey],
      automationRisks,
      topProtectors:    rankedCategories.filter(c => c.score >= 3).slice(0, 3),
      savedAt:          p.t,
      checklist,
    };
  } catch {
    return null;
  }
}
