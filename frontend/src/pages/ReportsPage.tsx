import React, { useState, useEffect } from 'react';
import {
  FileText,
  IndianRupee,
  Car,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  Download,
} from 'lucide-react';
import { api } from '../services/api';
import { ReportSummary } from '../types';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReports();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch report summary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const triggerDownload = (type: 'txt' | 'backup') => {
    const url = api.getExportUrl(type);
    window.location.href = url;
    setExportNotice(
      type === 'txt'
        ? 'Audit report (parking_history.txt) generated & downloaded via Java File I/O!'
        : 'System snapshot (parking_backup.dat) generated & downloaded via Java Serialization!'
    );
    setTimeout(() => setExportNotice(null), 6000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Intelligence, File I/O & Snapshots
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Java Streams
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Financial analytics compilation, file stream audit exports, and Java object serialization backups
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchReport}
            className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-200 hover:text-white hover:bg-violet-900/40 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Export Button 1: Text Report */}
          <button
            onClick={() => triggerDownload('txt')}
            className="btn-ethereal flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide shadow-glow-sm"
          >
            <Download className="w-4 h-4 text-cyan-300" />
            <span>Export Text Report (.txt)</span>
          </button>

          {/* Export Button 2: Binary Backup */}
          <button
            onClick={() => triggerDownload('backup')}
            className="btn-emerald-glow flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide shadow-glow-emerald"
          >
            <HardDrive className="w-4 h-4 text-emerald-200" />
            <span>Export Binary Backup (.dat)</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2.5 shadow-glow-emerald">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium shadow-glow-rose">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel-interactive p-5">
          <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest block">
            Total Revenue Collected
          </span>
          <span className="text-2xl md:text-3xl font-display font-black bg-gradient-to-r from-white via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent mt-2 block">
            ₹{report?.totalRevenue?.toFixed(2) ?? '0.00'}
          </span>
          <span className="text-[11px] text-violet-300/60 mt-1 block font-mono">
            Avg / session: ₹{report?.averageFee?.toFixed(2) ?? '0.00'}
          </span>
        </div>

        <div className="glass-panel-interactive p-5">
          <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest block">
            Total Sessions Handled
          </span>
          <span className="text-2xl md:text-3xl font-display font-black text-white mt-2 block">
            {report?.totalSessions ?? 0}
          </span>
          <span className="text-[11px] text-violet-300/60 mt-1 block">
            {report?.activeSessions ?? 0} active • {report?.completedSessions ?? 0} completed
          </span>
        </div>

        <div className="glass-panel-interactive p-5">
          <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest block">
            Registered Vehicles
          </span>
          <span className="text-2xl md:text-3xl font-display font-black text-white mt-2 block">
            {report?.totalVehicles ?? 0}
          </span>
          <span className="text-[11px] text-cyan-300/80 mt-1 block font-mono">
            MySQL Entity Tables
          </span>
        </div>

        <div className="glass-panel-interactive p-5">
          <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest block">
            Average Parking Duration
          </span>
          <span className="text-2xl md:text-3xl font-display font-black text-white mt-2 block">
            {report?.averageDurationHours ?? 0} hrs
          </span>
          <span className="text-[11px] text-emerald-400 mt-1 block font-semibold">
            Occupancy rate: {report?.occupancyRate ?? 0}%
          </span>
        </div>
      </div>

      {/* Revenue & Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Vehicle Category */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-violet-500/15">
            <h3 className="text-sm md:text-base font-display font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>Revenue by Vehicle Category</span>
            </h3>
          </div>

          <div className="space-y-3">
            {report?.revenueByType &&
              Object.entries(report.revenueByType).map(([type, amount]) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        type === 'BIKE'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : type === 'CAR'
                          ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                          : 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30'
                      }`}
                    >
                      {type}
                    </span>
                    <span className="font-semibold text-white">
                      {report.vehicleCountsByType[type] || 0} vehicle(s)
                    </span>
                  </div>
                  <span className="font-display font-black text-cyan-300 text-sm">
                    ₹{amount.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Sessions by Payment Method */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-violet-500/15">
            <h3 className="text-sm md:text-base font-display font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" />
              <span>Settlements by Payment Instrument</span>
            </h3>
          </div>

          <div className="space-y-3">
            {report?.sessionsByPaymentMethod &&
              Object.entries(report.sessionsByPaymentMethod).map(([method, count]) => (
                <div
                  key={method}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/20 text-xs"
                >
                  <span className="font-bold text-white">{method}</span>
                  <span className="px-3 py-1 rounded-full font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 shadow-glow-emerald">
                    {count} transactions
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
