import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Car, Clock, CreditCard, User, Layers, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between text-white ${
          isOccupied ? 'bg-amber-600' : 'bg-emerald-600'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider">{slot.slotNumber}</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
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
            <span className="text-xs text-slate-500 font-medium">Slot Category</span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {slot.slotType} SLOT
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Current Status</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              isOccupied
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {isOccupied ? 'OCCUPIED' : 'AVAILABLE (READY TO PARK)'}
            </span>
          </div>

          {isOccupied ? (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs mt-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-200">
                <Car className="w-4 h-4 text-amber-600" />
                <span>Current Occupant Information</span>
              </h4>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1">
                  <span>Vehicle Number</span>
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {slot.currentVehicleNumber || 'N/A'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Owner Name</span>
                </span>
                <span className="font-semibold text-slate-800">{slot.currentOwnerName || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Duration Elapsed</span>
                </span>
                <span className="font-bold text-slate-800">
                  {slot.currentDurationFormatted || `${slot.currentDurationHours || 1} hr(s)`}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-purple-100">
                <span className="text-slate-500 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  <span>Current Estimated Fee</span>
                </span>
                <span className="font-extrabold text-purple-700 text-base">
                  ₹{slot.currentEstimatedFee ? slot.currentEstimatedFee.toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-center text-xs text-emerald-800 space-y-1">
              <p className="font-semibold">This slot is empty and available for parking.</p>
              <p className="text-slate-500 text-[11px]">
                Compatible vehicle type: <span className="font-bold text-slate-700">{slot.slotType}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-purple-50/30 border-t border-purple-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-purple-200 transition-colors"
          >
            Close
          </button>
          {isOccupied ? (
            <button
              onClick={handleCheckout}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>Checkout This Vehicle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePark}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl shadow-sm shadow-purple-500/25 transition-all"
            >
              <Car className="w-4 h-4" />
              <span>Park Vehicle Here</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
