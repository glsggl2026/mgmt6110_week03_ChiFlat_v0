import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart3,
  Server,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AuditMatrixModalProps {
  onSelectTownTest?: (town: string) => void;
}

export const AuditMatrixModal: React.FC<AuditMatrixModalProps> = () => {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    brand: true,
    boxplot: true,
    error502: true,
    health200: true,
    trimming: true,
    responsiveness: false,
    emptyStates: false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const comparisonRows = [
    {
      feature: 'App Branding & Title',
      oldApp: 'ChiFlat • What HDB flats actually sold for',
      newApp: 'FlatRadar • What HDB flats actually sold for',
      status: 'Refined brand identity across header, title, and footer',
      category: 'Design & UX',
    },
    {
      feature: 'Resale Summary & Analytics',
      oldApp: 'Basic Count, Average, Min, and Max price summaries',
      newApp: 'Full Boxplot Metrics: Min, P10, P25, Median, P75, P90, Max, IQR with distribution visualizer',
      status: 'High statistical clarity for price distribution & outliers',
      category: 'Analytics',
    },
    {
      feature: 'Network Failure Status Code',
      oldApp: 'HTTP 503 (Disguised app guard stop vs network down)',
      newApp: 'HTTP 502 (Bad Gateway for upstream unreachable)',
      status: 'Correct RFC HTTP semantics: 502 for upstream network failure',
      category: 'API Contract',
    },
    {
      feature: 'Exception Scope (try/catch)',
      oldApp: 'Broad try/catch wrapping fetch, JSON parsing, and mapping',
      newApp: 'Narrow try/catch wrapping ONLY the network fetch call',
      status: 'App runtime bugs surface as 500 instead of disguised 502/503',
      category: 'API Resilience',
    },
    {
      feature: 'Health Endpoint (/api/health)',
      oldApp: 'Returned 503 if upstream test ping was degraded',
      newApp: 'Consistently returns 200; upstream status carried inside body payload',
      status: 'Observability & monitoring standard compliance',
      category: 'API Contract',
    },
    {
      feature: 'Dataset Span (Rolling Window)',
      oldApp: '10000 records sorted by _id',
      newApp: 'Strict 36-month rolling window computed dynamically from newest transaction',
      status: 'Clean temporal consistency without stale transaction bloat',
      category: 'Data Pipeline',
    },
    {
      feature: 'Attribution & Open Data Licence',
      oldApp: 'Singapore Open Data Licence v1.0 attribution present',
      newApp: 'Singapore Open Data Licence v1.0 attribution preserved with enhanced contrast',
      status: 'Compliant with data.gov.sg requirements',
      category: 'Compliance',
    },
  ];

  const testTowns = [
    'ANG MO KIO',
    'BEDOK',
    'BISHAN',
    'BUKIT PANJANG',
    'QUEENSTOWN',
    'TAMPINES',
    'WOODLANDS',
    'YISHUN',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 mb-8 border border-stone-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Specification Audit
              </span>
              <span className="text-xs text-stone-400">Release Evolution Matrix</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
              ChiFlat (v1) vs FlatRadar (v2)
            </h2>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              Compare architectural, statistical, and API contract improvements between the legacy
              prototype and the modernized FlatRadar release.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://week3chiflat.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-medium hover:bg-stone-700 transition-colors border border-stone-700 inline-flex items-center gap-1.5"
            >
              <span>Launch Old App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://v2-vert-kappa.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-lg bg-amber-400 text-stone-950 text-xs font-semibold hover:bg-amber-300 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Launch New App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Diff Comparison Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs mb-8">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-900">
              Architecture & Feature Difference Matrix
            </h3>
            <p className="text-xs text-stone-500">
              Line-by-line contrast of system behavior and interface capabilities
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">7 verified benchmarks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-100/75 border-b border-stone-200 text-stone-700 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-[20%]">Dimension</th>
                <th className="py-3 px-4 w-[35%] bg-amber-50/40 text-amber-900">
                  Old Version (week3chiflat)
                </th>
                <th className="py-3 px-4 w-[45%] bg-emerald-50/40 text-emerald-900">
                  New Version (v2-vert-kappa)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80 font-normal">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-stone-900 align-top">
                    <div>{row.feature}</div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700 bg-amber-50/20 align-top font-mono text-[11px] leading-relaxed">
                    {row.oldApp}
                  </td>
                  <td className="py-3.5 px-4 text-stone-900 bg-emerald-50/20 align-top font-mono text-[11px] leading-relaxed">
                    <div className="font-semibold text-emerald-950 mb-0.5">{row.newApp}</div>
                    <div className="text-[10px] font-sans text-stone-500 italic">
                      ✓ {row.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Verification Checklist & Test Helpers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Checklist */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-stone-900 text-sm">
              Live Auditor Checklist
            </h3>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Interactive verification steps when comparing both deployments side by side.
          </p>

          <div className="space-y-2.5">
            {[
              {
                id: 'brand',
                label: 'Brand title updated from ChiFlat to FlatRadar',
              },
              {
                id: 'boxplot',
                label: 'Boxplot summary cards (P10, P25, Median, P75, P90, IQR) rendered on v2',
              },
              {
                id: 'error502',
                label: 'Unreachable data.gov.sg returns 502 Bad Gateway instead of 503',
              },
              {
                id: 'health200',
                label: '/api/health returns HTTP 200 with structured body',
              },
              {
                id: 'trimming',
                label: 'Transactions trimmed to 36-month rolling window',
              },
              {
                id: 'responsiveness',
                label: 'UI responsive across mobile, tablet, and desktop viewports',
              },
              {
                id: 'emptyStates',
                label: 'Empty state guidance renders when no flats match strict filters',
              },
            ].map((item) => (
              <label
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-stone-50 cursor-pointer select-none transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checklist[item.id]}
                  onChange={() => {}}
                  className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-stone-500 w-4 h-4 cursor-pointer"
                />
                <span
                  className={`text-xs ${
                    checklist[item.id]
                      ? 'text-stone-900 font-medium'
                      : 'text-stone-500'
                  }`}
                >
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Rapid Test Town Matrix */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-stone-900 text-sm">
                Targeted Test Towns
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Direct links to test identical town parameters across both deployments.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {testTowns.map((town) => (
                <div
                  key={town}
                  className="p-2.5 rounded-lg border border-stone-200 bg-stone-50/70 hover:bg-stone-100 transition-colors flex items-center justify-between group"
                >
                  <span className="text-xs font-semibold text-stone-800">
                    {town}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100">
                    <a
                      href={`https://week3chiflat.vercel.app/?town=${encodeURIComponent(town)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${town} on v1`}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200"
                    >
                      v1
                    </a>
                    <a
                      href={`https://v2-vert-kappa.vercel.app/?town=${encodeURIComponent(town)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${town} on v2`}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    >
                      v2
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Official dataset: data.gov.sg</span>
            <span className="font-mono">Open Data Licence 1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
