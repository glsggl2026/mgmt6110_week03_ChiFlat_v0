/**
 * Serverless function for health check.
 * Reports keyConfigured (false), credentialRequired (false), upstreamAnswered,
 * upstreamStatus, durationMs, and recordCount.
 * Never exposes credentials.
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  let upstreamAnswered = false;
  let upstreamStatus = null;
  let recordCount = 0;

  try {
    const testUrl = `https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=1`;
    const upstreamRes = await fetch(testUrl);
    upstreamAnswered = true;
    upstreamStatus = upstreamRes.status;

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      recordCount = data?.result?.records?.length || 0;
    }
  } catch (_) {
    upstreamAnswered = false;
    upstreamStatus = null;
  }

  const durationMs = Date.now() - startTime;

  const payload = {
    keyConfigured: false,
    credentialRequired: false,
    upstreamAnswered,
    upstreamStatus,
    durationMs,
    recordCount,
  };

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = upstreamAnswered && upstreamStatus === 200 ? 200 : 503;

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(res.statusCode).json(payload);
  }
  return res.end(JSON.stringify(payload));
}
