import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  CreditCard,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  X,
  AlertCircle,
  Sparkles,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

  // Sign In states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('merchant');
  const [signupStore, setSignupStore] = useState('');

  // Status & validation states
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      onClose();
    } catch (err) {
      setErrorMessage(
        err.message || 'Invalid credentials. Only authorized accounts are permitted.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await register({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        storeName: signupStore,
      });
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoEmail, demoPassword) => {
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await login(demoEmail, demoPassword);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Top brand banner */}
        <div className="p-6 bg-gradient-to-tr from-brand-900 via-brand-800 to-indigo-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 text-brand-300" />
          </div>
          <h2 id="login-modal-title" className="text-xl font-bold">
            {mode === 'signin' ? 'Sign In to ArbaazPay' : 'Create ArbaazPay Account'}
          </h2>
          <p className="text-xs text-brand-200 mt-1">
            Indian Merchant Gateway & Settlement Console
          </p>

          <div className="grid grid-cols-2 p-1 bg-white/10 rounded-xl mt-4 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage('');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 text-xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {mode === 'signin' ? (
            /* --- Sign in modal --- */
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Authorized Credentials
                  </span>
                  <span className="text-[10px] text-brand-600 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> 1-Click Access
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('user@merchant.com', '00001234')}
                    className="p-3 rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs mb-1">
                      <UserCheck className="w-4 h-4" />
                      <span>Merchant</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono leading-tight truncate">
                      user@merchant.com
                    </p>
                    <p className="text-[10px] text-emerald-700 font-mono">pwd: 00001234</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('arbaaz@admin.com', '00006789')}
                    className="p-3 rounded-2xl border-2 border-purple-200 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 transition-all text-left group"
                  >
                    <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono leading-tight truncate">
                      arbaaz@admin.com
                    </p>
                    <p className="text-[10px] text-purple-700 font-mono">pwd: 00006789</p>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-medium">
                  or enter credentials
                </span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleCustomLogin} className="space-y-3 text-xs">
                <div>
                  <label htmlFor="modal-login-email" className="block font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="modal-login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@merchant.com or arbaaz@admin.com"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-login-password" className="block font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="modal-login-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 mt-2"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Continue to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            /* --- Sign up modal --- */
            <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
              <div>
                <label htmlFor="modal-signup-name" className="block font-semibold text-slate-700 mb-1">
                  Full Name / Merchant Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="modal-signup-name"
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-signup-email" className="block font-semibold text-slate-700 mb-1">
                  Email Address (Login ID)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="modal-signup-email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. priya@sharmaretail.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-signup-password" className="block font-semibold text-slate-700 mb-1">
                  Password (min 4 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="modal-signup-password"
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Persona</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('merchant')}
                    className={`py-1.5 px-3 rounded-lg border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      signupRole === 'merchant'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Merchant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignupRole('admin')}
                    className={`py-1.5 px-3 rounded-lg border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      signupRole === 'admin'
                        ? 'border-purple-500 bg-purple-50 text-purple-800'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="modal-signup-store" className="block font-semibold text-slate-700 mb-1">
                  Store Name (optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="modal-signup-store"
                    type="text"
                    value={signupStore}
                    onChange={(e) => setSignupStore(e.target.value)}
                    placeholder="e.g. Sharma Organics Mumbai"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5 mt-2"
              >
                <span>{isSubmitting ? 'Registering...' : 'Create Account & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
