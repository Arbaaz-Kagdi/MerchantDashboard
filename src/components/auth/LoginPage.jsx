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
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const LoginPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('signin');

  // Sign In states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up states
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState('merchant');
  const [signupStore, setSignupStore] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Status & validation states
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setErrorMessage(
        err.message || 'Invalid credentials. Only authorized merchant and admin accounts may sign in.'
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
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03070d] via-[#0b1018] to-[#2b0c14] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-700/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-red-900/20 rounded-full blur-3xl pointer-events-none" />

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-xl">ArbaazPay</span>
            </div>
            <p className="text-xs text-slate-400">Merchant Operations & Settlement Platform</p>
          </div>
        </div>
      </header>

      {/* Main Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-fade-in">
          {/* Card Brand Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-tr from-slate-950 via-slate-900 to-red-950 text-white relative">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center mb-4">
              {mode === 'signin' ? (
                <KeyRound className="w-6 h-6 text-red-300" />
              ) : (
                <UserPlus className="w-6 h-6 text-red-300" />
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              {mode === 'signin' ? 'Sign In to ArbaazPay' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {mode === 'signin'
                ? 'Authenticate with your authorized credentials to access the transaction console.'
                : 'Register a new merchant or admin account. Credentials persist across page refreshes.'}
            </p>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-white/10 rounded-xl mt-5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
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
                className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
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

          <div className="p-6 sm:p-8 space-y-5">
            {/* Error Message Alert */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs animate-fade-in"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="leading-snug font-medium">
                  <p className="font-bold text-rose-900">
                    {mode === 'signin' ? 'Authentication Failed' : 'Registration Failed'}
                  </p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {mode === 'signin' ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Test Accounts
                    </span>
                    <span className="text-[11px] text-slate-700 font-semibold flex items-center gap-1">
                      Click to Auto-fill
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillCredentials('user@merchant.com', '00001234')}
                      className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Merchant</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        user@merchant.com
                      </p>
                      <p className="text-[10px] text-emerald-700 font-mono">pwd: 00001234</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleFillCredentials('arbaaz@admin.com', '00006789')}
                      className="p-2.5 rounded-xl border border-red-200 bg-red-50/60 hover:bg-red-100/70 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1.5 text-red-800 font-bold text-xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        arbaaz@admin.com
                      </p>
                      <p className="text-[10px] text-red-700 font-mono">pwd: 00006789</p>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block font-semibold text-slate-700 mb-1.5"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        id="login-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-shadow font-mono placeholder:font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="block font-semibold text-slate-700 mb-1.5"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-shadow font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                        aria-label={showPassword ? 'Hide password visibility' : 'Show password visibility'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-slate-950 hover:bg-slate-800 active:bg-slate-900 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 text-sm mt-3"
                  >
                    {isSubmitting ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMessage('');
                      }}
                      className="font-bold text-slate-900 hover:text-slate-700 hover:underline"
                    >
                      Sign Up here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              /* --- SIGN UP VIEW --- */
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label
                    htmlFor="signup-name"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Full Name / Merchant Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Rohit Yadav"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-email"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. rohityadav@yahoo.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-shadow font-mono placeholder:font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-password"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="signup-password"
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create password (min 4 characters)"
                      className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-shadow font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                      aria-label={showSignupPassword ? 'Hide password visibility' : 'Show password visibility'}
                    >
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Persona / Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSignupRole('merchant')}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        signupRole === 'merchant'
                          ? 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-bold ring-1 ring-emerald-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Merchant</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        Store sales & refunds
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole('admin')}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        signupRole === 'admin'
                          ? 'border-red-500 bg-red-50/80 text-red-900 font-bold ring-1 ring-red-500'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                        <span>Admin</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                        Platform lead with all controls
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-store"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Store or Company Name <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      id="signup-store"
                      type="text"
                      value={signupStore}
                      onChange={(e) => setSignupStore(e.target.value)}
                      placeholder="e.g. Experia 360"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-shadow"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-800 active:bg-slate-900 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 text-sm mt-4"
                >
                  {isSubmitting ? (
                    <span>Registering Account...</span>
                  ) : (
                    <>
                      <span>Create Account & Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMessage('');
                      }}
                      className="font-bold text-slate-900 hover:text-slate-700 hover:underline"
                    >
                      Sign In instead
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer matching exact requested format */}
      <footer className="w-full py-6 text-center text-xs text-slate-400 z-10">
        <p>© 2024 ArbaazPay Merchant Solutions India.</p>
      </footer>
    </div>
  );
};
