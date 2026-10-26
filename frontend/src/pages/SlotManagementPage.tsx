import React, { useState, useEffect } from 'react';
import {
  Settings2,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Car,
  Bike,
  Truck,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { ParkingSlot } from '../types';
import { AddSlotModal } from '../components/AddSlotModal';

export const SlotManagementPage: React.FC = () => {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [filterFloor, setFilterFloor] = useState('ALL');

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSlots();
      setSlots(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSlotAdded = (newSlot: ParkingSlot) => {
    setSlots((prev) => [...prev, newSlot]);
    setSuccess(`Slot ${newSlot.slotNumber} created successfully!`);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleDeleteSlot = async (slot: ParkingSlot) => {
    if (slot.status === 'OCCUPIED') {
      setError(`Cannot delete slot ${slot.slotNumber} because it is currently OCCUPIED! Please checkout the vehicle first.`);
      setTimeout(() => setError(null), 5000);
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete slot ${slot.slotNumber} (Floor ${slot.floor})?`
    );
    if (!confirmed) return;

    try {
      await api.deleteSlot(slot.slotId);
      setSlots((prev) => prev.filter((s) => s.slotId !== slot.slotId));
      setSuccess(`Slot ${slot.slotNumber} deleted successfully.`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete slot');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleToggleStatus = async (slot: ParkingSlot) => {
    const nextStatus = slot.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE';
    try {
      const updated = await api.updateSlotStatus(slot.slotId, nextStatus);
      setSlots((prev) => prev.map((s) => (s.slotId === slot.slotId ? updated : s)));
      setSuccess(`Slot ${slot.slotNumber} marked as ${nextStatus}.`);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle slot status');
      setTimeout(() => setError(null), 5000);
    }
  };

  const filteredSlots = slots.filter((s) => {
    if (filterType !== 'ALL' && s.slotType !== filterType) return false;
    if (filterFloor !== 'ALL' && s.floor.toString() !== filterFloor) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Slot Configuration Matrix
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Topology
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Configure parking slot capacities, subclass allowances, and multi-floor geometry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSlots}
            className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-200 hover:text-white hover:bg-violet-900/40 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-ethereal flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide"
          >
            <Plus className="w-4 h-4 text-cyan-300" />
            <span>Add New Slot</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2 shadow-glow-rose">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 shadow-glow-emerald">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          {/* Floor selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-wider">Floor:</span>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="glass-input py-1.5 text-xs font-semibold"
            >
              <option value="ALL" className="bg-[#0e0722] text-white">All Floors</option>
              <option value="1" className="bg-[#0e0722] text-white">Floor 1</option>
              <option value="2" className="bg-[#0e0722] text-white">Floor 2</option>
            </select>
          </div>

          {/* Type selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-wider">Class:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="glass-input py-1.5 text-xs font-semibold"
            >
              <option value="ALL" className="bg-[#0e0722] text-white">All Compatible Classes</option>
              <option value="CAR" className="bg-[#0e0722] text-white">Car (FourWheeler)</option>
              <option value="BIKE" className="bg-[#0e0722] text-white">Bike (TwoWheeler)</option>
              <option value="TRUCK" className="bg-[#0e0722] text-white">Truck (Commercial)</option>
            </select>
          </div>
        </div>

        <div className="text-violet-300/70 font-mono text-[11px]">
          Showing {filteredSlots.length} of {slots.length} total slots
        </div>
      </div>

      {/* Slots Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-violet-950/60 border-b border-violet-500/20 text-violet-300/80 uppercase tracking-widest font-bold text-[10px]">
              <tr>
                <th className="px-5 py-4">Slot Number</th>
                <th className="px-5 py-4">Compatible Class</th>
                <th className="px-5 py-4">Floor</th>
                <th className="px-5 py-4">Current Status</th>
                <th className="px-5 py-4">Occupant</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/15">
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => {
                  const isOccupied = slot.status === 'OCCUPIED';
                  return (
                    <tr key={slot.slotId} className="hover:bg-violet-900/20 transition-colors">
                      <td className="px-5 py-4 font-display font-black text-white text-base">
                        {slot.slotNumber}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            slot.slotType === 'BIKE'
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : slot.slotType === 'CAR'
                              ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                              : 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30'
                          }`}
                        >
                          {slot.slotType}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-violet-200">
                        Floor {slot.floor}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                            isOccupied
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isOccupied ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`}></span>
                          <span>{slot.status}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono">
                        {isOccupied ? (
                          <span className="font-bold text-white px-2 py-0.5 rounded bg-black/60 border border-violet-500/30">
                            {slot.currentVehicleNumber || 'Occupied'}
                          </span>
                        ) : (
                          <span className="text-violet-300/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(slot)}
                          className="px-3 py-1.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/80 text-violet-200 hover:text-white font-semibold text-[11px] transition-all border border-violet-500/30 hover:border-violet-400/50"
                        >
                          Toggle State
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot)}
                          title={isOccupied ? 'Cannot delete occupied slot' : 'Delete slot'}
                          className={`p-2 rounded-xl transition-all ${
                            isOccupied
                              ? 'text-violet-500/40 cursor-not-allowed'
                              : 'text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 hover:border hover:border-rose-500/40'
                          }`}
                        >
                          <Trash2 className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-violet-300/50">
                    No slots found matching filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddSlotModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSlotAdded={handleSlotAdded}
      />
    </div>
  );
};
