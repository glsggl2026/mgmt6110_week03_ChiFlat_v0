import React, { useState } from 'react';
import { FilterState, ResaleTransaction, SortOrder } from '../types.ts';
import {
  formatCompactPrice,
  formatMonth,
  formatPrice,
  getPercentile,
} from '../utils/hdb.ts';
import { FilterSection } from './FilterSection.tsx';
import { TransactionCard } from './TransactionCard.tsx';
import {
  Columns2,
  ExternalLink,
  Copy,
  Check,
  Table,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

interface ComparisonViewProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableFlatTypes: string[];
  availableFlatModels: string[];
  availableTowns: string[];
  matchingTransactions: ResaleTransaction[];
  allTownTransactions: ResaleTransaction[];
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
  refreshDurationMs: number | null;
  onSelectTransaction: (t: ResaleTransaction) => void;
}

const OLD_APP_URL =
  'https://aistudio.google.com/apps/3c1ee0ea-a60b-4481-bbb9-136205981a55?showPreview=true&showAssistant=true';
const NEW_APP_URL =
  'https://aistudio.google.com/apps/d7752193-d1e8-4015-b15a-e0917b587de5?showPreview=true&showAssistant=true';

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  filters,
  onFilterChange,
  availableFlatTypes,
  availableFlatModels,
  availableTowns,
  matchingTransactions,
  allTownTransactions,
  sortOrder,
  onSortChange,
  refreshDurationMs,
  onSelectTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'split' | 'iframes' | 'diff'>('split');
  const [copiedUrl, setCopiedUrl] = useState<'old' | 'new' | null>(null);

  const handleCopy = (url: string, type: 'old' | 'new') => {
    navigator.clipboard?.writeText(url);
    setCopiedUrl(type);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const n = matchingTransactions.length;

  // Stats calculation
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

    const mid = Math.floor(prices.length / 2);
    const median =
      prices.length % 2 !== 0
        ? prices[mid]
        : Math.round((prices[mid - 1] + prices[mid]) / 2);
    medianText = formatPrice(median);

    const sum = prices.reduce((acc, val) => acc + val, 0);
    const average = Math.round(sum / prices.length);
    averageText = formatPrice(average);

    const minP = prices[0];
    const maxP = prices[prices.length - 1];
    rangeText = `${formatCompactPrice(minP)} – ${formatCompactPrice(maxP)}`;

    const p25 = getPercentile(prices, 0.25);
    const p75 = getPercentile(prices, 0.75);
    const spread = Math.max(0, p75 - p25);

    p25Text = formatCompactPrice(p25);
    p75Text = formatCompactPrice(p75);
    spreadText = formatCompactPrice(spread);

    p25Exact = formatPrice(p25);
    p75Exact = formatPrice(p75);
    spreadExact = formatPrice(spread);

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

  // Simulated Old App: originally limited to 500 rows
  const simulatedOldN = Math.min(n, 500);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick URL Controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-stone-100 text-xs font-semibold uppercase tracking-wider">
                App Comparison
              </span>
              <span className="text-xs text-stone-600 font-medium">
                Side-by-Side Dual View
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Old Version (ChiFlat) vs New Version (FlatRadar)
            </h2>
            <p className="text-sm text-stone-600 mt-0.5">
              Compare visual design, statistical metrics, API error handling, and data pipeline changes.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl border border-stone-200 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'split'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Interactive Split</span>
            </button>
            <button
              onClick={() => setActiveTab('iframes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'iframes'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Live Iframes</span>
            </button>
            <button
              onClick={() => setActiveTab('diff')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'diff'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Feature Diff</span>
            </button>
          </div>
        </div>

        {/* URL Quick-Launch Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
          {/* Old App Link Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-stone-800">Old App (ChiFlat)</span>
                <span className="text-[10px] font-mono text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">
                  3c1ee0ea...
                </span>
              </div>
              <p className="text-xs text-stone-600 truncate mt-0.5" title={OLD_APP_URL}>
                {OLD_APP_URL}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleCopy(OLD_APP_URL, 'old')}
                className="p-1.5 text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 text-xs"
                title="Copy Old URL"
              >
                {copiedUrl === 'old' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={OLD_APP_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-stone-800 text-white rounded-lg text-xs font-medium hover:bg-stone-700 transition-colors"
              >
                <span>Open in AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* New App Link Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-stone-900 text-white border border-stone-800">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-xs font-bold text-white">New App (FlatRadar)</span>
                <span className="text-[10px] font-mono text-stone-300 bg-stone-800 px-1.5 py-0.5 rounded">
                  d7752193...
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate mt-0.5" title={NEW_APP_URL}>
                {NEW_APP_URL}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleCopy(NEW_APP_URL, 'new')}
                className="p-1.5 text-stone-300 hover:text-white bg-stone-800 border border-stone-700 rounded-lg hover:bg-stone-700 text-xs"
                title="Copy New URL"
              >
                {copiedUrl === 'new' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={NEW_APP_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 transition-colors"
              >
                <span>Open in AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE SPLIT COMPARISON */}
      {activeTab === 'split' && (
        <div className="space-y-6">
          {/* Synchronized Filter Toolbar */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stone-700" />
                <span className="text-sm font-semibold text-stone-900">
                  Shared Interactive Controls (Updates Both Views Live)
                </span>
              </div>
              <span className="text-xs text-stone-600">
                Town: <span className="font-semibold text-stone-800">{filters.town}</span> • {allTownTransactions.length} records loaded
              </span>
            </div>
            <FilterSection
              filters={filters}
              onFilterChange={onFilterChange}
              availableFlatTypes={availableFlatTypes}
              availableFlatModels={availableFlatModels}
              availableTowns={availableTowns}
            />
          </div>

          {/* Two-Column Side-by-Side View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* LEFT COLUMN: OLD APP (CHIFLAT v1.0) */}
            <div className="bg-white border-2 border-stone-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-stone-200 flex items-center justify-center font-bold text-stone-700 text-xs">
                    v1
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                      <span>ChiFlat</span>
                      <span className="text-xs font-normal text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                        Original App
                      </span>
                    </h3>
                    <p className="text-xs text-stone-600">What HDB flats actually sold for</p>
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-600">
                  <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                    Limit: 500 rows
                  </span>
                </div>
              </div>

              {/* Old Summary Card: Light Stone theme, NO boxplot metrics */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 shadow-2xs">
                <div className="text-xs font-semibold text-stone-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Summary Strip (Original)</span>
                  <span className="text-[10px] text-stone-600 lowercase bg-stone-200 px-1.5 py-0.5 rounded">light card</span>
                </div>

                {/* Old Summary Strip: Median, Average, n, Range only */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base sm:text-lg text-stone-700 font-medium tracking-tight">
                  <span>
                    Median <span className="font-bold text-stone-900">{medianText}</span>
                  </span>
                  <span className="text-stone-300 font-normal">·</span>
                  <span>
                    Average <span className="font-bold text-stone-900">{averageText}</span>
                  </span>
                  <span className="text-stone-300 font-normal">·</span>
                  <span>
                    n = <span className="font-extrabold text-stone-900">{simulatedOldN}</span>
                  </span>
                  <span className="text-stone-300 font-normal">·</span>
                  <span>
                    Range <span className="font-bold text-stone-900">{rangeText}</span>
                  </span>
                </div>

                {/* Old Missing Metrics Notice */}
                <div className="mt-3 pt-2.5 border-t border-stone-200 flex items-center gap-1.5 text-xs text-stone-600">
                  <Info className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                  <span>Missing: 25% percentile, 75% percentile, and Spread (IQR)</span>
                </div>
              </div>

              {/* Old Version Fine Print Style */}
              <div className="text-xs text-stone-600 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <p className="font-medium text-stone-700">Original Data Behavior:</p>
                <p className="mt-0.5">
                  Showing {simulatedOldN} transactions in {filters.town}
                  {dateRangeStr ? `, ${dateRangeStr}` : ''}. Hardcapped at 500 records upstream.
                </p>
                <div className="mt-2 text-[11px] text-stone-600 space-y-0.5">
                  <p>• Error handling: Returns HTTP 503 on network down</p>
                  <p>• Health check: Returns HTTP 503 if upstream fails</p>
                  <p>• Try/Catch: Wraps entire handler (masks code bugs)</p>
                </div>
              </div>

              {/* Transactions List Sample */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
                  <span>Transactions ({matchingTransactions.slice(0, 4).length} of {simulatedOldN})</span>
                  <span className="text-stone-600 font-normal">Sorted: {sortOrder}</span>
                </div>
                {matchingTransactions.slice(0, 4).map((tx) => (
                  <TransactionCard
                    key={`old-${tx.id}`}
                    transaction={tx}
                    onSelect={onSelectTransaction}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: NEW APP (FLATRADAR v2.0) */}
            <div className="bg-stone-900 border-2 border-stone-700 rounded-2xl p-4 sm:p-5 shadow-md space-y-4 text-white">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                    v2
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>FlatRadar</span>
                      <span className="text-xs font-normal text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                        Upgraded App
                      </span>
                    </h3>
                    <p className="text-xs text-stone-400">What HDB flats actually sold for</p>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700 font-medium">
                    Limit: 10,000 + 36-mo
                  </span>
                </div>
              </div>

              {/* New Summary Card: Dark Grey theme, WITH boxplot metrics */}
              <div className="bg-stone-800 border border-stone-700 rounded-2xl p-4 shadow-sm text-white">
                <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="text-emerald-400 font-medium">Summary Card (Upgraded)</span>
                  <span className="text-[10px] text-stone-300 lowercase bg-stone-700 px-1.5 py-0.5 rounded">dark grey card</span>
                </div>

                {/* New Summary Strip: Median, Average, n, Range + Boxplot (25%, 75%, Spread) */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-base sm:text-lg text-stone-200 font-medium tracking-tight">
                  <span>
                    Median <span className="font-bold text-white">{medianText}</span>
                  </span>
                  <span className="text-stone-500 font-normal">·</span>
                  <span>
                    Average <span className="font-bold text-white">{averageText}</span>
                  </span>
                  <span className="text-stone-500 font-normal">·</span>
                  <span>
                    n ={' '}
                    <span
                      className={
                        n >= 10
                          ? 'text-emerald-400 font-extrabold'
                          : 'text-rose-400 font-extrabold'
                      }
                    >
                      {n}
                    </span>
                  </span>
                  <span className="text-stone-500 font-normal">·</span>
                  <span>
                    Range <span className="font-bold text-white">{rangeText}</span>
                  </span>
                  <span className="text-stone-500 font-normal">·</span>
                  <span>
                    25% <span className="font-bold text-white" title={p25Exact ? `25th percentile: ${p25Exact}` : undefined}>{p25Text}</span>
                  </span>
                  <span className="text-stone-500 font-normal">·</span>
                  <span>
                    75% <span className="font-bold text-white" title={p75Exact ? `75th percentile: ${p75Exact}` : undefined}>{p75Text}</span>
                  </span>
                  <span className="text-stone-500 font-normal">·</span>
                  <span>
                    Spread <span className="font-bold text-white" title={spreadExact ? `IQR (Spread): ${spreadExact}` : undefined}>{spreadText}</span>
                  </span>
                </div>

                {/* Added Boxplot Advantage */}
                <div className="mt-3 pt-2.5 border-t border-stone-700 flex items-center justify-between text-xs text-stone-300">
                  <span className="text-emerald-400 font-medium">✓ Full Boxplot Distribution Included</span>
                  {refreshDurationMs !== null && (
                    <span className="text-stone-400">Fetch: {refreshDurationMs} ms</span>
                  )}
                </div>
              </div>

              {/* New Version Fine Print Style */}
              <div className="text-xs text-stone-300 p-2.5 bg-stone-800/80 rounded-xl border border-stone-700">
                <p className="font-medium text-white">Upgraded Data Pipeline:</p>
                <p className="mt-0.5 text-stone-300">
                  Showing {n} transactions in {filters.town}
                  {dateRangeStr ? `, ${dateRangeStr}` : ''}. {allTownTransactions.length} exist in rolling 36-month window.
                </p>
                <div className="mt-2 text-[11px] text-stone-400 space-y-0.5">
                  <p className="text-emerald-300">• Error handling: Returns HTTP 502 Bad Gateway</p>
                  <p className="text-emerald-300">• Health check: Always HTTP 200 with verdict in payload</p>
                  <p className="text-emerald-300">• Try/Catch: Wraps ONLY fetch (code bugs surface as true 500)</p>
                </div>
              </div>

              {/* Transactions List Sample */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
                  <span>Transactions ({matchingTransactions.slice(0, 4).length} of {n})</span>
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <ArrowUpDown className="w-3 h-3" />
                    <span>Sorted: {sortOrder}</span>
                  </div>
                </div>
                {matchingTransactions.slice(0, 4).map((tx) => (
                  <TransactionCard
                    key={`new-${tx.id}`}
                    transaction={tx}
                    onSelect={onSelectTransaction}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIDE-BY-SIDE IFRAMES */}
      {activeTab === 'iframes' && (
        <div className="space-y-4">
          {/* Information Notice about X-Frame-Options */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-amber-900">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1">
              <p className="font-semibold text-amber-900">
                Google AI Studio Embed Security Notice (X-Frame-Options: DENY)
              </p>
              <p className="text-amber-800 leading-relaxed">
                Google AI Studio web pages (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">aistudio.google.com</code>) enforce browser-level security headers (<code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">X-Frame-Options: DENY</code> and Google account OAuth redirect) to prevent clickjacking.
              </p>
              <p className="text-amber-800 leading-relaxed">
                If the iframes below show a connection block in your browser, click the <strong>&quot;Open in AI Studio&quot;</strong> button above each frame to view the live app in its native AI Studio workspace.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Old App Frame */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-stone-100 p-3.5 border-b border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Old App (ChiFlat)</span>
                  </div>
                  <div className="text-[11px] text-stone-500 font-mono truncate max-w-xs sm:max-w-md">
                    3c1ee0ea-a60b-4481-bbb9-136205981a55
                  </div>
                </div>
                <a
                  href={OLD_APP_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors shrink-0"
                >
                  <span>Open in AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative w-full h-[620px] bg-stone-50">
                <iframe
                  src={OLD_APP_URL}
                  title="Old ChiFlat App (3c1ee0ea)"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>

            {/* New App Frame */}
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-stone-900 p-3.5 border-b border-stone-800 text-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>New App (FlatRadar)</span>
                  </div>
                  <div className="text-[11px] text-stone-400 font-mono truncate max-w-xs sm:max-w-md">
                    d7752193-d1e8-4015-b15a-e0917b587de5
                  </div>
                </div>
                <a
                  href={NEW_APP_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-500 transition-colors shrink-0"
                >
                  <span>Open in AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative w-full h-[620px] bg-stone-950">
                <iframe
                  src={NEW_APP_URL}
                  title="New FlatRadar App (d7752193)"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE-BY-FEATURE DIFF TABLE */}
      {activeTab === 'diff' && (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-900">
              Technical & Architectural Evolution
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Comprehensive changelog comparing the original ChiFlat implementation with the new FlatRadar release.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold">
                  <th className="py-3 px-4 w-1/4">Component / Dimension</th>
                  <th className="py-3 px-4 w-1/3 text-stone-700 bg-amber-50/50">Old App (ChiFlat v1.0)</th>
                  <th className="py-3 px-4 w-1/3 text-emerald-900 bg-emerald-50/50">New App (FlatRadar v2.0)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    Application Name & Branding
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20 font-mono text-stone-700">
                    ChiFlat
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-mono font-bold text-emerald-800">
                    FlatRadar
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    Summary Card Styling
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20">
                    Light stone card (<code className="text-xs bg-stone-100 px-1 py-0.5 rounded">bg-stone-50</code>, grey text)
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-medium text-emerald-900">
                    High-contrast dark grey (<code className="text-xs bg-emerald-100 px-1 py-0.5 rounded text-emerald-900">bg-stone-800</code>, bold white text)
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    Boxplot Distribution Metrics
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20 text-stone-500">
                    Basic strip: Median, Average, n, Range only
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-semibold text-emerald-800">
                    Full boxplot: Median, Avg, n, Range, 25% (Q1), 75% (Q3), and Spread (IQR)
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    Upstream Data Ingestion Limit
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20 text-stone-600">
                    <code className="text-xs bg-stone-100 px-1 py-0.5 rounded">limit=500</code> (truncates high volume towns)
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-medium text-emerald-800">
                    <code className="text-xs bg-emerald-100 px-1 py-0.5 rounded text-emerald-900">limit=10000</code> with server-side rolling 36-month trimming
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    API Response Format
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20">
                    Flat array of transaction rows
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-mono text-xs text-emerald-800">
                    {`{ count, oldestMonth, newestMonth, total, upstreamMs, records }`}
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    Unreachable Upstream Error Status
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20 text-rose-700 font-mono">
                    HTTP 503 (Service Unavailable)
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-mono font-semibold">
                    HTTP 502 (Bad Gateway)
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    Health Check Endpoint (<code className="text-xs">/api/health</code>)
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20 text-stone-600">
                    Returns HTTP 503 when data.gov.sg fails
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-medium text-emerald-800">
                    Always returns HTTP 200; diagnosis carried in payload
                  </td>
                </tr>

                <tr>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    Try/Catch Scope (<code className="text-xs">api/resale.js</code>)
                  </td>
                  <td className="py-3.5 px-4 bg-amber-50/20 text-stone-600">
                    Broad: wrapped fetch, JSON, mapping, sorting, and trimming
                  </td>
                  <td className="py-3.5 px-4 bg-emerald-50/20 font-medium text-emerald-800">
                    Narrow: wraps ONLY fetch; code crashes surface cleanly as HTTP 500
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
