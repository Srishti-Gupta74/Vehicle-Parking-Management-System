import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarFront, ShieldCheck, AlertCircle, ArrowRight, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@parking.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@parking.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#070414] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Decorative background ambient glows */}
      <div className="absolute top-1/4 -left-40 w-[550px] h-[550px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 -right-40 w-[550px] h-[550px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-3/4 left-1/3 w-[450px] h-[450px] bg-fuchsia-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 rounded-3xl blur-md opacity-80 animate-pulse"></div>
            <div className="relative w-16 h-16 rounded-2xl bg-[#120a2a] text-white flex items-center justify-center shadow-2xl border border-white/20">
              <CarFront className="w-9 h-9 text-cyan-300" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white">
            <span className="bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
              VPMS Pro Command Portal
            </span>
          </h1>
          <p className="text-violet-300/80 text-xs mt-1.5 font-medium tracking-wide flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSC2104 Object Oriented Programming • Enterprise System</span>
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-7 sm:p-8 shadow-2xl border-violet-500/30 shadow-glow-sm">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-violet-500/15">
            <div>
              <h2 className="text-sm font-display font-bold text-white tracking-wide">Administrator Access</h2>
              <p className="text-[11px] text-violet-300/60">Authenticate to control parking bays & telemetry</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-200 text-[11px] font-semibold flex items-center gap-1 shadow-glow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 shadow-glow-rose">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parking.com"
                className="w-full glass-input"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 btn-ethereal py-3 px-4 flex items-center justify-center gap-2 text-xs font-bold tracking-wider uppercase shadow-glow-md"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-5 pt-4 border-t border-violet-500/15 flex items-center justify-between text-xs">
            <span className="text-violet-300/60 text-[11px] font-mono">admin@parking.com</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-cyan-300 hover:text-cyan-200 font-semibold text-[11px] flex items-center gap-1 transition-colors hover:underline"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Autofill Demo Login</span>
            </button>
          </div>
        </div>

        {/* Syllabus Footer */}
        <div className="text-center mt-6 text-[11px] text-violet-300/50">
          Backend Architecture: Spring Boot 3 • MySQL 8 • Java 21 OOP Engine
        </div>
      </div>
    </div>
  );
};
