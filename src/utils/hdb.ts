import {
  RawResaleRecord,
  ResaleTransaction,
  LeaseBand,
  StoreyBand,
  PeriodOption,
} from '../types.ts';

export const LEASE_BANDS: LeaseBand[] = [
  'More than 80 years',
  '70 to 79 years',
  '60 to 69 years',
  'Less than 60 years',
];

export const STOREY_BANDS: StoreyBand[] = [
  'Low (1 to 6)',
  'Mid (7 to 15)',
  'High (16 and above)',
];

export const PERIOD_OPTIONS: PeriodOption[] = [
  'Last 12 months',
  'Last 24 months',
  'Last 36 months',
];

export function parseRemainingLeaseYears(leaseStr: string): number {
  if (!leaseStr) return 0;
  const match = leaseStr.match(/(\d+)\s*years?/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  const num = parseFloat(leaseStr);
  return isNaN(num) ? 0 : Math.floor(num);
}

export function getLeaseBand(years: number): LeaseBand {
  if (years > 80) return 'More than 80 years';
  if (years >= 70) return '70 to 79 years';
  if (years >= 60) return '60 to 69 years';
  return 'Less than 60 years';
}

export function getStoreyBand(storeyRange: string): StoreyBand {
  if (!storeyRange) return 'Low (1 to 6)';
  const match = storeyRange.match(/(\d+)\s*TO\s*(\d+)/i);
  if (match) {
    const min = parseInt(match[1], 10);
    const max = parseInt(match[2], 10);
    if (max <= 6) return 'Low (1 to 6)';
    if (min >= 16) return 'High (16 and above)';
    return 'Mid (7 to 15)';
  }
  const num = parseInt(storeyRange, 10);
  if (isNaN(num)) return 'Low (1 to 6)';
  if (num <= 6) return 'Low (1 to 6)';
  if (num >= 16) return 'High (16 and above)';
  return 'Mid (7 to 15)';
}

export function transformRecord(
  raw: RawResaleRecord,
  index: number
): ResaleTransaction {
  // IMPORTANT: resale_price and floor_area_sqm arrive as strings, so convert them with Number()
  // the moment they are read.
  const priceNum = Number(raw.resale_price);
  const areaNum = Number(raw.floor_area_sqm);
  const leaseYears = parseRemainingLeaseYears(raw.remaining_lease);

  return {
    ...raw,
    id: `${raw.town}-${raw.block}-${raw.street_name}-${raw.month}-${index}`,
    resale_price_num: isNaN(priceNum) ? 0 : priceNum,
    floor_area_sqm_num: isNaN(areaNum) ? 0 : areaNum,
    remaining_lease_years: leaseYears,
    lease_band: getLeaseBand(leaseYears),
    storey_band: getStoreyBand(raw.storey_range),
  };
}

export function isWithinPeriod(
  txMonth: string,
  newestMonth: string,
  period: PeriodOption
): boolean {
  if (!txMonth || !newestMonth) return true;
  const [newYear, newMo] = newestMonth.split('-').map((v) => parseInt(v, 10));
  const [txYear, txMo] = txMonth.split('-').map((v) => parseInt(v, 10));
  if (isNaN(newYear) || isNaN(newMo) || isNaN(txYear) || isNaN(txMo)) return true;

  const diffMonths = (newYear - txYear) * 12 + (newMo - txMo);
  const maxMonths =
    period === 'Last 12 months' ? 12 : period === 'Last 24 months' ? 24 : 36;

  return diffMonths >= 0 && diffMonths < maxMonths;
}

export function formatPrice(price: number): string {
  return `S$${price.toLocaleString('en-SG')}`;
}

export function formatCompactPrice(price: number): string {
  if (price >= 1_000_000) {
    const m = (price / 1_000_000).toFixed(2);
    return `S$${m}m`;
  }
  const k = Math.round(price / 1_000);
  return `S$${k}k`;
}

export function formatMonth(monthStr: string): string {
  if (!monthStr) return '';
  const parts = monthStr.split('-');
  if (parts.length === 2) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${months[monthIndex]} ${year}`;
    }
  }
  return monthStr;
}

export function getPercentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  if (sortedValues.length === 1) return sortedValues[0];
  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  if (lower === upper) return sortedValues[lower];
  return Math.round(sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight);
}
