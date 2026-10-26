import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Car, Clock, CreditCard, User, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { ParkingSlot } from '../types';

interface SlotDetailModalProps {
  slot: ParkingSlot | null;
  onClose: () => void;
}

export const SlotDetailModal: React.FC<SlotDetailModalProps> = ({ slot, onClose }) => {
  const navigate = useNavigate();
  if (!slot) return null;

  const isOccupied = slot.status === 'OCCUPIED';

  const handleCheckout = () => {
    onClose();
    if (slot.currentVehicleNumber) {
      navigate(`/checkout?vehicle=${encodeURIComponent(slot.currentVehicleNumber)}`);
    }
  };

  const handlePark = () => {
    onClose();
    navigate('/park');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="glass-panel max-w-md w-full overflow-hidden border-violet-400/40 shadow-glow-md animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div
          className={`px-6 py-4 flex items-center justify-between text-white border-b ${
            isOccupied
              ? 'bg-gradient-to-r from-rose-900/80 to-amber-900/80 border-rose-500/30'
              : 'bg-gradient-to-r from-emerald-900/80 to-teal-900/80 border-emerald-500/30'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-black tracking-wider text-white">{slot.slotNumber}</span>
            <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full font-mono font-bold text-violet-200 border border-white/10">
              Floor {slot.floor}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-violet-300/70 font-medium">Slot Category</span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-violet-950/60 text-cyan-300 border border-violet-500/30">
              {slot.slotType} BAY
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-violet-300/70 font-medium">Telemetry State</span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                isOccupied
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-glow-rose'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald'
              }`}
            >
              {isOccupied ? 'OCCUPIED' : 'AVAILABLE (READY TO PARK)'}
            </span>
          </div>

          {isOccupied ? (
            <div className="bg-violet-950/40 rounded-2xl p-4 border border-violet-500/25 space-y-3 text-xs mt-2">
              <h4 className="font-bold text-white flex items-center gap-1.5 pb-2 border-b border-violet-500/20">
                <Car className="w-4 h-4 text-rose-400" />
                <span>Current Occupant Telemetry</span>
              </h4>

              <div className="flex justify-between items-center">
                <span className="text-violet-300/70">Vehicle Number</span>
                <span className="font-mono font-black text-white text-sm bg-black/60 px-2 py-0.5 rounded border border-rose-500/30">
                  {slot.currentVehicleNumber || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-violet-300/70 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Owner Name</span>
                </span>
                <span className="font-bold text-white">{slot.currentOwnerName || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-violet-300/70 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Elapsed Time</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {slot.currentDurationFormatted || `${slot.currentDurationHours || 1} hr(s)`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-violet-500/20">
                <span className="text-violet-300/70 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>Accrued Tariff</span>
                </span>
                <span className="font-display font-black text-cyan-300 text-lg">
                  ₹{slot.currentEstimatedFee ? slot.currentEstimatedFee.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-center text-xs text-emerald-200 space-y-1">
              <p className="font-semibold text-white">This bay is vacant and ready for immediate allocation.</p>
              <p className="text-violet-300/70 text-[11px]">
                Compatible vehicle class: <span className="font-bold text-cyan-300">{slot.slotType}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-violet-950/60 border-t border-violet-500/20 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-violet-300 hover:text-white bg-violet-900/40 hover:bg-violet-900/70 rounded-xl border border-violet-500/30 transition-all"
          >
            Close
          </button>
          {isOccupied ? (
            <button
              onClick={handleCheckout}
              className="btn-emerald-glow flex items-center gap-1.5 px-4 py-2 text-xs font-bold shadow-glow-emerald"
            >
              <CreditCard className="w-4 h-4 text-emerald-200" />
              <span>Checkout This Vehicle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePark}
              className="btn-ethereal flex items-center gap-1.5 px-4 py-2 text-xs font-bold shadow-glow-sm"
            >
              <Car className="w-4 h-4 text-cyan-300" />
              <span>Park Vehicle Here</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
