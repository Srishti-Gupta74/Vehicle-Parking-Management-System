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
  Sparkles,
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
            <span className="text-cyan-300 font-mono font-bold">{elapsedMins} min(s)</span>
            <span className="block text-[10px] text-violet-300/60 font-normal">Active Session</span>
          </div>
        );
      }
      const hrs = Math.floor(elapsedMins / 60);
      const mins = elapsedMins % 60;
      return (
        <div>
          <span className="text-cyan-300 font-mono font-bold">{hrs}h {mins}m</span>
          <span className="block text-[10px] text-violet-300/60 font-normal">Active Session</span>
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
        <span className="font-bold text-white font-mono">{exactText}</span>
        <span className="block text-[10px] text-violet-300/60 font-normal">
          Billed: {s.duration || 1} hr min.
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Parking Session Audit Ledger
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Audit Trail
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Searchable historical ledger, revenue records, time audit breakdown & instant slip reprints
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-200 hover:text-white hover:bg-violet-900/40 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-5 space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-3 items-center">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-cyan-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by vehicle plate, owner name, or slot..."
              className="w-full glass-input pl-10 pr-4 font-mono"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-wider">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="glass-input py-2 text-xs font-semibold"
            >
              <option value="ALL" className="bg-[#0e0722] text-white">All Statuses</option>
              <option value="ACTIVE" className="bg-[#0e0722] text-white">Active (Parked)</option>
              <option value="COMPLETED" className="bg-[#0e0722] text-white">Completed (Exited)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-wider">Class:</span>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="glass-input py-2 text-xs font-semibold"
            >
              <option value="ALL" className="bg-[#0e0722] text-white">All Classes</option>
              <option value="CAR" className="bg-[#0e0722] text-white">Car (FourWheeler)</option>
              <option value="BIKE" className="bg-[#0e0722] text-white">Bike (TwoWheeler)</option>
              <option value="TRUCK" className="bg-[#0e0722] text-white">Truck (Commercial)</option>
            </select>
          </div>

          {/* Sort Field */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-wider">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="glass-input py-2 text-xs font-semibold"
            >
              <option value="entryTime" className="bg-[#0e0722] text-white">Check-in Time</option>
              <option value="fee" className="bg-[#0e0722] text-white">Collected Fee</option>
              <option value="duration" className="bg-[#0e0722] text-white">Duration</option>
            </select>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-200 hover:text-white hover:bg-violet-900/40"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="submit"
            className="btn-ethereal px-4 py-2 font-bold"
          >
            Apply Filter
          </button>
        </form>

        <div className="text-[11px] text-violet-300/70 flex justify-between items-center pt-2 border-t border-violet-500/15">
          <span>Found {sortedSessions.length} matching parking sessions</span>
          <span className="font-mono text-cyan-300">Live MySQL 8.0 Ledger</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium shadow-glow-rose">
          {error}
        </div>
      )}

      {/* Ledger Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-violet-950/60 border-b border-violet-500/20 text-violet-300/80 uppercase tracking-widest font-bold text-[10px]">
              <tr>
                <th className="px-5 py-4">Session ID</th>
                <th className="px-5 py-4">Vehicle Plate & Owner</th>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Slot</th>
                <th className="px-5 py-4">Check-In</th>
                <th className="px-5 py-4">Check-Out</th>
                <th className="px-5 py-4">Duration</th>
                <th className="px-5 py-4">Tariff</th>
                <th className="px-5 py-4">State</th>
                <th className="px-5 py-4 text-right">Reprint Slips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/15">
              {sortedSessions.length > 0 ? (
                sortedSessions.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-violet-900/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-cyan-300/90 font-bold">#{s.sessionId}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono font-black text-white text-sm block">
                        {s.vehicle.vehicleNumber}
                      </span>
                      <span className="text-[11px] font-sans font-medium text-violet-300/70 block mt-0.5">
                        {s.vehicle.ownerName}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          s.vehicle.vehicleType === 'BIKE'
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : s.vehicle.vehicleType === 'CAR'
                            ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                            : 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30'
                        }`}
                      >
                        {s.vehicle.vehicleType}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-display font-black text-white">
                      {s.slot.slotNumber} <span className="text-[10px] font-mono font-normal text-violet-300/60">(F{s.slot.floor})</span>
                    </td>
                    <td className="px-5 py-4 text-violet-200/90 font-mono text-[11px]">
                      {new Date(s.entryTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-violet-200/90 font-mono text-[11px]">
                      {s.exitTime
                        ? new Date(s.exitTime).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {renderDuration(s)}
                    </td>
                    <td className="px-5 py-4 font-display font-black text-cyan-300 text-sm">
                      {s.parkingFee != null ? `₹${s.parkingFee.toFixed(2)}` : 'Pending'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                          s.status === 'ACTIVE'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'ACTIVE' ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`}></span>
                        <span>{s.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleViewTicket(s.sessionId)}
                        title="View Entry Ticket"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-violet-950/60 hover:bg-violet-900/80 text-violet-200 hover:text-white border border-violet-500/30 font-semibold text-[11px] transition-all"
                      >
                        <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Ticket</span>
                      </button>
                      {s.status === 'COMPLETED' && (
                        <button
                          onClick={() => handleViewReceipt(s.sessionId)}
                          title="View Tax Receipt"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 hover:text-white border border-emerald-500/30 font-semibold text-[11px] transition-all"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-violet-300/50">
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
