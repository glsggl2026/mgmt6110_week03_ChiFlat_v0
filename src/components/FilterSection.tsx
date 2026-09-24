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
      className="bg-white rounded-xl p-3 sm:p-4 border border-stone-200 shadow-2xs mb-5"
    >
      {/* 6 Filters squeezed into 1 single row on desktop (lg:grid-cols-6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
        {/* 1. Town */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-town"
            className="text-[11px] font-bold text-stone-600 uppercase tracking-wider truncate"
            title="Town"
          >
            Town
          </label>
          <select
            id="filter-town"
            value={filters.town}
            onChange={(e) => handleChange('town', e.target.value)}
            className="w-full h-[38px] px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 transition-colors cursor-pointer"
          >
            {availableTowns.map((town) => (
              <option key={town} value={town}>
                {town}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Period */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-period"
            className="text-[11px] font-bold text-stone-600 uppercase tracking-wider truncate"
            title="Period"
          >
            Period
          </label>
          <select
            id="filter-period"
            value={filters.period}
            onChange={(e) => handleChange('period', e.target.value as PeriodOption)}
            className="w-full h-[38px] px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 transition-colors cursor-pointer"
          >
            {PERIOD_OPTIONS.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Flat Type */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-flat-type"
            className="text-[11px] font-bold text-stone-600 uppercase tracking-wider truncate"
            title="Flat Type"
          >
            Flat Type
          </label>
          <select
            id="filter-flat-type"
            value={filters.flat_type}
            onChange={(e) => handleChange('flat_type', e.target.value)}
            className="w-full h-[38px] px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 transition-colors cursor-pointer"
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
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-flat-model"
            className="text-[11px] font-bold text-stone-600 uppercase tracking-wider truncate"
            title="Flat Model"
          >
            Flat Model
          </label>
          <select
            id="filter-flat-model"
            value={filters.flat_model}
            onChange={(e) => handleChange('flat_model', e.target.value)}
            className="w-full h-[38px] px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 transition-colors cursor-pointer"
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
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-remaining-lease"
            className="text-[11px] font-bold text-stone-600 uppercase tracking-wider truncate"
            title="Remaining Lease"
          >
            Lease
          </label>
          <select
            id="filter-remaining-lease"
            value={filters.remaining_lease}
            onChange={(e) => handleChange('remaining_lease', e.target.value)}
            className="w-full h-[38px] px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 transition-colors cursor-pointer"
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
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-storey"
            className="text-[11px] font-bold text-stone-600 uppercase tracking-wider truncate"
            title="Storey Band"
          >
            Storey
          </label>
          <select
            id="filter-storey"
            value={filters.storey_range}
            onChange={(e) => handleChange('storey_range', e.target.value)}
            className="w-full h-[38px] px-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-800 transition-colors cursor-pointer"
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
