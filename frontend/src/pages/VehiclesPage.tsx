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
      <div className="bg-white p-5 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Registered Vehicles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search vehicle database and inspect lifecycle parking records
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plate or owner name..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-purple-200/90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-purple-500/25 transition-all"
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
            className="p-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/50 border-b border-purple-100/80 text-purple-900/70 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Vehicle Number</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Owner Details</th>
                <th className="px-5 py-3.5">Phone Number</th>
                <th className="px-5 py-3.5">Parking Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/50">
              {vehicles.length > 0 ? (
                vehicles.map((v) => (
                  <tr key={v.vehicleId} className="hover:bg-purple-50/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {v.vehicleNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          v.vehicleType === 'BIKE'
                            ? 'bg-violet-50 text-violet-700 border border-violet-200'
                            : v.vehicleType === 'CAR'
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {v.vehicleType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{v.ownerName}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">{v.phoneNumber}</td>
                    <td className="px-5 py-3.5">
                      {v.currentlyParked ? (
                        <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 w-fit">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span className="font-bold">Parked in {v.currentSlotNumber}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium">Not Parked</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleViewHistory(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold transition-colors"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>History</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-purple-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-700 flex items-center justify-between text-white">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  <span>Parking Record: {selectedVehicle.vehicleNumber}</span>
                </h3>
                <p className="text-xs text-purple-200">
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
                <div className="text-center py-8 text-xs text-purple-600">Loading history...</div>
              ) : vehicleSessions.length > 0 ? (
                <div className="space-y-3">
                  {vehicleSessions.map((s) => (
                    <div
                      key={s.sessionId}
                      className="p-3.5 rounded-xl border border-purple-100 bg-purple-50/30 text-xs flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Slot {s.slot.slotNumber}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.status === 'ACTIVE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Entry: {new Date(s.entryTime).toLocaleString()}
                        </p>
                        {s.exitTime && (
                          <p className="text-slate-500 text-[11px]">
                            Exit: {new Date(s.exitTime).toLocaleString()} ({s.duration || 1} hrs)
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="font-black text-purple-900 text-sm">
                          ₹{s.parkingFee ? s.parkingFee.toFixed(2) : 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No parking sessions found for this vehicle.
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-purple-50/40 border-t border-purple-100 flex justify-end">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="px-4 py-2 text-xs font-semibold text-purple-900 hover:text-purple-950 bg-white rounded-xl border border-purple-200"
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
