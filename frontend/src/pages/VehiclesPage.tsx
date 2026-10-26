import React, { useState, useEffect } from 'react';
import {
  Car,
  Search,
  RefreshCw,
  Clock,
  History,
  X,
  User,
  Phone,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { ParkingSession, Vehicle } from '../types';

export const VehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // History Drawer / Modal
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [vehicleSessions, setVehicleSessions] = useState<ParkingSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const fetchVehicles = async (query?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.searchVehicles(query);
      setVehicles(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVehicles(searchQuery);
  };

  const handleViewHistory = async (v: Vehicle) => {
    setSelectedVehicle(v);
    try {
      setSessionsLoading(true);
      const sessions = await api.getVehicleSessions(v.vehicleId);
      setVehicleSessions(sessions);
    } catch (err) {
      console.error('Failed to load sessions', err);
    } finally {
      setSessionsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Registered Fleet & Vehicles
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Database Registry
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Search vehicle entity database and inspect complete lifecycle parking history
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plate or owner..."
              className="w-full glass-input pl-10 pr-4 font-mono font-bold"
            />
          </div>
          <button
            type="submit"
            className="btn-ethereal px-4 py-2 font-bold tracking-wide"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              fetchVehicles('');
            }}
            title="Reset"
            className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-200 hover:text-white hover:bg-violet-900/40 transition-all shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium shadow-glow-rose">
          {error}
        </div>
      )}

      {/* Vehicles Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-violet-950/60 border-b border-violet-500/20 text-violet-300/80 uppercase tracking-widest font-bold text-[10px]">
              <tr>
                <th className="px-5 py-4">Vehicle Number</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Owner Name</th>
                <th className="px-5 py-4">Phone Number</th>
                <th className="px-5 py-4">Parking Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/15">
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <tr key={v.vehicleId} className="hover:bg-violet-900/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-black text-white text-sm">
                      <span className="px-2 py-0.5 rounded-md bg-black/60 border border-violet-500/30 text-cyan-200">
                        {v.vehicleNumber}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          v.vehicleType === 'BIKE'
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                            : v.vehicleType === 'CAR'
                            ? 'bg-violet-500/15 text-violet-300 border-violet-500/30 shadow-[0_0_8px_rgba(139,92,246,0.2)]'
                            : 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30 shadow-[0_0_8px_rgba(217,70,239,0.2)]'
                        }`}
                      >
                        {v.vehicleType}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-white">
                      {v.ownerName}
                    </td>
                    <td className="px-5 py-4 font-mono text-violet-300/80">
                      {v.phoneNumber || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          v.currentlyParked
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            v.currentlyParked ? 'bg-rose-400' : 'bg-emerald-400'
                          } animate-pulse`}
                        ></span>
                        <span>{v.currentlyParked ? 'PARKED' : 'EXITED'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleViewHistory(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/80 text-violet-200 hover:text-white border border-violet-500/30 font-semibold transition-all hover:border-violet-400/50 shadow-sm"
                      >
                        <History className="w-3.5 h-3.5 text-cyan-400" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-violet-300/50 font-medium">
                    No vehicles found matching query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Session History Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="glass-panel border-violet-400/40 shadow-glow-md max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-violet-900 via-fuchsia-900 to-indigo-900 flex items-center justify-between text-white border-b border-violet-500/30">
              <div>
                <h3 className="font-display font-extrabold text-base flex items-center gap-2">
                  <Car className="w-5 h-5 text-cyan-300" />
                  <span>Parking Record: {selectedVehicle.vehicleNumber}</span>
                </h3>
                <p className="text-xs text-violet-200/80 font-medium mt-0.5">
                  Owner: {selectedVehicle.ownerName} • {selectedVehicle.vehicleType}
                </p>
              </div>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {sessionsLoading ? (
                <div className="text-center py-8 text-xs text-cyan-400">Loading history ledger...</div>
              ) : vehicleSessions.length > 0 ? (
                <div className="space-y-3">
                  {vehicleSessions.map((s) => (
                    <div
                      key={s.sessionId}
                      className="p-3.5 rounded-xl border border-violet-500/20 bg-violet-950/40 text-xs flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">Slot {s.slot.slotNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              s.status === 'ACTIVE'
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                        <p className="text-violet-300/70 text-[11px] font-mono">
                          Entry: {new Date(s.entryTime).toLocaleString()}
                        </p>
                        {s.exitTime && (
                          <p className="text-violet-300/70 text-[11px] font-mono">
                            Exit: {new Date(s.exitTime).toLocaleString()} ({s.duration || 1} hrs)
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-display font-black text-cyan-300 text-sm">
                          {s.parkingFee != null ? `₹${s.parkingFee.toFixed(2)}` : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-violet-300/50">
                  No parking sessions found for this vehicle.
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-violet-950/60 border-t border-violet-500/20 flex justify-end">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-violet-900/60 hover:bg-violet-800/80 rounded-xl border border-violet-500/30 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
