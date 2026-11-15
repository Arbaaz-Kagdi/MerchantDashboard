import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  message = 'Failed to load transaction data from server.',
  onRetry,
  isSimulated = false,
}) => {
  return (
    <div
      role="alert"
      className="p-6 bg-rose-50 border border-rose-200 rounded-xl shadow-sm my-4 text-rose-900"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100 rounded-lg text-rose-600 shrink-0">
            <AlertTriangle className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-rose-900">
                {isSimulated ? 'Deliberate Simulated API Error (Demo Mode)' : 'Gateway Communication Failure'}
              </h3>
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-rose-200 text-rose-800 rounded">
                HTTP 500
              </span>
            </div>
            <p className="text-sm text-rose-700 mt-1 max-w-2xl">{message}</p>
            <p className="text-xs text-rose-600/80 mt-1">
              Tip: Click the retry button below or disable simulated failure to restore normal data streaming.
            </p>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 shrink-0 self-stretch sm:self-auto justify-center"
        >
          <RefreshCw className="w-4 h-4 animate-spin-hover" />
          <span>Retry Request</span>
        </button>
      </div>
    </div>
  );
};

