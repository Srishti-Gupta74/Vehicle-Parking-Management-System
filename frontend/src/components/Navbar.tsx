import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Clock, CheckCircle } from 'lucide-react';
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
    <header className="h-16 bg-white border-b border-purple-100/90 px-6 flex items-center justify-between shrink-0 shadow-[0_2px_12px_rgba(147,51,234,0.03)]">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-purple-600/80 font-medium">{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3.5">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50/70 text-purple-900 text-xs font-semibold border border-purple-200/60 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-purple-600" />
          <span>{currentTime}</span>
        </div>

        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Online & Synced</span>
        </div>

        {/* Quick Action: Park Vehicle */}
        <button
          onClick={() => navigate('/park')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all duration-150 hover:shadow-lg hover:shadow-purple-600/30 active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Park Vehicle</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-purple-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-fuchsia-100 text-purple-700 font-extrabold text-xs flex items-center justify-center border border-purple-200 shadow-inner">
            {user?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};
