import {
  RawResaleRecord,
  ResaleTransaction,
  LeaseBand,
  StoreyBand,
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
  // IMPORTANT: resale_price and floor_area_sqm arrive as TEXT, not numbers, so convert them with Number()
  // the moment they are read.
  const priceNum = Number(raw.resale_price);
  const areaNum = Number(raw.floor_area_sqm);
  const leaseYears = parseRemainingLeaseYears(raw.remaining_lease);
  const year = raw.month.split('-')[0] || '';

  return {
    ...raw,
    id: `${raw.town}-${raw.block}-${raw.street_name}-${raw.month}-${index}`,
    resale_price_num: isNaN(priceNum) ? 0 : priceNum,
    floor_area_sqm_num: isNaN(areaNum) ? 0 : areaNum,
    remaining_lease_years: leaseYears,
    lease_band: getLeaseBand(leaseYears),
    storey_band: getStoreyBand(raw.storey_range),
    transaction_year: year,
  };
}

export function formatPrice(price: number): string {
  return `S$${price.toLocaleString('en-SG')}`;
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

export function getLeaseNote(band: LeaseBand): string {
  switch (band) {
    case 'Less than 60 years':
      return "CPF use may be reduced depending on the youngest buyer's age, and loan tenure may be shorter. Buyers should check their remaining CPF housing withdrawal limits before making an offer.";
    case '60 to 69 years':
      return "Flats in this lease band generally allow full CPF financing if the remaining lease covers the youngest buyer until age 95. Standard loan tenures are typically accessible while maintaining balanced resale value.";
    case '70 to 79 years':
      return "Flats with 70 to 79 years of lease offer extensive CPF financing flexibility and full mortgage loan tenures. The lease duration remains comfortably high for both younger and mature home buyers.";
    case 'More than 80 years':
      return "Flats with more than 80 years of remaining lease qualify for maximum CPF withdrawal and the full allowable loan tenure. These younger flats offer long-term asset security with zero financing constraints.";
  }
}
