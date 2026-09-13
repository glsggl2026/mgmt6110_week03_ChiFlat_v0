import React from 'react';
import { FilterState, PeriodOption } from '../types.ts';
import { LEASE_BANDS, STOREY_BANDS, PERIOD_OPTIONS } from '../utils/hdb.ts';

interface FilterSectionProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableTowns: string[];
  availableFlatTypes: string[];
  availableFlatModels: string[];
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  filters,
  onFilterChange,
  availableTowns,
  availableFlatTypes,
  availableFlatModels,
}) => {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div
      id="filter-container"
      className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs mb-6"
    >
      <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-stone-100">
        <h2 className="text-sm font-semibold tracking-wide text-stone-900 uppercase">
          Search Filters
        </h2>
        <span className="text-xs text-stone-600">
          Instant updates
        </span>
      </div>

      {/* Grid: stacked on phone (1 col), 2 cols on laptop (md:grid-cols-2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* 1. Town */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-town"
            className="text-xs font-semibold text-stone-700"
          >
            Town
          </label>
          <select
            id="filter-town"
            value={filters.town}
            onChange={(e) => handleChange('town', e.target.value)}
            className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
          >
            {availableTowns.map((town) => (
              <option key={town} value={town}>
                {town}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Period Filter */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-period"
            className="text-xs font-semibold text-stone-700"
          >
            Period
          </label>
          <select
            id="filter-period"
            value={filters.period}
            onChange={(e) => handleChange('period', e.target.value as PeriodOption)}
            className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
          >
            {PERIOD_OPTIONS.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Flat Type */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-flat-type"
            className="text-xs font-semibold text-stone-700"
          >
            Flat Type
          </label>
          <select
            id="filter-flat-type"
            value={filters.flat_type}
            onChange={(e) => handleChange('flat_type', e.target.value)}
            className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
          >
            <option value="Any">Any</option>
            {availableFlatTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Flat Model */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-flat-model"
            className="text-xs font-semibold text-stone-700"
          >
            Flat Model
          </label>
          <select
            id="filter-flat-model"
            value={filters.flat_model}
            onChange={(e) => handleChange('flat_model', e.target.value)}
            className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
          >
            <option value="Any">Any</option>
            {availableFlatModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Remaining Lease */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-remaining-lease"
            className="text-xs font-semibold text-stone-700"
          >
            Remaining Lease
          </label>
          <select
            id="filter-remaining-lease"
            value={filters.remaining_lease}
            onChange={(e) => handleChange('remaining_lease', e.target.value)}
            className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
          >
            <option value="Any">Any</option>
            {LEASE_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Storey Band */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="filter-storey"
            className="text-xs font-semibold text-stone-700"
          >
            Storey
          </label>
          <select
            id="filter-storey"
            value={filters.storey_range}
            onChange={(e) => handleChange('storey_range', e.target.value)}
            className="w-full min-h-[44px] px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
          >
            <option value="Any">Any</option>
            {STOREY_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
