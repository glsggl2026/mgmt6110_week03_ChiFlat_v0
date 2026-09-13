import { RawResaleRecord, ResaleTransaction } from '../types.ts';
import { transformRecord } from '../utils/hdb.ts';

// Official HDB towns represented in data.gov.sg
export const HDB_TOWNS = [
  'ANG MO KIO',
  'BEDOK',
  'BISHAN',
  'BUKIT BATOK',
  'BUKIT MERAH',
  'BUKIT PANJANG',
  'BUKIT TIMAH',
  'CENTRAL AREA',
  'CHOA CHU KANG',
  'CLEMENTI',
  'GEYLANG',
  'HOUGANG',
  'JURONG EAST',
  'JURONG WEST',
  'KALLANG/WHAMPOA',
  'MARINE PARADE',
  'PASIR RIS',
  'PUNGGOL',
  'QUEENSTOWN',
  'SEMBAWANG',
  'SENGKANG',
  'SERANGOON',
  'TAMPINES',
  'TOA PAYOH',
  'WOODLANDS',
  'YISHUN',
];

export function getAvailableTowns(): string[] {
  return HDB_TOWNS;
}

export type FetchStatus = 'success' | 'refused' | 'unreachable';

export interface ResaleFetchResponse {
  status: FetchStatus;
  data: ResaleTransaction[];
  total?: number;
  count?: number;
  oldestMonth?: string;
  newestMonth?: string;
  errorReason?: string;
}

// Fetch resale transactions for a specific town from serverless api/resale
export async function fetchResaleTransactions(
  selectedTown: string
): Promise<ResaleFetchResponse> {
  const townParam = selectedTown && selectedTown.trim() ? selectedTown.trim() : 'ANG MO KIO';
  const url = `/api/resale?town=${encodeURIComponent(townParam)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 429) {
        return {
          status: 'refused',
          data: [],
          errorReason: 'data.gov.sg is limiting requests right now.',
        };
      }
      return {
        status: 'unreachable',
        data: [],
        errorReason: `Upstream error status: ${response.status}`,
      };
    }

    const payload = await response.json();
    const rawRecords: RawResaleRecord[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.records)
      ? payload.records
      : null;

    // A 200 reply with an empty records array is NOT an error.
    if (!rawRecords || !Array.isArray(rawRecords)) {
      return {
        status: 'unreachable',
        data: [],
        errorReason: 'Invalid data format received from API',
      };
    }

    // Convert resale_price and floor_area_sqm with Number() immediately upon reading
    const transactions: ResaleTransaction[] = rawRecords.map((raw, idx) =>
      transformRecord(raw, idx)
    );

    // Show transaction by month of sale descending way, meaning latest deals first
    transactions.sort((a, b) => b.month.localeCompare(a.month));

    return {
      status: 'success',
      data: transactions,
      total: typeof payload?.total === 'number' ? payload.total : undefined,
      count: typeof payload?.count === 'number' ? payload.count : transactions.length,
      oldestMonth: payload?.oldestMonth,
      newestMonth: payload?.newestMonth,
    };
  } catch (error) {
    console.warn('Network or unreachable error calling /api/resale:', error);
    return {
      status: 'unreachable',
      data: [],
      errorReason: "We can't reach data.gov.sg at the moment.",
    };
  }
}
