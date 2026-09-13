/**
 * Serverless function for fetching resale flat transactions per town
 * from data.gov.sg with 36-month trimming and metadata.
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
  // Limit 10000 to fetch the town's full history into the function
  const endpoint = `https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&filters=${filtersParam}&sort=_id desc&limit=10000`;

  try {
    const startUpstream = Date.now();
    const upstreamRes = await fetch(endpoint);
    const upstreamMs = Date.now() - startUpstream;

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
    const upstreamTotal =
      typeof data?.result?.total === 'number'
        ? data.result.total
        : rawRecords.length;

    // Step 2a: Convert resale_price and floor_area_sqm with Number()
    // Do NOT add a transaction_year field anywhere.
    const mappedRecords = rawRecords.map((r) => ({
      month: String(r.month ?? ''),
      town: String(r.town ?? ''),
      flat_type: String(r.flat_type ?? ''),
      block: String(r.block ?? ''),
      street_name: String(r.street_name ?? ''),
      storey_range: String(r.storey_range ?? ''),
      floor_area_sqm: Number(r.floor_area_sqm),
      flat_model: String(r.flat_model ?? ''),
      lease_commence_date: String(r.lease_commence_date ?? ''),
      remaining_lease: String(r.remaining_lease ?? ''),
      resale_price: Number(r.resale_price),
    }));

    // Step 2b: Sort records by the month field, newest first.
    // Do NOT rely on sort=_id desc for date order.
    mappedRecords.sort((a, b) => b.month.localeCompare(a.month));

    // Step 2c: Drop any record whose month is more than 36 months older
    // than the newest month present in the data received.
    let trimmedRecords = [];
    let newestMonth = '';
    let oldestMonth = '';

    if (mappedRecords.length > 0) {
      newestMonth = mappedRecords[0].month;
      const [newestYear, newestMo] = newestMonth.split('-').map(Number);

      trimmedRecords = mappedRecords.filter((record) => {
        if (!record.month || typeof record.month !== 'string') return false;
        const parts = record.month.split('-');
        if (parts.length < 2) return false;
        const rYear = Number(parts[0]);
        const rMo = Number(parts[1]);
        if (isNaN(rYear) || isNaN(rMo)) return false;

        const diffMonths = (newestYear - rYear) * 12 + (newestMo - rMo);
        // 36 months window: diffMonths from 0 to 35
        return diffMonths >= 0 && diffMonths < 36;
      });

      if (trimmedRecords.length > 0) {
        oldestMonth = trimmedRecords[trimmedRecords.length - 1].month;
      }
    }

    // Step 3: Alongside the records, return:
    // - count: how many records you are returning after trimming
    // - oldestMonth and newestMonth: the span of the records you are returning
    // - total: the value of result.total from the upstream response
    // - upstreamMs: how long the data.gov.sg call took
    const responsePayload = {
      count: trimmedRecords.length,
      oldestMonth: oldestMonth || '',
      newestMonth: newestMonth || '',
      total: upstreamTotal,
      upstreamMs,
      records: trimmedRecords,
    };

    // Cache the response with Cache-Control: s-maxage=21600, stale-while-revalidate=43200
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Cache-Control',
      's-maxage=21600, stale-while-revalidate=43200'
    );
    res.statusCode = 200;

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(200).json(responsePayload);
    }
    return res.end(JSON.stringify(responsePayload));
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
