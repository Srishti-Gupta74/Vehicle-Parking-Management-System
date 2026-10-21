import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  Ticket,
  Receipt,
  ArrowUpDown,
  Calendar,
} from 'lucide-react';
import { api } from '../services/api';
import { ParkingReceipt, ParkingSession, ParkingTicket } from '../types';
import { TicketModal } from '../components/TicketModal';
import { ReceiptModal } from '../components/ReceiptModal';

export const ParkingHistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<ParkingSession[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [vehicleType, setVehicleType] = useState('ALL');
  const [sortField, setSortField] = useState<'entryTime' | 'fee' | 'duration'>('entryTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [ticketModalData, setTicketModalData] = useState<ParkingTicket | null>(null);
  const [receiptModalData, setReceiptModalData] = useState<ParkingReceipt | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getParkingHistory(search, status, vehicleType);
      setSessions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [status, vehicleType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory();
  };

  const handleViewTicket = async (sessionId: number) => {
    try {
      const ticket = await api.getTicket(sessionId);
      setTicketModalData(ticket);
    } catch (err: any) {
      alert('Failed to load ticket: ' + err.message);
    }
  };

  const handleViewReceipt = async (sessionId: number) => {
    try {
      const receipt = await api.getReceipt(sessionId);
      setReceiptModalData(receipt);
    } catch (err: any) {
      alert('Failed to load receipt: ' + err.message);
    }
  };

  // Sorting
  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortField === 'entryTime') {
      const dateA = new Date(a.entryTime).getTime();
      const dateB = new Date(b.entryTime).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    }
    if (sortField === 'fee') {
      const feeA = a.parkingFee || 0;
      const feeB = b.parkingFee || 0;
      return sortOrder === 'desc' ? feeB - feeA : feeA - feeB;
    }
    if (sortField === 'duration') {
      const durA = a.duration || 0;
      const durB = b.duration || 0;
      return sortOrder === 'desc' ? durB - durA : durA - durB;
    }
    return 0;
  });

  const renderDuration = (s: ParkingSession) => {
    if (s.status === 'ACTIVE' || !s.exitTime) {
      const start = new Date(s.entryTime).getTime();
      const elapsedMins = Math.max(1, Math.round((Date.now() - start) / 60000));
      if (elapsedMins < 60) {
        return (
          <div>
            <span className="text-amber-600 font-bold">{elapsedMins} min(s)</span>
            <span className="block text-[10px] text-slate-400 font-normal">In Progress</span>
          </div>
        );
      }
      const hrs = Math.floor(elapsedMins / 60);
      const mins = elapsedMins % 60;
      return (
        <div>
          <span className="text-amber-600 font-bold">{hrs}h {mins}m</span>
          <span className="block text-[10px] text-slate-400 font-normal">In Progress</span>
        </div>
      );
    }

    const start = new Date(s.entryTime).getTime();
    const end = new Date(s.exitTime).getTime();
    const diffMins = Math.max(1, Math.round((end - start) / 60000));

    let exactText = '';
    if (diffMins < 60) {
      exactText = `${diffMins} min${diffMins === 1 ? '' : 's'}`;
    } else {
      const hrs = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      exactText = mins === 0 ? `${hrs} hr(s)` : `${hrs}h ${mins}m`;
    }

    return (
      <div>
        <span className="font-bold text-slate-900">{exactText}</span>
        <span className="block text-[10px] text-slate-400 font-normal">
          Billed: {s.duration || 1} hr min.
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Parking Session Audit History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full audit logs of all active and completed parking operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchHistory}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plate, owner, or slot..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Filter
          </button>
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          {/* Vehicle Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Type:</span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Types</option>
              <option value="BIKE">BIKE</option>
              <option value="CAR">CAR</option>
              <option value="TRUCK">TRUCK</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="entryTime">Entry Time</option>
              <option value="fee">Parking Fee</option>
              <option value="duration">Duration</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Vehicle</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Slot</th>
                <th className="px-5 py-3.5">Entry Time</th>
                <th className="px-5 py-3.5">Exit Time</th>
                <th className="px-5 py-3.5">Duration</th>
                <th className="px-5 py-3.5">Fee</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSessions.length > 0 ? (
                sortedSessions.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-slate-400">#{s.sessionId}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {s.vehicle.vehicleNumber}
                      <span className="block text-[11px] font-sans font-normal text-slate-500">
                        {s.vehicle.ownerName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.vehicle.vehicleType === 'BIKE'
                            ? 'bg-blue-50 text-blue-700'
                            : s.vehicle.vehicleType === 'CAR'
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {s.vehicle.vehicleType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800">
                      {s.slot.slotNumber} (F{s.slot.floor})
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {new Date(s.entryTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">
                      {s.exitTime
                        ? new Date(s.exitTime).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {renderDuration(s)}
                    </td>
                    <td className="px-5 py-3.5 font-black text-slate-900 text-sm">
                      {s.parkingFee != null ? `₹${s.parkingFee.toFixed(2)}` : 'Pending'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          s.status === 'ACTIVE'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleViewTicket(s.sessionId)}
                        title="View Entry Ticket"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] transition-colors"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Ticket</span>
                      </button>
                      {s.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleViewReceipt(s.sessionId)}
                          title="View Tax Receipt"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] transition-colors"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-slate-400">
                    No parking sessions found matching current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TicketModal ticket={ticketModalData} onClose={() => setTicketModalData(null)} />
      <ReceiptModal receipt={receiptModalData} onClose={() => setReceiptModalData(null)} />
    </div>
  );
};
