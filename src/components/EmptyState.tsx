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
  const activeFilterLabels: string[] = [];
  if (filters.flat_type !== 'Any') activeFilterLabels.push(filters.flat_type);
  if (filters.flat_model !== 'Any') activeFilterLabels.push(filters.flat_model);
  if (filters.remaining_lease !== 'Any') activeFilterLabels.push(filters.remaining_lease);
  if (filters.storey_range !== 'Any') activeFilterLabels.push(filters.storey_range);

  const filterValuesText =
    activeFilterLabels.length > 0 ? `${activeFilterLabels.join(', ')} ` : '';

  const emptyMessage = `No ${filterValuesText}transactions found in ${filters.town} for the selected period.`;

  return (
    <div
      id="empty-results-state"
      className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 text-center flex flex-col items-center justify-center my-6 shadow-xs"
    >
      <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center mb-3">
        <SearchX className="w-6 h-6" />
      </div>

      <h3
        id="empty-state-message"
        className="text-base sm:text-lg font-bold text-stone-900 max-w-xl mb-4 leading-snug"
      >
        {emptyMessage}
      </h3>

      {/* Suggested Quick Clears for active filters */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 my-3">
        {filters.flat_type !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('flat_type')}
            className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            Show all flat types
          </button>
        )}
        {filters.flat_model !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('flat_model')}
            className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            Show all flat models
          </button>
        )}
        {filters.remaining_lease !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('remaining_lease')}
            className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            Show all leases
          </button>
        )}
        {filters.storey_range !== 'Any' && (
          <button
            type="button"
            onClick={() => onClearFilter('storey_range')}
            className="px-4 py-2 rounded-xl bg-[#064e3b] hover:bg-[#053d2e] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
          >
            Show all storeys
          </button>
        )}
      </div>

      {/* Prominent Clear All Filters button */}
      <button
        id="clear-all-filters-btn"
        type="button"
        onClick={onClearAll}
        className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Clear all filters</span>
      </button>
    </div>
  );
};
