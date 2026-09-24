import React from 'react';
import {
  Columns2,
  Rows2,
  RotateCw,
  Monitor,
  Tablet,
  Smartphone,
  Layers,
  Sparkles,
  GitCompare,
  ArrowUpDown,
} from 'lucide-react';

export type LayoutMode = 'split' | 'stacked' | 'left-only' | 'right-only';
export type ViewportMode = 'responsive' | 'desktop' | 'tablet' | 'mobile';
export type HeightMultiplier = '1x' | '1.5x' | '2x' | '3x';

interface ComparisonHeaderProps {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  heightMultiplier: HeightMultiplier;
  setHeightMultiplier: (hm: HeightMultiplier) => void;
  onRefreshBoth: () => void;
  onResetSplit: () => void;
  splitRatio: number;
  activeViewTab: 'compare' | 'matrix' | 'local';
  setActiveViewTab: (tab: 'compare' | 'matrix' | 'local') => void;
  isSyncing: boolean;
}

export const ComparisonHeader: React.FC<ComparisonHeaderProps> = ({
  layoutMode,
  setLayoutMode,
  viewportMode,
  setViewportMode,
  heightMultiplier,
  setHeightMultiplier,
  onRefreshBoth,
  onResetSplit,
  splitRatio,
  activeViewTab,
  setActiveViewTab,
  isSyncing,
}) => {
  return (
    <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* App Title & Version Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center shrink-0 text-amber-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
                ChiFlat / FlatRadar Comparison
              </h1>
              <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                v1 vs v2
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Side-by-side audit of week3chiflat and v2-vert-kappa
            </p>
          </div>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-1.5 bg-stone-800/90 p-1 rounded-lg border border-stone-700/80 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setActiveViewTab('compare')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeViewTab === 'compare'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Compare Apps</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeViewTab === 'matrix'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Diff & Audit Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewTab('local')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
              activeViewTab === 'local'
                ? 'bg-stone-950 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Local Build</span>
          </button>
        </div>

        {/* Layout & Control Strip (only when compare view is active) */}
        {activeViewTab === 'compare' && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Screen Length Multiplier (Default 2x) */}
            <div className="flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700">
              <span className="text-[10px] uppercase font-semibold text-stone-400 px-1.5 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-stone-400" />
                <span className="hidden sm:inline">Height</span>
              </span>
              <button
                type="button"
                title="1x Viewport Height"
                onClick={() => setHeightMultiplier('1x')}
                className={`px-2 py-1 rounded transition-colors ${
                  heightMultiplier === '1x'
                    ? 'bg-stone-900 text-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                1×
              </button>
              <button
                type="button"
                title="1.5x Screen Length"
                onClick={() => setHeightMultiplier('1.5x')}
                className={`px-2 py-1 rounded transition-colors ${
                  heightMultiplier === '1.5x'
                    ? 'bg-stone-900 text-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                1.5×
              </button>
              <button
                type="button"
                title="2x Screen Length (~2 times viewport height)"
                onClick={() => setHeightMultiplier('2x')}
                className={`px-2 py-1 rounded transition-colors ${
                  heightMultiplier === '2x'
                    ? 'bg-stone-900 text-amber-300 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                2× (Full)
              </button>
              <button
                type="button"
                title="3x Extended Screen Length"
                onClick={() => setHeightMultiplier('3x')}
                className={`px-2 py-1 rounded transition-colors ${
                  heightMultiplier === '3x'
                    ? 'bg-stone-900 text-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                3×
              </button>
            </div>

            {/* Viewport Width Preset */}
            <div className="flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700">
              <button
                type="button"
                title="Full Responsive Width"
                onClick={() => setViewportMode('responsive')}
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'responsive'
                    ? 'bg-stone-900 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Tablet Preview (768px)"
                onClick={() => setViewportMode('tablet')}
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'tablet'
                    ? 'bg-stone-900 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Mobile Preview (390px)"
                onClick={() => setViewportMode('mobile')}
                className={`p-1.5 rounded transition-colors ${
                  viewportMode === 'mobile'
                    ? 'bg-stone-900 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Layout Mode (Split / Stacked / Left / Right) */}
            <div className="flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700">
              <button
                type="button"
                title="Split View (Side by Side)"
                onClick={() => setLayoutMode('split')}
                className={`p-1.5 rounded transition-colors ${
                  layoutMode === 'split'
                    ? 'bg-stone-900 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Stacked View (Top / Bottom)"
                onClick={() => setLayoutMode('stacked')}
                className={`p-1.5 rounded transition-colors ${
                  layoutMode === 'stacked'
                    ? 'bg-stone-900 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Rows2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                title="Old Only (Left: week3chiflat)"
                onClick={() => setLayoutMode('left-only')}
                className={`px-2 py-1 rounded transition-colors ${
                  layoutMode === 'left-only'
                    ? 'bg-stone-900 text-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Old
              </button>
              <button
                type="button"
                title="New Only (Right: v2-vert-kappa)"
                onClick={() => setLayoutMode('right-only')}
                className={`px-2 py-1 rounded transition-colors ${
                  layoutMode === 'right-only'
                    ? 'bg-stone-900 text-stone-100 font-semibold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                New
              </button>
            </div>

            {/* Reset Splitter if adjusted */}
            {layoutMode === 'split' && splitRatio !== 50 && (
              <button
                type="button"
                onClick={onResetSplit}
                className="px-2 py-1 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-700 text-xs transition-colors"
                title="Reset to 50/50 split"
              >
                Reset 50:50
              </button>
            )}

            {/* Refresh Both button */}
            <button
              type="button"
              onClick={onRefreshBoth}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-900 font-medium hover:bg-white active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Reload Both</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
