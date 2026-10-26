import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Grid,
  CarFront,
  CreditCard,
  Car,
  History,
  Settings2,
  FileText,
  LogOut,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Parking Grid', href: '/parking-lot', icon: Grid },
  { name: 'Park Vehicle', href: '/park', icon: CarFront },
  { name: 'Checkout Booth', href: '/checkout', icon: CreditCard },
  { name: 'Fleet & Vehicles', href: '/vehicles', icon: Car },
  { name: 'Parking Ledger', href: '/history', icon: History },
  { name: 'Slot Matrix', href: '/slots', icon: Settings2 },
  { name: 'Reports & Export', href: '/reports', icon: FileText },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#090518]/90 backdrop-blur-2xl text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-violet-500/20 relative z-20 shadow-[4px_0_30px_rgba(0,0,0,0.5)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-violet-500/15 flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-sm opacity-70 animate-pulse"></div>
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center shadow-lg border border-white/20">
            <CarFront className="w-6 h-6 text-white" />
          </div>
        </div>

        <div>
          <h1 className="flex items-center gap-2">
            <span className="font-display font-black text-lg tracking-wider bg-gradient-to-r from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">
              VPMS
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-400/40 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
              PRO
            </span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
            <span className="text-[11px] text-violet-300/80 font-medium tracking-wide">Ethereal OS • OOP</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2.5 text-[10px] font-black tracking-widest text-violet-400/70 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Core Modules</span>
        </div>

        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 text-white shadow-glow-sm border-violet-400/40 translate-x-1'
                  : 'text-violet-200/60 hover:text-white hover:bg-violet-900/30 hover:border-violet-500/25 border-transparent'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            <span className="tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User & Logout Footer */}
      <div className="p-4 border-t border-violet-500/15 bg-[#060312]/95 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3 p-2 rounded-xl bg-violet-950/40 border border-violet-500/20">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-glow-sm">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-medium">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>ADMIN VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-violet-300/80 bg-violet-950/30 hover:bg-rose-950/50 hover:text-rose-200 hover:border-rose-500/40 rounded-xl border border-violet-500/20 transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
