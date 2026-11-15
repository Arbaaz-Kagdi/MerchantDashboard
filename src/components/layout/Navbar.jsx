import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { CreditCard, LogOut, Building2 } from 'lucide-react';

export const Navbar = ({ onOpenLogin }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const displayName = user?.email === 'user@merchant.com' ? 'Test Merchant' : (user?.name || 'Merchant');

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand & Store */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  ArbaazPay
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {user?.storeName || 'Demo Merchant Store'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: User Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white">
                  {displayName.charAt(0)}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">{displayName}</p>
                  <p className="text-[10px] text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors ml-1"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-xs"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
