/**
 * Serverless function for fetching latest 500 resale flat transactions per town
 * from data.gov.sg.
 */

export default async function handler(req, res) {
  // Read the optional `town` query parameter from the request URL
  let town = req.query?.town;
  if (!town && req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      town = url.searchParams.get('town');
    } catch (_) {}
  }

  // If `town` is omitted or empty, default to "ANG MO KIO"
  const selectedTown =
    town && typeof town === 'string' && town.trim()
      ? town.trim().toUpperCase()
      : 'ANG MO KIO';

  // Build the filters string using encodeURIComponent(JSON.stringify({ town: selectedTown }))
  const filtersParam = encodeURIComponent(JSON.stringify({ town: selectedTown }));
  const endpoint = `https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&filters=${filtersParam}&sort=_id desc&limit=500`;

  try {
    const upstreamRes = await fetch(endpoint);

    // AFTER the fetch, check response.ok before reading the body.
    // On a non-2xx reply, return upstream status and error reason.
    if (!upstreamRes.ok) {
      const reason =
        upstreamRes.status === 429
          ? 'data.gov.sg is limiting requests right now'
          : `data.gov.sg returned HTTP ${upstreamRes.status}`;

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = upstreamRes.status;
      const errorPayload = {
        error: true,
        refused: upstreamRes.status === 429,
        upstreamStatus: upstreamRes.status,
        reason,
      };

      if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(upstreamRes.status).json(errorPayload);
      }
      return res.end(JSON.stringify(errorPayload));
    }

    const data = await upstreamRes.json();
    const rawRecords = data?.result?.records || [];

    // Return only the fields needed by the screen:
    // month, town, flat_type, block, street_name, storey_range, floor_area_sqm,
    // flat_model, lease_commence_date, remaining_lease, and resale_price.
    const records = rawRecords.map((r) => ({
      month: String(r.month ?? ''),
      town: String(r.town ?? ''),
      flat_type: String(r.flat_type ?? ''),
      block: String(r.block ?? ''),
      street_name: String(r.street_name ?? ''),
      storey_range: String(r.storey_range ?? ''),
      floor_area_sqm: String(r.floor_area_sqm ?? ''),
      flat_model: String(r.flat_model ?? ''),
      lease_commence_date: String(r.lease_commence_date ?? ''),
      remaining_lease: String(r.remaining_lease ?? ''),
      resale_price: String(r.resale_price ?? ''),
    }));

    // Cache the response with Cache-Control: s-maxage=21600, stale-while-revalidate=43200
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Cache-Control',
      's-maxage=21600, stale-while-revalidate=43200'
    );
    res.statusCode = 200;

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(records);
    }
    return res.end(JSON.stringify(records));
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 503;
    const errorPayload = {
      error: true,
      unreachable: true,
      upstreamStatus: 503,
      reason: "We can't reach data.gov.sg at the moment.",
    };

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(503).json(errorPayload);
    }
    return res.end(JSON.stringify(errorPayload));
  }
}
