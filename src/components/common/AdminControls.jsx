import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldCheck, Zap, RotateCcw, Check } from 'lucide-react';
import { resetClientStore } from '../../services/api.js';

export const AdminControls = ({
  onRefreshData,
  simulateError,
  setSimulateError,
}) => {
  const { role } = useAuth();
  const [resetSuccess, setResetSuccess] = useState(false);

  // Only visible in Admin role
  if (role !== 'admin') return null;

  const handleResetData = async () => {
    await resetClientStore();
    setSimulateError(false);
    onRefreshData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="mb-6 p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-purple-950 uppercase tracking-wider">
                Admin Operations Console
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-200/80 text-purple-800">
                Super Admin Access
              </span>
            </div>
            <p className="text-xs text-purple-800/80 mt-0.5">
              Simulate gateway failures, review cross-merchant audit trails, and test retry resilience.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Chaos Injection Toggle */}
          <button
            onClick={() => setSimulateError(!simulateError)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 ${
              simulateError
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white text-purple-800 border-purple-300 hover:bg-purple-100'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{simulateError ? 'Deactivate Chaos' : 'Simulate API Failure'}</span>
          </button>

          {/* Reset Synthetic Database */}
          <button
            onClick={handleResetData}
            className="px-3 py-1.5 text-xs font-bold rounded-xl border border-purple-300 bg-white text-purple-800 hover:bg-purple-100 transition-all flex items-center gap-1.5"
            title="Reset dataset back to fresh synthetic records"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Reset Done!</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

