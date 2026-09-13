import React from 'react';
import { Database, Building2 } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header id="flatradar-header" className="bg-white border-b border-stone-200 sticky top-0 z-20 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3.5 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-50 flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 leading-tight">
                FlatRadar
              </h1>
              <p className="text-sm font-medium text-stone-600">
                What HDB flats actually sold for
              </p>
            </div>
          </div>

          <div
            id="source-credit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium self-start sm:self-auto"
          >
            <Database className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            <span>Source: data.gov.sg</span>
          </div>
        </div>
      </div>
    </header>
  );
};
