export interface RawResaleRecord {
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  resale_price: string;
}

export type LeaseBand =
  | 'More than 80 years'
  | '70 to 79 years'
  | '60 to 69 years'
  | 'Less than 60 years';

export type StoreyBand =
  | 'Low (1 to 6)'
  | 'Mid (7 to 15)'
  | 'High (16 and above)';

export interface ResaleTransaction extends RawResaleRecord {
  id: string;
  resale_price_num: number;
  floor_area_sqm_num: number;
  remaining_lease_years: number;
  lease_band: LeaseBand;
  storey_band: StoreyBand;
  transaction_year: string;
}

export interface FilterState {
  flat_type: string;
  town: string;
  flat_model: string;
  remaining_lease: string;
  storey_range: string;
  transaction_year: string;
}

export type SortOrder = 'newest' | 'price_asc' | 'price_desc';
