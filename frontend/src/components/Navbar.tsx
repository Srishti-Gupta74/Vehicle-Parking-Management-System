import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  title: string;
  subtitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#090518]/80 backdrop-blur-xl border-b border-violet-500/20 px-6 flex items-center justify-between shrink-0 shadow-[0_4px_24px_rgba(0,0,0,0.4)] sticky top-0 z-30">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-base md:text-lg font-display font-extrabold text-white tracking-wide leading-tight flex items-center gap-2">
          <span>{title}</span>
        </h2>
        {subtitle && <p className="text-xs text-violet-300/75 font-medium mt-0.5">{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-950/40 text-violet-200 text-xs font-semibold border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.15)]">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">{currentTime}</span>
        </div>

        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 text-emerald-300 text-xs font-semibold border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
          <span className="tracking-wide">Online & Synced</span>
        </div>

        {/* Quick Action: Park Vehicle */}
        <button
          onClick={() => navigate('/park')}
          className="btn-ethereal flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-wide"
        >
          <PlusCircle className="w-4 h-4 text-cyan-300" />
          <span>Park Vehicle</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center pl-2 border-l border-violet-500/20">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur-[2px] opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative w-8 h-8 rounded-full bg-[#140b2e] text-cyan-200 font-extrabold text-xs flex items-center justify-center border border-white/20 shadow-inner">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
