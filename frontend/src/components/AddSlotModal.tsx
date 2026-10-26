import React, { useState } from 'react';
import { X, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ParkingSlot } from '../types';

interface AddSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSlotAdded: (newSlot: ParkingSlot) => void;
}

export const AddSlotModal: React.FC<AddSlotModalProps> = ({ isOpen, onClose, onSlotAdded }) => {
  const [slotNumber, setSlotNumber] = useState('');
  const [slotType, setSlotType] = useState('CAR');
  const [floor, setFloor] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotNumber.trim()) {
      setError('Please provide a slot identifier (e.g. C-09, B-09, T-05)');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const created = await api.createSlot(slotNumber.trim().toUpperCase(), slotType, floor);
      onSlotAdded(created);
      onClose();
      setSlotNumber('');
      setFloor(1);
    } catch (err: any) {
      setError(err.message || 'Failed to create parking slot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="glass-panel max-w-md w-full overflow-hidden border-violet-400/40 shadow-glow-md animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-violet-900 via-fuchsia-900 to-indigo-900 flex items-center justify-between text-white border-b border-violet-500/30">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-cyan-300" />
            <h3 className="font-display font-extrabold text-base tracking-wide">Add New Parking Bay</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center gap-2 shadow-glow-rose">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
              Bay Identifier / Code <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. C-09 or B-09 or T-05"
              value={slotNumber}
              onChange={(e) => setSlotNumber(e.target.value)}
              className="w-full glass-input font-mono font-bold uppercase tracking-wider text-sm"
            />
            <p className="text-[11px] text-violet-300/60 mt-1">Must be unique across the entire matrix</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
              Target Vehicle Class <span className="text-rose-400">*</span>
            </label>
            <select
              value={slotType}
              onChange={(e) => setSlotType(e.target.value)}
              className="w-full glass-input font-semibold"
            >
              <option value="BIKE" className="bg-[#0e0722] text-white">BIKE (Two-Wheeler)</option>
              <option value="CAR" className="bg-[#0e0722] text-white">CAR (Four-Wheeler)</option>
              <option value="TRUCK" className="bg-[#0e0722] text-white">TRUCK (Heavy Commercial)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
              Facility Floor Level <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={floor}
              onChange={(e) => setFloor(parseInt(e.target.value) || 1)}
              className="w-full glass-input font-mono font-bold"
            />
          </div>

          <div className="pt-3 border-t border-violet-500/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-violet-300 hover:text-white bg-violet-900/40 hover:bg-violet-900/70 rounded-xl border border-violet-500/30 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-ethereal flex items-center gap-1.5 px-4 py-2 text-xs font-bold shadow-glow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-300" />
              <span>{loading ? 'Creating...' : 'Create Parking Bay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
