import React from 'react';
import { Database, Building2, Columns2, Sparkles } from 'lucide-react';

interface HeaderProps {
  isComparisonMode?: boolean;
  onToggleComparisonMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isComparisonMode = false,
  onToggleComparisonMode,
}) => {
  return (
    <header id="flatradar-header" className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-xs">
      <div className={`mx-auto px-4 py-3 sm:px-6 transition-all duration-200 ${isComparisonMode ? 'max-w-7xl' : 'max-w-4xl'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#064e3b] leading-tight">
                  FlatRadar
                </h1>
                {isComparisonMode && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                    Side-by-Side Mode
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-stone-600">
                What HDB flats actually sold for
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {onToggleComparisonMode && (
              <button
                id="toggle-comparison-mode-btn"
                onClick={onToggleComparisonMode}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isComparisonMode
                    ? 'bg-stone-900 text-white border-stone-800 shadow-xs hover:bg-stone-800'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>{isComparisonMode ? 'Exit Comparison' : 'Compare Old vs New'}</span>
              </button>
            )}

            <div
              id="source-credit"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium"
            >
              <Database className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>Source: data.gov.sg</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

