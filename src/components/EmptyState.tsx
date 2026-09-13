import React from 'react';
import { FilterState } from '../types.ts';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  filters: FilterState;
  onClearAll: () => void;
  onClearFilter: (key: keyof FilterState) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  filters,
  onClearAll,
  onClearFilter,
}) => {
  return (
    <div
      id="empty-results-state"
      className="bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 p-6 sm:p-10 text-center flex flex-col items-center justify-center my-6"
    >
      <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-700 flex items-center justify-center mb-3">
        <SearchX className="w-6 h-6" />
      </div>

      <h3
        id="empty-state-message"
        className="text-base sm:text-lg font-bold text-stone-900 max-w-md mb-2 leading-snug"
      >
        No flats matched those filters. Try clearing the lease or storey filter.
      </h3>

      {/* Suggested Quick Clears for active filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 my-4">
        {filters.remaining_lease !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('remaining_lease')}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-2xs"
          >
            Clear Lease Filter ({filters.remaining_lease})
          </button>
        )}
        {filters.storey_range !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('storey_range')}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-2xs"
          >
            Clear Storey Filter ({filters.storey_range})
          </button>
        )}
        {filters.period !== 'Last 12 months' && (
          <button
            type="button"
            onClick={() => onClearFilter('period')}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-2xs"
          >
            Reset Period (Last 12 months)
          </button>
        )}
        {filters.flat_type !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('flat_type')}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-2xs"
          >
            Clear Flat Type ({filters.flat_type})
          </button>
        )}
        {filters.flat_model !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('flat_model')}
            className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-100 transition-colors shadow-2xs"
          >
            Clear Model ({filters.flat_model})
          </button>
        )}
      </div>

      {/* Prominent Clear All Filters button */}
      <button
        id="clear-all-filters-btn"
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-sm font-semibold transition-all shadow-xs"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Clear all filters</span>
      </button>
    </div>
  );
};
