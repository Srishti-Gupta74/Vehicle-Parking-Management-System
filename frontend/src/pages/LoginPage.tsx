import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarFront, ShieldCheck, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-[#120a21] via-[#1a0e33] to-[#0c0517] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-600/40 mb-4 border border-purple-400/30">
            <CarFront className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Vehicle Parking Management
          </h1>
          <p className="text-purple-300/80 text-xs mt-1.5 font-medium">
            CSC2104 Object Oriented Programming in Java • Mini-Project
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#180e2e]/90 backdrop-blur-md rounded-2xl p-7 shadow-2xl border border-purple-900/50">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-purple-900/50">
            <div>
              <h2 className="text-sm font-bold text-white">Administrator Access</h2>
              <p className="text-[11px] text-purple-300/60">Sign in to manage parking facility & slots</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@parking.com"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e071c]/80 border border-purple-900/60 text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-200/90 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0e071c]/80 border border-purple-900/60 text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-5 pt-4 border-t border-purple-900/50 flex items-center justify-between text-xs">
            <span className="text-purple-300/60 text-[11px]">Demo: admin@parking.com</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-purple-400 hover:text-purple-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
            >
              <KeyRound className="w-3 h-3" />
              <span>Autofill Demo Login</span>
            </button>
          </div>
        </div>

        {/* Syllabus Footer */}
        <div className="text-center mt-6 text-[11px] text-purple-400/60">
          Backend Architecture: Spring Boot • MySQL 8 • Java OOP Business Logic
        </div>
      </div>
    </div>
  );
};
