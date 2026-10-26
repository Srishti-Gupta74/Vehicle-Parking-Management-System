import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Grid,
  CheckCircle2,
  Clock,
  IndianRupee,
  Activity,
  ArrowUpRight,
  PlusCircle,
  CreditCard,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '../services/api';
import { DashboardStats } from '../types';

const COLORS = ['#8b5cf6', '#d946ef', '#06b6d4', '#10b981'];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboard();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto refresh every 20 seconds
    const interval = setInterval(fetchStats, 20000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-600/30 rounded-full blur-xl animate-pulse"></div>
            <RefreshCw className="w-8 h-8 animate-spin text-fuchsia-400 relative z-10" />
          </div>
          <p className="text-xs font-semibold text-violet-300 tracking-wider">Connecting to Spring Boot REST API...</p>
        </div>
      </div>
    );
  }

  const pieData = stats?.vehicleTypeDistribution
    ? Object.entries(stats.vehicleTypeDistribution).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Quick Actions */}
      <div className="glass-panel p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Facility Command Center
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>LIVE</span>
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Real-time occupancy tracking, dynamic fee computation, and continuous telemetry
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            title="Refresh Live Data"
            className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-200 hover:text-white hover:bg-violet-900/40 hover:border-violet-400/50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/park')}
            className="btn-ethereal flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide"
          >
            <PlusCircle className="w-4 h-4 text-cyan-300" />
            <span>Park Vehicle</span>
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="btn-emerald-glow flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide"
          >
            <CreditCard className="w-4 h-4 text-emerald-200" />
            <span>Checkout</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium shadow-glow-rose">
          {error}
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Slots */}
        <div className="glass-panel-interactive p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest">Total Slots</span>
            <div className="p-2 rounded-xl bg-violet-500/15 text-violet-300 border border-violet-500/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
              <Grid className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-display font-black text-white">{stats?.totalSlots ?? 0}</span>
            <span className="text-[11px] text-violet-300/60 block mt-0.5">Capacity across bays</span>
          </div>
        </div>

        {/* Available Slots */}
        <div className="glass-panel-interactive p-4 flex flex-col justify-between border-emerald-500/25 hover:border-emerald-400/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-widest">Available</span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-display font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {stats?.availableSlots ?? 0}
            </span>
            <span className="text-[11px] text-emerald-300/60 block mt-0.5">Ready for entry</span>
          </div>
        </div>

        {/* Occupied Slots */}
        <div className="glass-panel-interactive p-4 flex flex-col justify-between border-rose-500/25 hover:border-rose-400/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-400/80 uppercase tracking-widest">Occupied</span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.25)]">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-display font-black text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
              {stats?.occupiedSlots ?? 0}
            </span>
            <span className="text-[11px] text-rose-300/60 block mt-0.5">
              {stats?.occupancyRatePercentage ?? 0}% occupancy
            </span>
          </div>
        </div>

        {/* Vehicles Parked Today */}
        <div className="glass-panel-interactive p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest">Parked Today</span>
            <div className="p-2 rounded-xl bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_10px_rgba(217,70,239,0.2)]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-display font-black text-white">{stats?.vehiclesParkedToday ?? 0}</span>
            <span className="text-[11px] text-violet-300/60 block mt-0.5">Sessions logged</span>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="glass-panel-interactive p-4 flex flex-col justify-between border-cyan-500/25 hover:border-cyan-400/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-400/80 uppercase tracking-widest">Active Parked</span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-display font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              {stats?.activeSessions ?? 0}
            </span>
            <span className="text-[11px] text-cyan-300/60 block mt-0.5">Inside bays</span>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="glass-panel-interactive p-4 flex flex-col justify-between border-violet-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest">Today Revenue</span>
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 text-fuchsia-300 border border-violet-500/40">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl md:text-3xl font-display font-black bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              ₹{stats?.todayRevenue?.toFixed(0) ?? 0}
            </span>
            <span className="text-[11px] text-violet-300/60 block mt-0.5">
              Total: ₹{stats?.totalRevenue?.toFixed(0) ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Over Time (Area Chart) */}
        <div className="lg:col-span-2 glass-panel p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm md:text-base font-display font-bold text-white tracking-wide">
                7-Day Revenue Velocity
              </h3>
              <p className="text-[11px] text-violet-300/70">Daily parking collections in INR (₹)</p>
            </div>
            <div className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-xl border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>SQL Aggregation</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {stats?.weeklyRevenue && stats.weeklyRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="etherealRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#d946ef" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#25164a" vertical={false} />
                  <XAxis dataKey="date" stroke="#a78bfa" fontSize={11} tickLine={false} />
                  <YAxis stroke="#a78bfa" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 8, 35, 0.95)',
                      backdropFilter: 'blur(16px)',
                      borderColor: 'rgba(139, 92, 246, 0.4)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                    }}
                    formatter={(val: any) => [`₹${Number(val || 0).toFixed(2)}`, 'Revenue']}
                    labelStyle={{ fontWeight: 'bold', color: '#c084fc' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c084fc"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#etherealRevenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-violet-300/50">
                No revenue records captured for past 7 days.
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Type Distribution (Pie Chart) */}
        <div className="glass-panel p-5 md:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm md:text-base font-display font-bold text-white tracking-wide">
              Vehicle Distribution
            </h3>
            <p className="text-[11px] text-violet-300/70">Breakdown by OOP subclass (Car, Bike, Truck)</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 8, 35, 0.95)',
                      backdropFilter: 'blur(16px)',
                      borderColor: 'rgba(139, 92, 246, 0.4)',
                      borderRadius: '12px',
                      color: '#ffffff',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span className="text-xs font-semibold text-violet-200">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-violet-300/50">No vehicle data recorded yet.</div>
            )}
          </div>

          <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-500/20 text-[11px] text-violet-300/80">
            <span className="font-bold text-white block">OOP Model:</span>
            Polymorphic instances deriving from abstract <code>Vehicle.java</code>
          </div>
        </div>
      </div>

      {/* Activity and Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 glass-panel p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-violet-500/15">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm md:text-base font-display font-bold text-white tracking-wide">
                Live Audit Activity Feed
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-violet-300/60">Persistent in MySQL Ledger</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              stats.recentActivities.map((act) => (
                <div
                  key={act.logId}
                  className="flex items-start justify-between gap-3 p-3 rounded-xl bg-violet-950/30 hover:bg-violet-950/60 transition-all border border-violet-500/20"
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 mt-0.5 border ${
                        act.activityType === 'PARK'
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/40 shadow-[0_0_8px_rgba(139,92,246,0.2)]'
                          : act.activityType === 'CHECKOUT'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-700/30 text-slate-300 border-slate-600/40'
                      }`}
                    >
                      {act.activityType}
                    </span>
                    <p className="text-xs text-violet-100 font-medium leading-relaxed">{act.description}</p>
                  </div>
                  <span className="text-[10px] text-violet-300/50 shrink-0 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-violet-300/50">No recent activity logs found.</div>
            )}
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="glass-panel p-5 md:p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm md:text-base font-display font-bold text-white tracking-wide">
              Quick Portals
            </h3>
            <p className="text-[11px] text-violet-300/70 mt-0.5">Shortcuts for viva presentation & navigation</p>

            <div className="space-y-2.5 mt-4">
              <button
                onClick={() => navigate('/parking-lot')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-violet-500/20 bg-violet-950/20 hover:bg-violet-900/40 hover:border-violet-400/50 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-white block">Visual Parking Grid</span>
                    <span className="text-[11px] text-violet-300/60">2D matrix spatial floorplan</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/history')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-violet-500/20 bg-violet-950/20 hover:bg-violet-900/40 hover:border-violet-400/50 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-white block">Audit Parking Ledger</span>
                    <span className="text-[11px] text-violet-300/60">Filter, search & print slips</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/reports')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-900/30 hover:border-emerald-400/50 transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-white block">Export & Reports</span>
                    <span className="text-[11px] text-emerald-300/60">File I/O & binary snapshots</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-500/20 text-[11px] text-violet-200/80">
            <span className="font-bold text-white block">Multithreaded Daemon:</span>
            <code>ParkingSlotMonitorThread</code> runs continuously in the Spring Boot JVM.
          </div>
        </div>
      </div>
    </div>
  );
};
