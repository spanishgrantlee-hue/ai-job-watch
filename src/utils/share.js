// Utilities for encoding and decoding shareable result URLs.
// encode → btoa(JSON) with URL-safe chars; decode → inverse.
// Both functions run in browser and Node 18+ (btoa/atob are globals in both).

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
