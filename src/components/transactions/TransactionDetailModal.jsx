import React from 'react';
import { StatusBadge } from '../common/Badge.jsx';
import { formatINR, formatDateTime } from '../../utils/formatters.js';
import {
  X,
  CreditCard,
  User,
  RotateCcw,
  AlertTriangle,
  Receipt,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const TransactionDetailModal = ({
  transaction,
  isOpen,
  onClose,
  onRequestRefund,
}) => {
  const { role } = useAuth();

  if (!isOpen || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="txn-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-500">
                {transaction.id}
              </span>
              <StatusBadge status={transaction.status} size="sm" />
            </div>
            <h2 id="txn-modal-title" className="text-xl font-black text-slate-900 tracking-tight">
              {formatINR(transaction.amount)}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Order Ref: <span className="font-semibold text-slate-700">{transaction.orderRef}</span> | Store:{' '}
              <span className="font-semibold text-slate-700">{transaction.storeName}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            aria-label="Close transaction details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm">
          {/* Failure Alert if Failed */}
          {transaction.status === 'Failed' && transaction.failureReason && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Payment Failure Reason:</strong>
                  {transaction.failureReason}
                </div>
              </div>
            </div>
          )}

          {/* Refund Information if Refunded */}
          {transaction.status === 'Refunded' && transaction.refund && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-purple-800">
                  <RotateCcw className="w-4 h-4" />
                    Refund Recorded ({transaction.refund.refundId})
                </span>
                <span className="px-2 py-0.5 font-mono bg-purple-200 text-purple-800 rounded font-bold">
                  {formatINR(transaction.refund.amount)}
                </span>
              </div>
              <p className="text-purple-700">
                <strong>Reason:</strong> {transaction.refund.reason}
              </p>
              <p className="text-purple-600 text-[11px]">
                Processed at {formatDateTime(transaction.refund.processedAt)} by{' '}
                {transaction.refund.initiatedBy}
              </p>
            </div>
          )}

          {/* Fee & Settlement Breakdown */}
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-brand-600" />
              Financial Settlement Breakdown
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Customer Payment:</span>
                <span className="font-semibold text-slate-800">{formatINR(transaction.amount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Gateway MDR Fee (1.8%):</span>
                <span className="text-slate-700">- {formatINR(transaction.fee)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST on Fee (18%):</span>
                <span className="text-slate-700">- {formatINR(transaction.gst)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Net Settlement to Merchant:</span>
                <span className="text-emerald-600 font-mono">
                  {formatINR(transaction.settlementAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer & Payment Instrument Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Customer Details
              </h4>
              <p className="text-slate-600">
                <strong>Name:</strong> {transaction.customer.name}
              </p>
              <p className="text-slate-600 truncate">
                <strong>Email:</strong> {transaction.customer.email}
              </p>
              <p className="text-slate-600">
                <strong>Phone:</strong> {transaction.customer.phone}
              </p>
            </div>

            {/* Payment Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                Payment Method & Instrument
              </h4>
              <p className="text-slate-600">
                <strong>Method:</strong> {transaction.paymentMethod}
              </p>
              {transaction.paymentDetails.provider && (
                <p className="text-slate-600">
                  <strong>App / PSP:</strong> {transaction.paymentDetails.provider}
                </p>
              )}
              {transaction.paymentDetails.vpa && (
                <p className="text-slate-600 font-mono text-[11px] truncate">
                  <strong>UPI VPA:</strong> {transaction.paymentDetails.vpa}
                </p>
              )}
              {transaction.paymentDetails.cardBrand && (
                <p className="text-slate-600">
                  <strong>Card:</strong> {transaction.paymentDetails.cardBrand} (••••{' '}
                  {transaction.paymentDetails.cardLast4})
                </p>
              )}
              {transaction.paymentDetails.bankRrn && (
                <p className="text-slate-600 font-mono text-[11px]">
                  <strong>Bank RRN:</strong> {transaction.paymentDetails.bankRrn}
                </p>
              )}
              {transaction.paymentDetails.bankName && (
                <p className="text-slate-600">
                  <strong>Bank:</strong> {transaction.paymentDetails.bankName}
                </p>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Created: {formatDateTime(transaction.createdAt)}
            </span>
            <span>Last Updated: {formatDateTime(transaction.updatedAt)}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Current Role: <span className="font-bold capitalize text-slate-700">{role}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>

            {transaction.status === 'Success' && (
              <button
                onClick={() => {
                  onRequestRefund(transaction);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg shadow-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Request Refund</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

