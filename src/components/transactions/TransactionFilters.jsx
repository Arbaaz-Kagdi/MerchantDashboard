import React, { useState } from 'react';
import {
  Search,
  RotateCcw,
  Download,
  AlertTriangle,
  Filter,
} from 'lucide-react';

export const TransactionFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  paymentMethod,
  setPaymentMethod,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  simulateError,
  setSimulateError,
  onReset,
  onExportCsv,
  isExporting,
  totalFiltered,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Quick Date Range Presets
  const applyPreset = (preset) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'today') {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (preset === '7days') {
      const past7 = new Date();
      past7.setDate(past7.getDate() - 7);
      setStartDate(past7.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === '30days') {
      const past30 = new Date();
      past30.setDate(past30.getDate() - 30);
      setStartDate(past30.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else {
      setStartDate('');
      setEndDate('');
    }
  };

  const hasActiveFilters = Boolean(
    search || (status && status !== 'All') || (paymentMethod && paymentMethod !== 'All') || startDate || endDate
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 mb-6">
      {/* Primary Row: Search, Status, CSV Export & Simulate Error */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
        {/* Search Input with accessible label */}
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search by Transaction ID, Order Reference, Customer or UPI
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="search-input"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Transaction ID, Order"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
          />
        </div>

        {/* Filter dropdowns and Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            ({totalFiltered} found)
          </span>

          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="status-select" className="text-xs font-semibold text-slate-600 sr-only">
              Status Filter
            </label>
            <select
              id="status-select"
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer transition-all"
            >
              <option value="All">Status: All</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          {/* Toggle Date/Advanced Filters Button */}
          <button
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${
              isAdvancedOpen || startDate || endDate || paymentMethod !== 'All'
                ? 'bg-brand-50 text-brand-700 border-brand-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            aria-expanded={isAdvancedOpen}
            aria-label="Toggle advanced filters and date range"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>More Filters</span>
            {(startDate || endDate || paymentMethod !== 'All') && (
              <span className="w-2 h-2 rounded-full bg-brand-600" />
            )}
          </button>

          {/* CSV Export Button */}
          <button
            onClick={onExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all disabled:opacity-50"
            title="Download transactions matching current filters as CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>

          {/* Deliberate Error Simulation Toggle */}
          <button
            onClick={() => setSimulateError(!simulateError)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all ${
              simulateError
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
            title="Simulate core banking gateway timeout / HTTP 500 error"
            aria-pressed={simulateError}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{simulateError ? 'Simulating Error ⚡' : 'Simulate API Failure'}</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer (Date Range & Payment Method) */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end animate-fade-in">
          {/* Payment Method selector */}
          <div className="md:col-span-3">
            <label htmlFor="method-select" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Payment Method
            </label>
            <select
              id="method-select"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="All">All Methods (UPI, Cards, NetBanking)</option>
              <option value="UPI">UPI (GPay, PhonePe, Paytm)</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Wallet">Wallet</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="md:col-span-3">
            <label htmlFor="start-date-input" className="block text-xs font-semibold text-slate-600 mb-1.5">
              Start Date
            </label>
            <input
              id="start-date-input"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* End Date */}
          <div className="md:col-span-3">
            <label htmlFor="end-date-input" className="block text-xs font-semibold text-slate-600 mb-1.5">
              End Date
            </label>
            <input
              id="end-date-input"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Quick Presets */}
          <div className="md:col-span-3">
            <span className="block text-xs font-semibold text-slate-600 mb-1.5">Quick Presets</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('today')}
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => applyPreset('7days')}
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                Last 7d
              </button>
              <button
                type="button"
                onClick={() => applyPreset('30days')}
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                Last 30d
              </button>
              <button
                type="button"
                onClick={() => applyPreset('all')}
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
              >
                All Time
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

