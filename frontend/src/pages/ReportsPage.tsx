import React, { useState, useEffect } from 'react';
import {
  FileText,
  IndianRupee,
  Car,
  HardDrive,
  RefreshCw,
  CheckCircle2,
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
        ? 'Audit report (parking_history.txt) generated and downloaded successfully!'
        : 'System data backup (parking_backup.dat) generated and downloaded successfully!'
    );
    setTimeout(() => setExportNotice(null), 6000);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Audit Reports & File Exports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical compilation, financial audit summaries, and automated system exports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchReport}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>

          {/* Export Button 1: Text Report */}
          <button
            onClick={() => triggerDownload('txt')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export Text Report (.txt)</span>
          </button>

          {/* Export Button 2: Binary Backup */}
          <button
            onClick={() => triggerDownload('backup')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <HardDrive className="w-4 h-4" />
            <span>Export Binary Backup (.dat)</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Revenue Collected
          </span>
          <span className="text-2xl font-black text-indigo-600 mt-2 block">
            ₹{report?.totalRevenue?.toFixed(2) ?? '0.00'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Avg per session: ₹{report?.averageFee?.toFixed(2) ?? '0.00'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Sessions Handled
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 block">
            {report?.totalSessions ?? 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {report?.activeSessions ?? 0} active • {report?.completedSessions ?? 0} completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Registered Vehicles
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 block">
            {report?.totalVehicles ?? 0}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            In database table
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Average Parking Duration
          </span>
          <span className="text-2xl font-black text-slate-900 mt-2 block">
            {report?.averageDurationHours ?? 0} hrs
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Occupancy rate: {report?.occupancyRate ?? 0}%
          </span>
        </div>
      </div>

      {/* Revenue & Distribution Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Vehicle Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-indigo-600" />
              <span>Revenue by Vehicle Category</span>
            </h3>
          </div>

          <div className="space-y-3">
            {report?.revenueByType &&
              Object.entries(report.revenueByType).map(([type, amount]) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        type === 'BIKE'
                          ? 'bg-blue-100 text-blue-800'
                          : type === 'CAR'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {type}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {report.vehicleCountsByType[type] || 0} vehicle(s)
                    </span>
                  </div>
                  <span className="font-extrabold text-slate-900 text-sm">
                    ₹{amount.toFixed(2)}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Sessions by Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              <span>Transactions by Payment Mode</span>
            </h3>
          </div>

          <div className="space-y-3">
            {report?.sessionsByPaymentMethod &&
              Object.entries(report.sessionsByPaymentMethod).map(([method, count]) => (
                <div
                  key={method}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <span className="font-bold text-slate-800">{method}</span>
                  <span className="px-3 py-1 rounded-full font-bold text-slate-700 bg-white border border-slate-200">
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
