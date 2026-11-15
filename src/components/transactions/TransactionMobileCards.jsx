import React from 'react';
import { StatusBadge } from '../common/Badge.jsx';
import { formatINR, formatDateTime } from '../../utils/formatters.js';
import { ChevronRight, RotateCcw, Smartphone, CreditCard, Building, Wallet } from 'lucide-react';

export const TransactionMobileCards = ({
  transactions,
  onSelectTxn,
  onRequestRefund,
}) => {
  const getMethodIcon = (method) => {
    switch (method) {
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Credit Card':
      case 'Debit Card':
        return <CreditCard className="w-3.5 h-3.5 text-blue-600" />;
      case 'Net Banking':
        return <Building className="w-3.5 h-3.5 text-amber-600" />;
      case 'Wallet':
        return <Wallet className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <CreditCard className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {transactions.map((txn) => (
        <div
          key={txn.id}
          onClick={() => onSelectTxn(txn)}
          className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs active:bg-slate-50 transition-colors"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelectTxn(txn);
            }
          }}
          aria-label={`Transaction ${txn.id}, ${formatINR(txn.amount)}, status ${txn.status}`}
        >
          {/* Card Top: ID and Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {txn.id}
            </span>
            <StatusBadge status={txn.status} size="sm" />
          </div>

          {/* Amount & Reference */}
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <p className="text-lg font-black text-slate-900 font-mono tracking-tight">
                {formatINR(txn.amount)}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{txn.orderRef}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
              {getMethodIcon(txn.paymentMethod)}
              <span>{txn.paymentMethod}</span>
            </div>
          </div>

          {/* Footer: Date & Actions */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs text-slate-400">
            <span>{formatDateTime(txn.createdAt)}</span>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {txn.status === 'Success' && (
                <button
                  type="button"
                  onClick={() => onRequestRefund(txn)}
                  className="px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 rounded-lg border border-purple-200"
                >
                  <RotateCcw className="w-3 h-3 inline mr-1" />
                  Refund
                </button>
              )}
              <span className="text-brand-600 font-semibold flex items-center">
                Details <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

