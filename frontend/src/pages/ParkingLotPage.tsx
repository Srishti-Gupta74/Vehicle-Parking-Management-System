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
  Sparkles,
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
      <div className="glass-panel p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Spatial Parking Matrix
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              2D Grid
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Interactive floor plan visualizing in-memory 2D array state and live telemetry
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Counter Chips */}
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/50 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
              <span>{availableCount} Available</span>
            </span>
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/50 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185] animate-pulse"></span>
              <span>{occupiedCount} Occupied</span>
            </span>
          </div>

          <button
            onClick={fetchSlots}
            title="Refresh slots"
            className="p-2.5 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-200 hover:text-white hover:bg-violet-900/40 hover:border-violet-400/50 transition-all shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddSlotOpen(true)}
            className="btn-ethereal flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide"
          >
            <Plus className="w-4 h-4 text-cyan-300" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Floor Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-violet-400/80 font-bold uppercase tracking-widest text-[10px] mr-1.5">Floor Level:</span>
          {(['ALL', 1, 2] as const).map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all duration-200 border ${
                selectedFloor === floor
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-glow-sm border-violet-400/40'
                  : 'text-violet-200/60 hover:text-white hover:bg-violet-950/60 border-transparent'
              }`}
            >
              {floor === 'ALL' ? 'All Floors' : `Floor ${floor}`}
            </button>
          ))}
        </div>

        {/* Vehicle Type Tabs */}
        <div className="flex items-center gap-1.5">
          <span className="text-violet-400/80 font-bold uppercase tracking-widest text-[10px] mr-1.5">Class:</span>
          {[
            { id: 'ALL', label: 'All Slots' },
            { id: 'CAR', label: 'Cars', icon: Car },
            { id: 'BIKE', label: 'Bikes', icon: Bike },
            { id: 'TRUCK', label: 'Trucks', icon: Truck },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all duration-200 border ${
                selectedType === type.id
                  ? 'bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-glow-sm border-fuchsia-400/40'
                  : 'text-violet-200/60 hover:text-white hover:bg-violet-950/60 border-transparent'
              }`}
            >
              {type.icon && <type.icon className="w-3.5 h-3.5" />}
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-center gap-2 shadow-glow-rose">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Sections */}
      <div className="space-y-6">
        {/* CAR SLOTS SECTION */}
        {(selectedType === 'ALL' || selectedType === 'CAR') && (
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-violet-500/15">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.2)]">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-display font-bold text-white tracking-wide">
                    Four-Wheeler Car Bays
                  </h3>
                  <p className="text-[11px] text-violet-300/70">Rate: ₹30 first hour, ₹20 each additional hour</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-xl border border-cyan-500/30">
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
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-violet-500/15">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-display font-bold text-white tracking-wide">
                    Two-Wheeler Bike Bays
                  </h3>
                  <p className="text-[11px] text-violet-300/70">Rate: ₹20 first hour, ₹10 each additional hour</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-xl border border-cyan-500/30">
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
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-violet-500/15">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 shadow-[0_0_12px_rgba(217,70,239,0.2)]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-display font-bold text-white tracking-wide">
                    Heavy Commercial & Truck Bays
                  </h3>
                  <p className="text-[11px] text-violet-300/70">Rate: ₹50 first hour, ₹30 each additional hour</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-fuchsia-300 bg-fuchsia-950/40 px-3 py-1 rounded-xl border border-fuchsia-500/30">
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
      className={`group relative p-3.5 rounded-2xl border-2 transition-all duration-300 cursor-pointer select-none flex flex-col justify-between min-h-[120px] backdrop-blur-md ${
        isOccupied
          ? 'bg-rose-950/30 border-rose-500/40 hover:border-rose-400 hover:shadow-glow-rose hover:scale-[1.03]'
          : 'bg-emerald-950/30 border-emerald-500/40 hover:border-emerald-400 hover:shadow-glow-emerald hover:scale-[1.03]'
      }`}
    >
      {/* Top Slot Header */}
      <div className="flex items-center justify-between">
        <span className="font-display font-black text-sm md:text-base text-white tracking-tight">
          {slot.slotNumber}
        </span>
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border font-mono ${
            isOccupied
              ? 'bg-rose-950/60 text-rose-300 border-rose-500/30'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
          }`}
        >
          F{slot.floor}
        </span>
      </div>

      {/* Middle Occupant or Available Badge */}
      <div className="my-1.5">
        {isOccupied ? (
          <div>
            <span className="font-mono text-xs font-black text-rose-200 bg-black/60 border border-rose-500/40 px-1.5 py-0.5 rounded block truncate shadow-inner">
              {slot.currentVehicleNumber || 'OCCUPIED'}
            </span>
            <span className="text-[10px] text-rose-300/80 font-medium block truncate mt-1">
              {slot.currentOwnerName ? `${slot.currentOwnerName} • ${slot.currentDurationHours || 1}h` : 'Parked'}
            </span>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
              <span>AVAILABLE</span>
            </span>
            <span className="text-[10px] text-emerald-300/70 font-medium block mt-0.5">
              Ready for allocation
            </span>
          </div>
        )}
      </div>

      {/* Bottom Status Tag */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
        <span className="font-semibold text-violet-300/70">{slot.slotType}</span>
        <span
          className={`font-black px-1.5 py-0.5 rounded text-[9px] tracking-wider uppercase ${
            isOccupied
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}
        >
          {isOccupied ? 'BUSY' : 'OPEN'}
        </span>
      </div>
    </div>
  );
};
