import React, { useState, useEffect } from 'react';
import {
  Grid,
  Car,
  Bike,
  Truck,
  RefreshCw,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { ParkingSlot } from '../types';
import { SlotDetailModal } from '../components/SlotDetailModal';
import { AddSlotModal } from '../components/AddSlotModal';

export const ParkingLotPage: React.FC = () => {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modals
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getSlots();
      setSlots(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load parking slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSlotAdded = (newSlot: ParkingSlot) => {
    setSlots((prev) => [...prev, newSlot]);
  };

  // Filter slots
  const filteredSlots = slots.filter((slot) => {
    if (selectedFloor !== 'ALL' && slot.floor !== selectedFloor) return false;
    if (selectedType !== 'ALL' && slot.slotType !== selectedType) return false;
    return true;
  });

  // Group filtered slots by type
  const carSlots = filteredSlots.filter((s) => s.slotType === 'CAR');
  const bikeSlots = filteredSlots.filter((s) => s.slotType === 'BIKE');
  const truckSlots = filteredSlots.filter((s) => s.slotType === 'TRUCK');

  const availableCount = slots.filter((s) => s.status === 'AVAILABLE').length;
  const occupiedCount = slots.filter((s) => s.status === 'OCCUPIED').length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Visual Parking Facility</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive multi-floor layout representing the underlying 2D array grid
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Counter Chips */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>{availableCount} Available</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{occupiedCount} Occupied</span>
            </span>
          </div>

          <button
            onClick={fetchSlots}
            title="Refresh slots"
            className="p-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-purple-600' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddSlotOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 text-xs">
        {/* Floor Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1">Floor:</span>
          {(['ALL', 1, 2] as const).map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedFloor === floor
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/25'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {floor === 'ALL' ? 'All Floors' : `Floor ${floor}`}
            </button>
          ))}
        </div>

        {/* Vehicle Type Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1">Category:</span>
          {[
            { id: 'ALL', label: 'All Slots' },
            { id: 'CAR', label: 'Cars', icon: Car },
            { id: 'BIKE', label: 'Bikes', icon: Bike },
            { id: 'TRUCK', label: 'Trucks', icon: Truck },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                selectedType === type.id
                  ? 'bg-purple-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              {type.icon && <type.icon className="w-3.5 h-3.5" />}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Sections */}
      <div className="space-y-6">
        {/* CAR SLOTS SECTION */}
        {(selectedType === 'ALL' || selectedType === 'CAR') && (
          <div className="bg-white p-6 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Four-Wheeler Car Slots</h3>
                  <p className="text-[11px] text-slate-400">Rate: ₹30 first hour, ₹20 each additional hour</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {carSlots.length} Slots
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {carSlots.map((slot) => (
                <SlotCard key={slot.slotId} slot={slot} onClick={() => setSelectedSlot(slot)} />
              ))}
            </div>
          </div>
        )}

        {/* BIKE SLOTS SECTION */}
        {(selectedType === 'ALL' || selectedType === 'BIKE') && (
          <div className="bg-white p-6 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Two-Wheeler Bike Slots</h3>
                  <p className="text-[11px] text-slate-400">Rate: ₹20 first hour, ₹10 each additional hour</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {bikeSlots.length} Slots
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {bikeSlots.map((slot) => (
                <SlotCard key={slot.slotId} slot={slot} onClick={() => setSelectedSlot(slot)} />
              ))}
            </div>
          </div>
        )}

        {/* TRUCK SLOTS SECTION */}
        {(selectedType === 'ALL' || selectedType === 'TRUCK') && (
          <div className="bg-white p-6 rounded-2xl border border-purple-100/80 shadow-sm shadow-purple-500/5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100/60">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Heavy Truck / Commercial Slots</h3>
                  <p className="text-[11px] text-slate-400">Rate: ₹50 first hour, ₹30 each additional hour</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {truckSlots.length} Slots
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {truckSlots.map((slot) => (
                <SlotCard key={slot.slotId} slot={slot} onClick={() => setSelectedSlot(slot)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SlotDetailModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
      <AddSlotModal
        isOpen={isAddSlotOpen}
        onClose={() => setIsAddSlotOpen(false)}
        onSlotAdded={handleSlotAdded}
      />
    </div>
  );
};

interface SlotCardProps {
  slot: ParkingSlot;
  onClick: () => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, onClick }) => {
  const isOccupied = slot.status === 'OCCUPIED';

  return (
    <div
      onClick={onClick}
      className={`group relative p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between min-h-[115px] ${
        isOccupied
          ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500 hover:shadow-md'
          : 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500 hover:shadow-md'
      }`}
    >
      {/* Top Slot Header */}
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-sm text-slate-900 tracking-tight">{slot.slotNumber}</span>
        <span className="text-[10px] font-semibold text-slate-500 bg-white/80 px-1.5 py-0.5 rounded border border-slate-200">
          F{slot.floor}
        </span>
      </div>

      {/* Middle Occupant or Available Badge */}
      <div className="my-1.5">
        {isOccupied ? (
          <div>
            <span className="font-mono text-xs font-bold text-amber-900 block truncate">
              {slot.currentVehicleNumber || 'OCCUPIED'}
            </span>
            <span className="text-[10px] text-amber-700/90 font-medium block truncate">
              {slot.currentOwnerName ? `${slot.currentOwnerName} • ${slot.currentDurationHours || 1}h` : 'Parked'}
            </span>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>FREE</span>
            </span>
            <span className="text-[10px] text-emerald-600/80 font-medium block">
              Ready to park
            </span>
          </div>
        )}
      </div>

      {/* Bottom Status Tag */}
      <div className="pt-1.5 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
        <span className="font-semibold text-slate-500">{slot.slotType}</span>
        <span
          className={`font-bold px-1.5 py-0.5 rounded text-[9px] ${
            isOccupied
              ? 'bg-amber-200 text-amber-900'
              : 'bg-emerald-200 text-emerald-900'
          }`}
        >
          {isOccupied ? 'BUSY' : 'OPEN'}
        </span>
      </div>
    </div>
  );
};
