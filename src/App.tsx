import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterState, ResaleTransaction, SortOrder } from './types.ts';
import { fetchResaleTransactions, getAvailableTowns, FetchStatus } from './services/api.ts';
import { isWithinPeriod } from './utils/hdb.ts';
import { Header } from './components/Header.tsx';
import { FilterSection } from './components/FilterSection.tsx';
import { ResultsSummary } from './components/ResultsSummary.tsx';
import { TransactionCard } from './components/TransactionCard.tsx';
import { EmptyState } from './components/EmptyState.tsx';
import { ErrorNotice } from './components/ErrorNotice.tsx';
import { DetailScreen } from './components/DetailScreen.tsx';
import { Loader2 } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  town: 'ANG MO KIO',
  period: 'Last 12 months',
  flat_type: 'Any',
  flat_model: 'Any',
  remaining_lease: 'Any',
  storey_range: 'Any',
};

export default function App() {
  // Screen routing: 'search' (Screen 1) or 'detail' (Screen 2)
  const [currentScreen, setCurrentScreen] = useState<'search' | 'detail'>('search');
  const [selectedTransaction, setSelectedTransaction] = useState<ResaleTransaction | null>(null);

  // Filters state - preserved when navigating between Screen 1 and Screen 2
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // Loaded transactions for the currently selected town
  const [townTransactions, setTownTransactions] = useState<ResaleTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('success');
  const [refreshDurationMs, setRefreshDurationMs] = useState<number | null>(null);

  // All towns from dataset
  const availableTowns = useMemo(() => getAvailableTowns(), []);

  // Fetch data when town changes or on app load:
  // call: /api/resale?town=${encodeURIComponent(selectedTown)}
  // Measure refresh duration with performance.now() around the fetch
  const loadTownData = useCallback(async (townToFetch: string) => {
    setIsLoading(true);
    const startTime = performance.now();
    try {
      const res = await fetchResaleTransactions(townToFetch);
      const endTime = performance.now();
      setRefreshDurationMs(Math.round(endTime - startTime));

      setFetchStatus(res.status);
      if (res.status === 'success') {
        setTownTransactions(res.data);
      } else {
        setTownTransactions([]);
      }
    } catch (error) {
      const endTime = performance.now();
      setRefreshDurationMs(Math.round(endTime - startTime));
      console.error('Failed to load town data:', error);
      setFetchStatus('unreachable');
      setTownTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTownData(filters.town);
  }, [filters.town, loadTownData]);

  // Find the newest month among loaded transactions to filter relative to newest month in data
  const newestMonth = useMemo(() => {
    if (!townTransactions || townTransactions.length === 0) return '';
    let max = townTransactions[0].month;
    for (const tx of townTransactions) {
      if (tx.month > max) max = tx.month;
    }
    return max;
  }, [townTransactions]);

  // Dynamic filter options for Flat Type and Flat Model
  const availableFlatTypes = useMemo(() => {
    const types = new Set<string>();
    townTransactions.forEach((tx) => {
      let match = true;
      if (!isWithinPeriod(tx.month, newestMonth, filters.period)) {
        match = false;
      }
      if (filters.remaining_lease !== 'Any' && tx.lease_band !== filters.remaining_lease) {
        match = false;
      }
      if (filters.storey_range !== 'Any' && tx.storey_band !== filters.storey_range) {
        match = false;
      }
      if (match) {
        types.add(tx.flat_type);
      }
    });

    if (types.size === 0) {
      townTransactions.forEach((tx) => types.add(tx.flat_type));
    }

    return Array.from(types).sort();
  }, [
    townTransactions,
    newestMonth,
    filters.period,
    filters.remaining_lease,
    filters.storey_range,
  ]);

  const availableFlatModels = useMemo(() => {
    const models = new Set<string>();
    townTransactions.forEach((tx) => {
      let match = true;
      if (!isWithinPeriod(tx.month, newestMonth, filters.period)) {
        match = false;
      }
      if (filters.flat_type !== 'Any' && tx.flat_type !== filters.flat_type) {
        match = false;
      }
      if (filters.remaining_lease !== 'Any' && tx.lease_band !== filters.remaining_lease) {
        match = false;
      }
      if (filters.storey_range !== 'Any' && tx.storey_band !== filters.storey_range) {
        match = false;
      }
      if (match) {
        models.add(tx.flat_model);
      }
    });

    if (models.size === 0) {
      townTransactions.forEach((tx) => models.add(tx.flat_model));
    }

    return Array.from(models).sort();
  }, [
    townTransactions,
    newestMonth,
    filters.period,
    filters.flat_type,
    filters.remaining_lease,
    filters.storey_range,
  ]);

  // Filter the transactions immediately as any filter changes
  const filteredTransactions = useMemo(() => {
    return townTransactions.filter((tx) => {
      if (!isWithinPeriod(tx.month, newestMonth, filters.period)) {
        return false;
      }
      if (filters.flat_type !== 'Any' && tx.flat_type !== filters.flat_type) {
        return false;
      }
      if (filters.flat_model !== 'Any' && tx.flat_model !== filters.flat_model) {
        return false;
      }
      if (filters.remaining_lease !== 'Any' && tx.lease_band !== filters.remaining_lease) {
        return false;
      }
      if (filters.storey_range !== 'Any' && tx.storey_band !== filters.storey_range) {
        return false;
      }
      return true;
    });
  }, [townTransactions, newestMonth, filters]);

  // Sort transactions
  const sortedTransactions = useMemo(() => {
    const list = [...filteredTransactions];
    if (sortOrder === 'price_asc') {
      list.sort((a, b) => a.resale_price_num - b.resale_price_num);
    } else if (sortOrder === 'price_desc') {
      list.sort((a, b) => b.resale_price_num - a.resale_price_num);
    } else {
      // Default: newest first by month descending
      list.sort((a, b) => b.month.localeCompare(a.month));
    }
    return list;
  }, [filteredTransactions, sortOrder]);

  // Handlers
  const handleSelectTransaction = (transaction: ResaleTransaction) => {
    setSelectedTransaction(transaction);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSearch = () => {
    setCurrentScreen('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearAllFilters = () => {
    setFilters({
      town: filters.town, // Keep the selected town
      period: 'Last 12 months',
      flat_type: 'Any',
      flat_model: 'Any',
      remaining_lease: 'Any',
      storey_range: 'Any',
    });
  };

  const handleClearFilter = (key: keyof FilterState) => {
    if (key === 'period') {
      setFilters((prev) => ({
        ...prev,
        period: 'Last 12 months',
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [key]: 'Any',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-stone-800 selection:text-white antialiased">
      {/* App Header */}
      <Header />

      {/* Screen 1 or Screen 2 */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 sm:px-6">
        {currentScreen === 'detail' && selectedTransaction ? (
          /* [Screen 2] — Transaction Detail */
          <DetailScreen
            transaction={selectedTransaction}
            onBack={handleBackToSearch}
          />
        ) : (
          /* [Screen 1] — Search and Results */
          <div id="search-results-screen">
            {/* Filter Section: Town, Period, Flat Type, Flat Model, Remaining Lease, Storey */}
            <FilterSection
              filters={filters}
              onFilterChange={setFilters}
              availableTowns={availableTowns}
              availableFlatTypes={availableFlatTypes}
              availableFlatModels={availableFlatModels}
            />

            {/* Loading Case: "Loading recent transactions…" */}
            {isLoading ? (
              <div
                id="loading-state"
                className="flex flex-col items-center justify-center py-16 text-stone-600"
              >
                <Loader2 className="w-8 h-8 animate-spin mb-3 text-stone-800" />
                <p className="text-base font-semibold text-stone-800">
                  Loading recent transactions…
                </p>
              </div>
            ) : fetchStatus === 'refused' || fetchStatus === 'unreachable' ? (
              /* Error Cases: Refused or Unreachable */
              <ErrorNotice
                status={fetchStatus}
                onRetry={() => loadTownData(filters.town)}
              />
            ) : (
              <>
                {/* Summary strip, coverage line, refresh duration, and sort controls */}
                <ResultsSummary
                  matchingTransactions={sortedTransactions}
                  allTownTransactions={townTransactions}
                  totalTownTransactions={townTransactions.length}
                  filters={filters}
                  sortOrder={sortOrder}
                  onSortChange={setSortOrder}
                  refreshDurationMs={refreshDurationMs}
                />

                {/* Results List or Empty State */}
                {sortedTransactions.length > 0 ? (
                  <div
                    id="transaction-results-list"
                    className="flex flex-col gap-3 sm:gap-4"
                  >
                    {sortedTransactions.map((tx) => (
                      <TransactionCard
                        key={tx.id}
                        transaction={tx}
                        onSelect={handleSelectTransaction}
                      />
                    ))}
                  </div>
                ) : (
                  /* Empty Case: "No flats matched those filters. Try clearing the lease or storey filter." */
                  <EmptyState
                    filters={filters}
                    onClearAll={handleClearAllFilters}
                    onClearFilter={handleClearFilter}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer with exact required licence attribution */}
      <footer className="mt-auto py-6 border-t border-stone-200 bg-white text-center text-xs text-stone-600 px-4">
        <div className="max-w-4xl mx-auto flex flex-col gap-1.5">
          <div className="font-semibold text-stone-700">FlatRadar • What HDB flats actually sold for</div>
          <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
            Contains information from Resale Flat Prices (Jan 2017 onwards) accessed from data.gov.sg which is made available under the terms of the Singapore Open Data Licence version 1.0.
          </p>
        </div>
      </footer>
    </div>
  );
}
