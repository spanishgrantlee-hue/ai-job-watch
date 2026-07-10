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
