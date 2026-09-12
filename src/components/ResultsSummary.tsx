import React from 'react';
import { FilterState, SortOrder } from '../types.ts';
import { ArrowUpDown } from 'lucide-react';

interface ResultsSummaryProps {
  count: number;
  filters: FilterState;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  count,
  filters,
  sortOrder,
  onSortChange,
}) => {
  // Construct plain English summary string as requested
  // e.g. "18 transactions — 4 ROOM in TAMPINES"
  const parts: string[] = [];

  if (filters.flat_type !== 'Any') {
    parts.push(filters.flat_type);
  }

  if (filters.flat_model !== 'Any') {
    parts.push(filters.flat_model);
  }

  const flatSpecs = parts.join(' ');

  let locationText = `in ${filters.town}`;
  if (filters.transaction_year !== 'Any') {
    locationText += ` (${filters.transaction_year})`;
  }

  let fullDescriptor = '';
  if (flatSpecs) {
    fullDescriptor = `${flatSpecs} ${locationText}`;
  } else {
    fullDescriptor = locationText;
  }

  if (filters.remaining_lease !== 'Any') {
    fullDescriptor += ` · ${filters.remaining_lease} lease`;
  }
  if (filters.storey_range !== 'Any') {
    fullDescriptor += ` · ${filters.storey_range} storey`;
  }

  const transactionLabel = count === 1 ? 'transaction' : 'transactions';
  const summaryLine = `${count} ${transactionLabel} — ${fullDescriptor}`;

  return (
    <div
      id="results-summary-bar"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 px-1"
    >
      <div className="flex-1">
        <p
          id="summary-plain-english"
          className="text-base sm:text-lg font-semibold text-stone-900 tracking-tight"
        >
          {summaryLine}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <label
          htmlFor="sort-select"
          className="text-xs font-semibold text-stone-700 flex items-center gap-1"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-600" />
          <span>Sort:</span>
        </label>
        <select
          id="sort-select"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="min-h-[40px] px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900 shadow-2xs"
        >
          <option value="newest">Newest first</option>
          <option value="price_asc">Price, low to high</option>
          <option value="price_desc">Price, high to low</option>
        </select>
      </div>
    </div>
  );
};
