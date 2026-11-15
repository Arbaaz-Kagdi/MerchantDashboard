import React from 'react';
import { ShieldAlert, X, CheckCircle2, AlertOctagon, Terminal, Lock } from 'lucide-react';

export const SecurityNoticeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-amber-500/10 via-brand-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="security-modal-title" className="text-lg font-bold text-slate-900">
                Security Architecture Brief: Frontend vs Backend RBAC
              </h2>
              <p className="text-xs text-slate-500">
                Why client-side role guards are purely cosmetic and cannot ensure security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* Key Insight Callout */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
            <div className="flex gap-2.5">
              <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Core Engineering Principle:</strong>
                "Never trust the client. The browser is an untrusted execution environment under full adversary control."
              </div>
            </div>
          </div>

          {/* Vulnerability vectors */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-rose-500" />
              1. How Client-Only Permissions Fail
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider block mb-1 text-rose-600">
                  DevTools State Tampering
                </span>
                <p className="text-xs text-slate-600">
                  Any user can open Browser DevTools, execute <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">authContext.role = "admin"</code>, or alter React state in memory to un-hide restricted buttons and navigation tabs.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider block mb-1 text-rose-600">
                  Direct API / cURL Bypasses
                </span>
                <p className="text-xs text-slate-600">
                  An attacker does not even need the UI. They can issue direct HTTP requests (<code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">curl -X POST /api/transactions/:id/refund</code>) from a terminal, bypassing all React route guards.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider block mb-1 text-rose-600">
                  IDOR & Broken Object Level Auth
                </span>
                <p className="text-xs text-slate-600">
                  Without backend tenant validation, a merchant can change the URL ID from <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">TXN_1001</code> to <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">TXN_1002</code> and inspect competitor financial volumes.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-800 text-xs uppercase tracking-wider block mb-1 text-rose-600">
                  Race Conditions & Replay Attacks
                </span>
                <p className="text-xs text-slate-600">
                  Triggering rapid concurrent refund clicks without server-side database locks or idempotency keys could result in double refunds.
                </p>
              </div>
            </div>
          </div>

          {/* Defense in depth */}
          <div>
            <h3 className="font-bold text-slate-900 text-base mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              2. Defense-in-Depth Implementation Requirements
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Cryptographic Session Tokens:</strong> Validate digitally signed JWTs or secure HTTP-only session cookies with server-side signature verification on every request.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Server-Side RBAC Middleware:</strong> Enforce strict role validation (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">requireRole('admin')</code>) at the controller endpoint before mutating state.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Tenant Scoping (IDOR Prevention):</strong> Ensure all database queries filter strictly by <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">WHERE merchant_id = token.merchant_id</code> so tenants cannot access unauthorized records.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Idempotency Keys & Audit Logs:</strong> Require UUID idempotency headers on refund endpoints to guarantee at-most-once execution and log all admin actions immutably.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};

