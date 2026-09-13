import React from 'react';
import { FilterState, ResaleTransaction, SortOrder } from '../types.ts';
import {
  formatCompactPrice,
  formatMonth,
  formatPrice,
  getPercentile,
} from '../utils/hdb.ts';
import { ArrowUpDown } from 'lucide-react';

interface ResultsSummaryProps {
  matchingTransactions: ResaleTransaction[];
  allTownTransactions?: ResaleTransaction[];
  totalTownTransactions: number;
  filters: FilterState;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  refreshDurationMs: number | null;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  matchingTransactions,
  allTownTransactions,
  totalTownTransactions,
  filters,
  sortOrder,
  onSortChange,
  refreshDurationMs,
}) => {
  const n = matchingTransactions.length;

  let medianText = '—';
  let averageText = '—';
  let rangeText = '—';
  let p25Text = '—';
  let p75Text = '—';
  let spreadText = '—';
  let p25Exact = '';
  let p75Exact = '';
  let spreadExact = '';
  let dateRangeStr = '';

  if (n > 0) {
    const prices = matchingTransactions
      .map((t) => t.resale_price_num)
      .sort((a, b) => a - b);

    // Median calculation
    const mid = Math.floor(prices.length / 2);
    const median =
      prices.length % 2 !== 0
        ? prices[mid]
        : Math.round((prices[mid - 1] + prices[mid]) / 2);
    medianText = formatPrice(median);

    // Average calculation
    const sum = prices.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / prices.length);
    averageText = formatPrice(average);

    // Range calculation
    const minP = prices[0];
    const maxP = prices[prices.length - 1];
    rangeText = `${formatCompactPrice(minP)} – ${formatCompactPrice(maxP)}`;

    // Boxplot elements: 25% percentile (Q1), 75% percentile (Q3), and Spread (IQR)
    const p25 = getPercentile(prices, 0.25);
    const p75 = getPercentile(prices, 0.75);
    const spread = Math.max(0, p75 - p25);

    p25Text = formatCompactPrice(p25);
    p75Text = formatCompactPrice(p75);
    spreadText = formatCompactPrice(spread);

    p25Exact = formatPrice(p25);
    p75Exact = formatPrice(p75);
    spreadExact = formatPrice(spread);

    // Date range of currently matching records
    let minMonth = matchingTransactions[0].month;
    let maxMonth = matchingTransactions[0].month;
    for (const tx of matchingTransactions) {
      if (tx.month && tx.month < minMonth) minMonth = tx.month;
      if (tx.month && tx.month > maxMonth) maxMonth = tx.month;
    }
    dateRangeStr =
      minMonth === maxMonth
        ? formatMonth(minMonth)
        : `${formatMonth(minMonth)} – ${formatMonth(maxMonth)}`;
  }

  // Earliest month across all town transactions in dataset
  let earliestTownDateStr = '';
  if (allTownTransactions && allTownTransactions.length > 0) {
    let earliestMonth = allTownTransactions[0].month;
    for (const tx of allTownTransactions) {
      if (tx.month && tx.month < earliestMonth) {
        earliestMonth = tx.month;
      }
    }
    earliestTownDateStr = formatMonth(earliestMonth);
  }

  return (
    <div id="results-summary-container" className="mb-6">
      {/* Main summary card */}
      <div className="bg-stone-800 border border-stone-700 rounded-2xl p-4 sm:p-5 shadow-sm text-white">
        {/* Strip Row & Refresh Duration */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2.5 pb-3 border-b border-stone-700">
          {/* Summary Strip: one font size bigger than address with bold numbers and white font */}
          <div
            id="summary-strip"
            className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-lg sm:text-xl text-stone-200 font-medium tracking-tight"
          >
            <span>
              Median <span className="font-bold text-white">{medianText}</span>
            </span>
            <span className="text-stone-400 font-normal">·</span>
            <span>
              Average <span className="font-bold text-white">{averageText}</span>
            </span>
            <span className="text-stone-400 font-normal">·</span>
            <span>
              n ={' '}
              <span
                id="summary-strip-n"
                className={
                  n >= 10
                    ? 'text-emerald-400 font-extrabold'
                    : 'text-rose-400 font-extrabold'
                }
              >
                {n}
              </span>
            </span>
            <span className="text-stone-400 font-normal">·</span>
            <span>
              Range <span className="font-bold text-white">{rangeText}</span>
            </span>
            <span className="text-stone-400 font-normal">·</span>
            <span>
              25% <span className="font-bold text-white" title={p25Exact ? `25th percentile: ${p25Exact}` : undefined}>{p25Text}</span>
            </span>
            <span className="text-stone-400 font-normal">·</span>
            <span>
              75% <span className="font-bold text-white" title={p75Exact ? `75th percentile: ${p75Exact}` : undefined}>{p75Text}</span>
            </span>
            <span className="text-stone-400 font-normal">·</span>
            <span>
              Spread <span className="font-bold text-white" title={spreadExact ? `IQR (Spread): ${spreadExact}` : undefined}>{spreadText}</span>
            </span>
          </div>

          {/* Refresh duration */}
          {refreshDurationMs !== null && (
            <div
              id="refresh-duration-badge"
              className="text-xs font-mono text-stone-400 shrink-0 self-start sm:self-auto"
            >
              refreshed in {refreshDurationMs} ms
            </div>
          )}
        </div>

        {/* Coverage Line under the strip */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3">
          <p
            id="coverage-line"
            className="text-sm text-stone-200 font-medium"
          >
            Showing{' '}
            <strong className="font-bold text-white">
              {n.toLocaleString()}
            </strong>{' '}
            {n === 1 ? 'transaction' : 'transactions'} in {filters.town}
            {dateRangeStr ? `, ${dateRangeStr}` : ''}.
            {totalTownTransactions > 0 && earliestTownDateStr && (
              <> {totalTownTransactions.toLocaleString()} exist since {earliestTownDateStr}.</>
            )}
          </p>

          {/* Sort control */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <label
              htmlFor="sort-select"
              className="text-xs font-semibold text-stone-200 flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <span>Sort:</span>
            </label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="min-h-[38px] px-3 py-1.5 bg-stone-700 border border-stone-600 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-stone-400 shadow-2xs cursor-pointer"
            >
              <option value="newest" className="bg-stone-800 text-white">Newest first</option>
              <option value="price_asc" className="bg-stone-800 text-white">Price, low to high</option>
              <option value="price_desc" className="bg-stone-800 text-white">Price, high to low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
