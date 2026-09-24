import React, { useState, useMemo } from 'react';
import { ResaleTransaction, FilterState } from '../types.ts';
import { getPercentile } from '../utils/hdb.ts';

interface PriceBoxChartProps {
  transactions: ResaleTransaction[];
  filters: FilterState;
}

type BlinkTarget = 'total' | 'median' | 'average' | 'p25' | 'p75' | 'spread';

export const PriceBoxChart: React.FC<PriceBoxChartProps> = ({
  transactions,
  filters,
}) => {
  const n = transactions.length;
  const [blinkState, setBlinkState] = useState<{
    target: BlinkTarget | null;
    key: number;
  }>({ target: null, key: 0 });

  const prices = useMemo(() => {
    return transactions
      .map((t) => t.resale_price_num)
      .sort((a, b) => a - b);
  }, [transactions]);

  // Consistent 'k' unit formatter for prices
  const formatK = (price: number): string => {
    const kVal = price / 1000;
    const formatted = kVal % 1 === 0 ? kVal.toString() : kVal.toFixed(1);
    return `$${formatted}k`;
  };

  // Dedicated formatter for median & average: round up with no decimal
  const formatKCeil = (price: number): string => {
    const kVal = Math.ceil(price / 1000);
    return `$${kVal}k`;
  };

  if (n === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center shadow-xs">
        <h3 className="text-lg font-bold text-stone-800 mb-2">
          No transactions to plot
        </h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          No flats matched the current filters for {filters.town}. Try clearing or broadening your filters.
        </p>
      </div>
    );
  }

  // Exact metrics for calculations & top metric cards
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];
  const p25 = getPercentile(prices, 0.25);
  const midIndex = Math.floor(prices.length / 2);
  const median =
    prices.length % 2 !== 0
      ? prices[midIndex]
      : Math.round((prices[midIndex - 1] + prices[midIndex]) / 2);
  const p75 = getPercentile(prices, 0.75);
  const sum = prices.reduce((acc, v) => acc + v, 0);
  const average = Math.round(sum / prices.length);
  const iqr = Math.max(0, p75 - p25);

  const countBottom25 = prices.filter((p) => p <= p25).length;
  const countTop25 = prices.filter((p) => p >= p75).length;
  const countBelowMedian = prices.filter((p) => p <= median).length;
  const countMiddle50 = prices.filter((p) => p >= p25 && p <= p75).length;

  // Chart Coordinate Calculations (Horizontal Box Plot with tight margins so it appears bigger)
  const chartWidth = 820;
  const chartHeight = 270;
  const paddingLeft = 32;
  const paddingRight = 32;
  const usableWidth = chartWidth - paddingLeft - paddingRight;

  const priceRange = maxPrice - minPrice;
  const marginSpan = priceRange > 0 ? priceRange * 0.025 : 25000;
  const domainMin = Math.max(0, minPrice - marginSpan);
  const domainMax = maxPrice + marginSpan;
  const domainSpan = domainMax - domainMin;

  const priceToX = (price: number) => {
    if (domainSpan <= 0) return paddingLeft + usableWidth / 2;
    const ratio = (price - domainMin) / domainSpan;
    return paddingLeft + ratio * usableWidth;
  };

  const xMin = priceToX(minPrice);
  const xP25 = priceToX(p25);
  const xMedian = priceToX(median);
  const xAverage = priceToX(average);
  const xP75 = priceToX(p75);
  const xMax = priceToX(maxPrice);

  const yCenter = 120;
  const boxHeight = 64;
  const boxTop = yCenter - boxHeight / 2;
  const boxWidth = Math.max(4, xP75 - xP25);

  // Sample dots for scatter strip with vertical jitter
  const sampledPrices = useMemo(() => {
    if (prices.length <= 140) {
      return prices.map((p, idx) => ({ price: p, originalIndex: idx }));
    }
    const step = prices.length / 140;
    const sampled: { price: number; originalIndex: number }[] = [];
    for (let i = 0; i < 140; i++) {
      const idx = Math.min(prices.length - 1, Math.floor(i * step));
      sampled.push({ price: prices[idx], originalIndex: idx });
    }
    return sampled;
  }, [prices]);

  const dots = sampledPrices.map(({ price, originalIndex }) => {
    const jitter = Math.sin(originalIndex * 137.5) * 20;
    return {
      cx: priceToX(price),
      cy: yCenter + jitter,
      price,
    };
  });

  // Calculate index numbers for the X axis
  const xAxisTicks = useMemo(() => {
    if (domainSpan <= 0) return [];
    const rawStep = domainSpan / 6;
    let step = 100000;
    if (rawStep < 75000) step = 50000;
    else if (rawStep < 150000) step = 100000;
    else if (rawStep < 300000) step = 200000;
    else step = 250000;

    const start = Math.ceil(domainMin / step) * step;
    const ticks: { value: number; x: number; label: string }[] = [];
    for (let val = start; val <= domainMax; val += step) {
      ticks.push({
        value: val,
        x: priceToX(val),
        label: `$${val / 1000}k`,
      });
    }
    return ticks;
  }, [domainMin, domainMax, domainSpan]);

  const triggerBlink = (target: BlinkTarget) => {
    setBlinkState({ target, key: Date.now() });
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs">
      <style>{`
        @keyframes elementBlinkAnim {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 10px #0d9488);
            stroke-width: 4.5px;
          }
          25%, 75% {
            opacity: 0.15;
            filter: none;
            stroke-width: 2px;
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 16px #14b8a6);
            stroke-width: 5.5px;
          }
        }
        @keyframes boxBlinkAnim {
          0%, 100% {
            fill-opacity: 0.7;
            stroke-width: 4px;
            filter: drop-shadow(0 0 12px #0d9488);
          }
          25%, 75% {
            fill-opacity: 0.1;
            stroke-width: 1.5px;
            filter: none;
          }
          50% {
            fill-opacity: 0.85;
            stroke-width: 5px;
            filter: drop-shadow(0 0 18px #14b8a6);
          }
        }
        @keyframes dotsBlinkAnim {
          0%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 6px #0d9488);
          }
          25%, 75% {
            opacity: 0.2;
            filter: none;
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 10px #14b8a6);
          }
        }
        .animate-element-blink {
          animation: elementBlinkAnim 0.55s ease-in-out 4;
        }
        .animate-box-blink {
          animation: boxBlinkAnim 0.55s ease-in-out 4;
        }
        .animate-dots-blink {
          animation: dotsBlinkAnim 0.55s ease-in-out 4;
        }
      `}</style>

      {/* Header with Click Cards below to Blink one size smaller, matching font style */}
      <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
        <h2 className="tracking-tight flex flex-wrap items-baseline gap-2.5">
          <span className="text-xl sm:text-2xl font-extrabold text-stone-900">Price Box Chart</span>
          <span className="text-base sm:text-lg font-normal text-teal-800 tracking-tight">
            Click Cards below to Blink
          </span>
        </h2>
      </div>

      {/* Metric Cards Row — all numbers in black, same font size (text-xl), non-bold, aligned horizontally */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 py-5">
        {/* 1. # Transactions */}
        <button
          type="button"
          onClick={() => triggerBlink('total')}
          className={`bg-stone-50 hover:bg-teal-50/70 border rounded-xl p-3 flex flex-col justify-between text-left transition-all cursor-pointer group shadow-2xs active:scale-[0.98] ${
            blinkState.target === 'total'
              ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/60'
              : 'border-stone-200/80 hover:border-teal-300'
          }`}
          title="Click to blink all transaction dots in the chart"
        >
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider h-8 flex items-start group-hover:text-teal-900">
            # Transactions
          </span>
          <span className="text-xl font-normal text-black my-1 leading-tight">
            {n.toLocaleString()}
          </span>
          {/* Fine print in 2 rows as requested */}
          <span className="text-[11px] text-stone-500 mt-0.5 leading-snug min-h-[2.2rem] flex flex-col justify-start">
            <span>Matching flats in</span>
            <span className="font-medium text-stone-700 truncate">{filters.town}</span>
          </span>
        </button>

        {/* 2. Median Card: decimal removed & rounded up */}
        <button
          type="button"
          onClick={() => triggerBlink('median')}
          className={`bg-stone-50 hover:bg-teal-50/70 border rounded-xl p-3 flex flex-col justify-between text-left transition-all cursor-pointer group shadow-2xs active:scale-[0.98] ${
            blinkState.target === 'median'
              ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/60'
              : 'border-stone-200/80 hover:border-teal-300'
          }`}
          title="Click to blink the Median line in the chart"
        >
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider h-8 flex items-start group-hover:text-teal-900">
            Median
          </span>
          <span className="text-xl font-normal text-black my-1 leading-tight">
            {formatKCeil(median)}
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 leading-snug min-h-[2.2rem] flex flex-col justify-start">
            <span>50% ({countBelowMedian.toLocaleString()} flats)</span>
            <span>sold ≤ this</span>
          </span>
        </button>

        {/* 3. Average: decimal removed & rounded up */}
        <button
          type="button"
          onClick={() => triggerBlink('average')}
          className={`bg-stone-50 hover:bg-teal-50/70 border rounded-xl p-3 flex flex-col justify-between text-left transition-all cursor-pointer group shadow-2xs active:scale-[0.98] ${
            blinkState.target === 'average'
              ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/60'
              : 'border-stone-200/80 hover:border-teal-300'
          }`}
          title="Click to blink the Average line in the chart"
        >
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider h-8 flex items-start group-hover:text-teal-900">
            Average
          </span>
          <span className="text-xl font-normal text-black my-1 leading-tight">
            {formatKCeil(average)}
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 leading-snug min-h-[2.2rem] flex flex-col justify-start">
            <span>
              {average > median
                ? `+${formatKCeil(average - median)} above`
                : average < median
                ? `-${formatKCeil(median - average)} below`
                : 'Equal to'}
            </span>
            <span>median price</span>
          </span>
        </button>

        {/* 4. 25% (Q1) */}
        <button
          type="button"
          onClick={() => triggerBlink('p25')}
          className={`bg-stone-50 hover:bg-teal-50/70 border rounded-xl p-3 flex flex-col justify-between text-left transition-all cursor-pointer group shadow-2xs active:scale-[0.98] ${
            blinkState.target === 'p25'
              ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/60'
              : 'border-stone-200/80 hover:border-teal-300'
          }`}
          title="Click to blink the 25% percentile cutoff in the chart"
        >
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider h-8 flex items-start group-hover:text-teal-900">
            25% (Q1)
          </span>
          <span className="text-xl font-normal text-black my-1 leading-tight">
            {formatK(p25)}
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 leading-snug min-h-[2.2rem] flex flex-col justify-start">
            <span>~{countBottom25.toLocaleString()} flats (25%)</span>
            <span>sold ≤ this</span>
          </span>
        </button>

        {/* 5. 75% (Q3) */}
        <button
          type="button"
          onClick={() => triggerBlink('p75')}
          className={`bg-stone-50 hover:bg-teal-50/70 border rounded-xl p-3 flex flex-col justify-between text-left transition-all cursor-pointer group shadow-2xs active:scale-[0.98] ${
            blinkState.target === 'p75'
              ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/60'
              : 'border-stone-200/80 hover:border-teal-300'
          }`}
          title="Click to blink the 75% percentile cutoff in the chart"
        >
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider h-8 flex items-start group-hover:text-teal-900">
            75% (Q3)
          </span>
          <span className="text-xl font-normal text-black my-1 leading-tight">
            {formatK(p75)}
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 leading-snug min-h-[2.2rem] flex flex-col justify-start">
            <span>~{countTop25.toLocaleString()} flats (25%)</span>
            <span>sold ≥ this</span>
          </span>
        </button>

        {/* 6. Spread (IQR) */}
        <button
          type="button"
          onClick={() => triggerBlink('spread')}
          className={`bg-stone-50 hover:bg-teal-50/70 border rounded-xl p-3 flex flex-col justify-between text-left transition-all cursor-pointer group shadow-2xs active:scale-[0.98] ${
            blinkState.target === 'spread'
              ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/60'
              : 'border-stone-200/80 hover:border-teal-300'
          }`}
          title="Click to blink the Middle 50% box in the chart"
        >
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider h-8 flex items-start group-hover:text-teal-900">
            Spread (IQR)
          </span>
          <span className="text-xl font-normal text-black my-1 leading-tight">
            {formatK(iqr)}
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5 leading-snug min-h-[2.2rem] flex flex-col justify-start">
            <span>Middle 50% span</span>
            <span>(~{countMiddle50.toLocaleString()} flats)</span>
          </span>
        </button>
      </div>

      {/* Horizontal Box Plot — Reduced margins so chart expands much bigger */}
      <div className="mt-2 bg-stone-50/60 border border-stone-200 rounded-2xl p-2 sm:p-4">
        {/* Horizontal SVG Diagram */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[660px] w-full py-1">
            <svg
              className="w-full h-auto overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Vertical Guide lines for key milestones */}
              {[
                { x: xMin, color: '#9ca3af' },
                { x: xP25, color: '#0d9488' },
                { x: xMedian, color: '#0f766e' },
                { x: xAverage, color: '#0f766e' },
                { x: xP75, color: '#0d9488' },
                { x: xMax, color: '#9ca3af' },
              ].map((m, idx) => (
                <line
                  key={idx}
                  x1={m.x}
                  y1={35}
                  x2={m.x}
                  y2={190}
                  stroke={m.color}
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  opacity="0.4"
                />
              ))}

              {/* Horizontal Whisker Line from Min to 25% (left) */}
              <line
                x1={xMin}
                y1={yCenter}
                x2={xP25}
                y2={yCenter}
                stroke="#0f766e"
                strokeWidth="2.5"
              />

              {/* Horizontal Whisker Line from 75% to Max (right) */}
              <line
                x1={xP75}
                y1={yCenter}
                x2={xMax}
                y2={yCenter}
                stroke="#0f766e"
                strokeWidth="2.5"
              />

              {/* Left Whisker Cap at Min Price */}
              <line
                x1={xMin}
                y1={yCenter - 14}
                x2={xMin}
                y2={yCenter + 14}
                stroke="#0f766e"
                strokeWidth="2.5"
              />

              {/* Right Whisker Cap at Max Price */}
              <line
                x1={xMax}
                y1={yCenter - 14}
                x2={xMax}
                y2={yCenter + 14}
                stroke="#0f766e"
                strokeWidth="2.5"
              />

              {/* Interquartile Box (25% to 75%) */}
              <rect
                key={`box-${blinkState.key}`}
                x={xP25}
                y={boxTop}
                width={boxWidth}
                height={boxHeight}
                fill="#5eead4"
                fillOpacity="0.45"
                stroke="#0f766e"
                strokeWidth="2.5"
                rx="3"
                className={blinkState.target === 'spread' ? 'animate-box-blink' : ''}
              />

              {/* Jittered Scatter Dots Strip */}
              <g
                id="scatter-dots"
                key={`dots-${blinkState.key}`}
                className={blinkState.target === 'total' ? 'animate-dots-blink' : ''}
              >
                {dots.map((d, i) => {
                  const isBottom25 = d.price <= p25;
                  const isTop25 = d.price >= p75;
                  const isMiddle50 = d.price >= p25 && d.price <= p75;

                  let dotBlinkClass = '';
                  if (blinkState.target === 'p25' && isBottom25) {
                    dotBlinkClass = 'animate-dots-blink';
                  } else if (blinkState.target === 'p75' && isTop25) {
                    dotBlinkClass = 'animate-dots-blink';
                  } else if (blinkState.target === 'spread' && isMiddle50) {
                    dotBlinkClass = 'animate-dots-blink';
                  }

                  return (
                    <circle
                      key={i}
                      cx={d.cx}
                      cy={d.cy}
                      r="3.5"
                      fill="#0f766e"
                      fillOpacity="0.8"
                      stroke="#ffffff"
                      strokeWidth="0.5"
                      className={dotBlinkClass}
                    >
                      <title>{`Transaction price: ${formatK(d.price)}`}</title>
                    </circle>
                  );
                })}
              </g>

              {/* Average (Mean) Line — Dashed Vertical */}
              <line
                key={`avg-line-${blinkState.key}`}
                x1={xAverage}
                y1={boxTop}
                x2={xAverage}
                y2={boxTop + boxHeight}
                stroke="#0f766e"
                strokeWidth="2.5"
                strokeDasharray="4 3"
                className={blinkState.target === 'average' ? 'animate-element-blink' : ''}
              />

              {/* Median Line — Solid Vertical */}
              <line
                key={`median-line-${blinkState.key}`}
                x1={xMedian}
                y1={boxTop - 4}
                x2={xMedian}
                y2={boxTop + boxHeight + 4}
                stroke="#0f766e"
                strokeWidth="3.5"
                className={blinkState.target === 'median' ? 'animate-element-blink' : ''}
              />

              {/* 25% (Q1) Boundary Line */}
              <line
                key={`p25-line-${blinkState.key}`}
                x1={xP25}
                y1={boxTop}
                x2={xP25}
                y2={boxTop + boxHeight}
                stroke="#0f766e"
                strokeWidth="2"
                className={blinkState.target === 'p25' ? 'animate-element-blink' : ''}
              />

              {/* 75% (Q3) Boundary Line */}
              <line
                key={`p75-line-${blinkState.key}`}
                x1={xP75}
                y1={boxTop}
                x2={xP75}
                y2={boxTop + boxHeight}
                stroke="#0f766e"
                strokeWidth="2"
                className={blinkState.target === 'p75' ? 'animate-element-blink' : ''}
              />

              {/* Milestone Callout Tags — numbers removed after : as requested */}
              {/* Min Tag */}
              <g transform={`translate(${xMin}, 70)`}>
                <text x="0" y="0" fill="#4b5563" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Min
                </text>
              </g>

              {/* 25% Tag */}
              <g
                key={`tag-p25-${blinkState.key}`}
                transform={`translate(${xP25}, 52)`}
                className={blinkState.target === 'p25' ? 'animate-element-blink' : ''}
              >
                <rect x="-22" y="-14" width="44" height="20" rx="4" fill={blinkState.target === 'p25' ? '#0f766e' : '#f0fdfa'} stroke="#0f766e" strokeWidth="1" />
                <text x="0" y="0" fill={blinkState.target === 'p25' ? '#ffffff' : '#0f766e'} fontSize="11" fontWeight="bold" textAnchor="middle">
                  25%
                </text>
              </g>

              {/* Median Tag */}
              <g
                key={`tag-median-${blinkState.key}`}
                transform={`translate(${xMedian}, 28)`}
                className={blinkState.target === 'median' ? 'animate-element-blink' : ''}
              >
                <rect x="-30" y="-14" width="60" height="22" rx="4" fill="#0f766e" />
                <text x="0" y="1" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Median
                </text>
              </g>

              {/* Average Tag (Below Box) */}
              <g
                key={`tag-avg-${blinkState.key}`}
                transform={`translate(${xAverage}, 170)`}
                className={blinkState.target === 'average' ? 'animate-element-blink' : ''}
              >
                <rect x="-20" y="-13" width="40" height="20" rx="4" fill={blinkState.target === 'average' ? '#0f766e' : '#f0fdfa'} stroke="#0f766e" strokeWidth="1" />
                <text x="0" y="1" fill={blinkState.target === 'average' ? '#ffffff' : '#115e59'} fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  Avg
                </text>
              </g>

              {/* 75% Tag */}
              <g
                key={`tag-p75-${blinkState.key}`}
                transform={`translate(${xP75}, 52)`}
                className={blinkState.target === 'p75' ? 'animate-element-blink' : ''}
              >
                <rect x="-22" y="-14" width="44" height="20" rx="4" fill={blinkState.target === 'p75' ? '#0f766e' : '#f0fdfa'} stroke="#0f766e" strokeWidth="1" />
                <text x="0" y="0" fill={blinkState.target === 'p75' ? '#ffffff' : '#0f766e'} fontSize="11" fontWeight="bold" textAnchor="middle">
                  75%
                </text>
              </g>

              {/* Max Tag */}
              <g transform={`translate(${xMax}, 70)`}>
                <text x="0" y="0" fill="#4b5563" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Max
                </text>
              </g>

              {/* Bottom Baseline Axis with Index Numbers */}
              <line
                x1={paddingLeft}
                y1={198}
                x2={chartWidth - paddingRight}
                y2={198}
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />

              {/* X Axis Index Numbers & Tick Marks */}
              {xAxisTicks.map((tick, idx) => (
                <g key={idx} transform={`translate(${tick.x}, 198)`}>
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#64748b" strokeWidth="1.5" />
                  <text
                    x="0"
                    y="18"
                    fill="#334155"
                    fontSize="11"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {tick.label}
                  </text>
                </g>
              ))}

              <text
                x={chartWidth / 2}
                y={242}
                fill="#64748b"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
              >
                Resale Price Axis (SGD)
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
