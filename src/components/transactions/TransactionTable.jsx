import React, { useState } from 'react';
import { StatusBadge } from '../common/Badge.jsx';
import { formatINR, formatDateTime } from '../../utils/formatters.js';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Smartphone,
  CreditCard,
  Building,
  Wallet,
} from 'lucide-react';

export const TransactionTable = ({
  transactions,
  sortBy,
  sortOrder,
  onSort,
  onSelectTxn,
  onRequestRefund,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
    );
  };

  const getAriaSort = (column) => {
    if (sortBy !== column) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

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
    <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table" aria-label="Transactions Table">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {/* Transaction ID */}
              <th scope="col" className="py-3.5 px-4 font-bold" aria-sort={getAriaSort('id')}>
                <button
                  type="button"
                  onClick={() => onSort('id')}
                  className="group flex items-center gap-1.5 hover:text-slate-900 transition-colors focus:outline-none"
                >
                  <span>Transaction ID</span>
                  {getSortIcon('id')}
                </button>
              </th>

              {/* Date / Time */}
              <th scope="col" className="py-3.5 px-4 font-bold" aria-sort={getAriaSort('createdAt')}>
                <button
                  type="button"
                  onClick={() => onSort('createdAt')}
                  className="group flex items-center gap-1.5 hover:text-slate-900 transition-colors focus:outline-none"
                >
                  <span>Date & Time</span>
                  {getSortIcon('createdAt')}
                </button>
              </th>

              {/* Merchant / Order Reference */}
              <th scope="col" className="py-3.5 px-4 font-bold" aria-sort={getAriaSort('orderRef')}>
                <button
                  type="button"
                  onClick={() => onSort('orderRef')}
                  className="group flex items-center gap-1.5 hover:text-slate-900 transition-colors focus:outline-none"
                >
                  <span>Order / Reference</span>
                  {getSortIcon('orderRef')}
                </button>
              </th>

              {/* Amount (INR) */}
              <th scope="col" className="py-3.5 px-4 font-bold text-right" aria-sort={getAriaSort('amount')}>
                <button
                  type="button"
                  onClick={() => onSort('amount')}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors focus:outline-none ml-auto"
                >
                  <span>Amount (INR)</span>
                  {getSortIcon('amount')}
                </button>
              </th>

              {/* Payment Method */}
              <th scope="col" className="py-3.5 px-4 font-bold">
                Payment Method
              </th>

              {/* Status */}
              <th scope="col" className="py-3.5 px-4 font-bold" aria-sort={getAriaSort('status')}>
                <button
                  type="button"
                  onClick={() => onSort('status')}
                  className="group flex items-center gap-1.5 hover:text-slate-900 transition-colors focus:outline-none"
                >
                  <span>Status</span>
                  {getSortIcon('status')}
                </button>
              </th>

              {/* Action buttons */}
              <th scope="col" className="py-3.5 px-4 font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-sm">
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                onClick={() => onSelectTxn(txn)}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
              >
                {/* ID with 1-click copy */}
                <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span>{txn.id}</span>
                    <button
                      type="button"
                      onClick={(e) => copyToClipboard(txn.id, e)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Copy transaction ID"
                      aria-label={`Copy transaction ID ${txn.id}`}
                    >
                      {copiedId === txn.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>

                {/* Date / Time */}
                <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
                  {formatDateTime(txn.createdAt)}
                </td>

                {/* Order & Merchant Reference */}
                <td className="py-3 px-4">
                  <div className="font-medium text-xs text-slate-800">{txn.orderRef}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{txn.merchantRef}</div>
                </td>

                {/* Amount (INR) */}
                <td className="py-3 px-4 text-right font-semibold font-mono text-sm text-slate-900 whitespace-nowrap">
                  {formatINR(txn.amount)}
                </td>

                {/* Payment Method */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700">
                    <span className="p-1 rounded bg-slate-100">{getMethodIcon(txn.paymentMethod)}</span>
                    <span>{txn.paymentMethod}</span>
                  </div>
                  {txn.paymentDetails.provider && (
                    <span className="text-[10px] text-slate-400 block ml-6">
                      {txn.paymentDetails.provider}
                    </span>
                  )}
                  {txn.paymentDetails.cardLast4 && (
                    <span className="text-[10px] text-slate-400 block ml-6">
                      •••• {txn.paymentDetails.cardLast4}
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <StatusBadge status={txn.status} />
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {/* View Details */}
                    <button
                      type="button"
                      onClick={() => onSelectTxn(txn)}
                      className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="View transaction details"
                      aria-label={`View details for ${txn.id}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>

                    {/* Mock Refund Button (Visible when Success) */}
                    {txn.status === 'Success' && (
                      <button
                        type="button"
                        onClick={() => onRequestRefund(txn)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                        title="Simulate mock refund request"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Refund</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

