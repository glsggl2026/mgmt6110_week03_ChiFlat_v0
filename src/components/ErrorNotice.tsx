import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { FetchStatus } from '../services/api.ts';

interface ErrorNoticeProps {
  status: FetchStatus;
  onRetry: () => void;
}

export const ErrorNotice: React.FC<ErrorNoticeProps> = ({ status, onRetry }) => {
  const message =
    status === 'refused'
      ? 'data.gov.sg is limiting requests right now. This is on our side, not yours — try again in about a minute.'
      : "We can't reach data.gov.sg at the moment. Nothing you did caused this. Please try again shortly.";

  return (
    <div
      id="api-error-notice"
      className="bg-rose-50 border border-rose-200 rounded-2xl p-6 sm:p-8 text-center my-6 shadow-2xs"
      role="alert"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>

      <p className="text-base sm:text-lg font-bold text-stone-900 max-w-lg mx-auto mb-5 leading-relaxed">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-sm font-semibold transition-all shadow-xs"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try again</span>
      </button>
    </div>
  );
};
