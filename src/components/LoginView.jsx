import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { SEED_EMPLOYEES } from '../data';

export default function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      let userObj;
      if (email.includes('admin') || email.includes('manager')) {
        userObj = { type: 'manager', name: 'System Admin', email };
      } else {
        const found = SEED_EMPLOYEES.find(e => e.email === email);
        userObj = { type: 'employee', ...(found || SEED_EMPLOYEES[0]) };
      }
      onLogin(userObj);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 mb-6">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Provision</h1>
          <p className="text-slate-400 text-sm">Sign in to the Internal Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-900 border border-surface-600 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Work Email</label>
              <div className="relative border border-surface-500 hover:border-surface-400 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 rounded-lg overflow-hidden transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-800 text-white pl-10 pr-4 py-3 placeholder:text-slate-500 outline-none text-sm transition-colors focus:bg-surface-900"
                  placeholder="admin@acme.com or employee@acme.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium">Forgot?</a>
              </div>
              <div className="relative border border-surface-500 hover:border-surface-400 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 rounded-lg overflow-hidden transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-800 text-white pl-10 pr-4 py-3 placeholder:text-slate-500 outline-none text-sm transition-colors focus:bg-surface-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 active:scale-[0.98] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* SSO divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-600" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-surface-900 text-slate-500">Or continue with</span>
              </div>
            </div>
            
            <button className="mt-6 w-full border border-surface-600 hover:bg-surface-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google SSO
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          Authorized personnel only. Contact IT support for access issues.
        </p>
      </motion.div>
    </div>
  );
}
