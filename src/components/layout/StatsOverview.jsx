import React from 'react';
import { formatINR } from '../../utils/formatters.js';
import { TrendingUp, Clock, CheckCircle, RotateCcw } from 'lucide-react';

export const StatsOverview = ({ stats, filteredVolume }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Volume Card */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Net Volume
          </span>
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-slate-900 tracking-tight">
            {formatINR(stats.totalVolume)}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
            <span className="font-semibold text-emerald-600">{stats.breakdown.success} settled</span>
            <span>across {stats.totalTransactions} orders</span>
            {typeof filteredVolume === 'number' && filteredVolume < stats.totalVolume && (
              <span className="text-brand-600 font-medium">({formatINR(filteredVolume)} filtered)</span>
            )}
          </div>
        </div>
      </div>

      {/* Pending Settlement */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pending Clearance
          </span>
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-amber-600 tracking-tight">
            {formatINR(stats.pendingVolume)}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
            <span className="font-semibold text-amber-700">{stats.breakdown.pending} in queue</span>
            <span>awaiting bank webhook</span>
          </div>
        </div>
      </div>

      {/* Total Refunded */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Refunds
          </span>
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-purple-600 tracking-tight">
            {formatINR(stats.totalRefunded)}
          </p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
            <span className="font-semibold text-purple-700">{stats.breakdown.refunded} requests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

