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
  { name: 'Parking Lot', href: '/parking-lot', icon: Grid },
  { name: 'Park Vehicle', href: '/park', icon: CarFront },
  { name: 'Checkout', href: '/checkout', icon: CreditCard },
  { name: 'Vehicles', href: '/vehicles', icon: Car },
  { name: 'Parking History', href: '/history', icon: History },
  { name: 'Slot Management', href: '/slots', icon: Settings2 },
  { name: 'Reports & Export', href: '/reports', icon: FileText },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#130b24] text-slate-100 flex flex-col shrink-0 min-h-screen border-r border-purple-950/60">
      {/* Brand Header */}
      <div className="p-5 border-b border-purple-950/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-purple-600/30">
          <CarFront className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wide text-white flex items-center gap-1.5">
            <span>VPMS</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              PRO
            </span>
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-purple-300/80 font-medium">Smart Parking System</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-purple-400/70 uppercase">
          Navigation
        </div>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30 translate-x-0.5'
                  : 'text-purple-200/70 hover:bg-purple-900/40 hover:text-white'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User & Logout Footer */}
      <div className="p-4 border-t border-purple-950/80 bg-[#0d071a]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/30 to-fuchsia-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/40">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <div className="flex items-center gap-1 text-[10px] text-purple-300/70">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>ACTIVE ADMIN</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-purple-200/80 bg-purple-950/60 hover:bg-rose-950/50 hover:text-rose-200 rounded-xl border border-purple-900/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
