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
      <div className="bg-white p-5 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Slot Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure parking slot capacities, types, and floor allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSlots}
            className="p-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Slot</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-purple-200 font-semibold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Types</option>
              <option value="BIKE">BIKE</option>
              <option value="CAR">CAR</option>
              <option value="TRUCK">TRUCK</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase text-[11px]">Floor:</span>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-purple-200 font-semibold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 text-xs font-semibold">
          Showing {filteredSlots.length} of {slots.length} total slots
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-white rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-purple-50/50 border-b border-purple-100/80 text-purple-900/70 uppercase tracking-wider font-semibold text-[11px]">
              <tr>
                <th className="px-5 py-3.5">Slot Number</th>
                <th className="px-5 py-3.5">Compatible Type</th>
                <th className="px-5 py-3.5">Floor</th>
                <th className="px-5 py-3.5">Current Status</th>
                <th className="px-5 py-3.5">Occupant</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100/50">
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => {
                  const isOccupied = slot.status === 'OCCUPIED';
                  return (
                    <tr key={slot.slotId} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold font-mono text-purple-950 text-sm">
                        {slot.slotNumber}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            slot.slotType === 'BIKE'
                              ? 'bg-violet-50 text-violet-700 border border-violet-200'
                              : slot.slotType === 'CAR'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}
                        >
                          {slot.slotType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">
                        Floor {slot.floor}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            isOccupied
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {isOccupied ? (
                          <span className="font-mono font-semibold text-slate-800">
                            {slot.currentVehicleNumber || 'Occupied'}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleToggleStatus(slot)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-[11px] transition-colors border border-purple-200"
                        >
                          Toggle Status
                        </button>
                        <button
                          onClick={() => handleDeleteSlot(slot)}
                          title={isOccupied ? 'Cannot delete occupied slot' : 'Delete slot'}
                          className={`p-1.5 rounded transition-colors ${
                            isOccupied
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-rose-600 hover:bg-rose-50'
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
                  <td colSpan={6} className="text-center py-10 text-slate-400">
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
