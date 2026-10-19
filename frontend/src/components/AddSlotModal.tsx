import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
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
      setError('Please provide a slot number (e.g., C-09, B-09, T-05)');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-indigo-600 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <h3 className="font-bold text-base">Add New Parking Slot</h3>
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
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Slot Identifier / Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. C-09 or B-09 or T-05"
              value={slotNumber}
              onChange={(e) => setSlotNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
            />
            <p className="text-[11px] text-slate-400 mt-1">Must be unique across the facility</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Slot Vehicle Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={slotType}
              onChange={(e) => setSlotType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="BIKE">BIKE (Two-Wheeler)</option>
              <option value="CAR">CAR (Four-Wheeler)</option>
              <option value="TRUCK">TRUCK (Heavy Commercial)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Facility Floor <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={10}
              required
              value={floor}
              onChange={(e) => setFloor(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Creating...' : 'Create Slot'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
