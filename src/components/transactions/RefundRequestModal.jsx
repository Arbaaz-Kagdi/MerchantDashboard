import React, { useState, useEffect } from 'react';
import { formatINR } from '../../utils/formatters.js';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const RefundRequestModal = ({
  transaction,
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const { user, role } = useAuth();
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('Customer Cancellation');
  const [customReason, setCustomReason] = useState('');
  const [validationError, setValidationError] = useState(null);

  // Sync default amount when transaction changes
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setValidationError(null);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a valid refund amount greater than ₹0.');
      return;
    }

    if (numAmount > transaction.amount) {
      setValidationError(`Refund amount cannot exceed original transaction amount of ${formatINR(transaction.amount)}.`);
      return;
    }

    const finalReason = reason === 'Other' ? (customReason.trim() || 'Merchant Custom Refund') : reason;

    setValidationError(null);
    await onSubmit({
      amount: numAmount,
      reason: finalReason,
      initiatedBy: `${user?.name || 'Store User'} (${role})`,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="refund-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-purple-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 id="refund-modal-title" className="font-bold text-slate-900 text-base">
                Request Refund
              </h2>
              <p className="text-xs text-slate-500 font-mono">{transaction.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close refund dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block">Please be aware that these are not real transactions.</strong>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Original transaction info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-slate-500 block">Original Transaction Amount:</span>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {formatINR(transaction.amount)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Customer:</span>
              <span className="font-medium text-slate-800">{transaction.customer.name}</span>
            </div>
          </div>

          {/* Refund Amount Input */}
          <div>
            <label htmlFor="refund-amount" className="block font-semibold text-slate-700 mb-1">
              Refund Amount (INR ₹)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                ₹
              </span>
              <input
                id="refund-amount"
                type="number"
                step="0.01"
                min="1"
                max={transaction.amount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports full or partial refund (Up to {formatINR(transaction.amount)}).
            </p>
          </div>

          {/* Refund Reason Selection */}
          <div>
            <label htmlFor="refund-reason" className="block font-semibold text-slate-700 mb-1">
              Reason for Refund
            </label>
            <select
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            >
              <option value="Customer Cancellation">Customer Cancellation</option>
              <option value="Defective / Damaged Goods">Defective / Damaged Goods</option>
              <option value="Duplicate Order Charge">Duplicate Order Charge</option>
              <option value="Item Out of Stock">Item Out of Stock</option>
              <option value="Fraudulent Transaction Dispute">Fraudulent Transaction Dispute</option>
              <option value="Other">Other (Custom Reason)</option>
            </select>
          </div>

          {/* Custom reason text if 'Other' */}
          {reason === 'Other' && (
            <div>
              <label htmlFor="custom-reason" className="block font-semibold text-slate-700 mb-1">
                Specify Reason
              </label>
              <input
                id="custom-reason"
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter specific refund notes..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                required
              />
            </div>
          )}

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs">
              {validationError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Processing Refund...' : 'Confirm Refund'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

