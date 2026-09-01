import { getStore } from '@netlify/blobs';

const VALID_Q = /^Q([1-9]|[12]\d|3[01])$/;

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response('Bad Request', { status: 400 });
  }

  const { answers, finalScore, riskKey, shareUrl } = body;

  if (
    answers === null ||
    typeof answers !== 'object' ||
    typeof finalScore !== 'number' ||
    !['LOW', 'MEDIUM', 'HIGH'].includes(riskKey)
  ) {
    console.warn('[save-result] rejected invalid payload', { timestamp: new Date().toISOString() });
    return new Response('Invalid payload', { status: 400 });
  }

  // Only keep known question keys — strip anything unexpected
  const sanitized = Object.fromEntries(
    Object.entries(answers).filter(([k]) => VALID_Q.test(k))
  );

  const safeShareUrl = typeof shareUrl === 'string' && shareUrl.length < 1000 ? shareUrl : null;

  const id = crypto.randomUUID();

  try {
    const store = getStore('assessment-results');
    await store.setJSON(id, {
      id,
      timestamp: new Date().toISOString(),
      answers: sanitized,
      finalScore,
      riskKey,
      shareUrl: safeShareUrl,
    });
  } catch (err) {
    console.error('[save-result] blob write failed', { id, riskKey, timestamp: new Date().toISOString(), error: err?.message });
    return new Response('Internal Server Error', { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = { path: '/api/save-result' };
