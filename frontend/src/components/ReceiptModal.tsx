import React from 'react';
import { X, Printer, CheckCircle2, CarFront } from 'lucide-react';
import { ParkingReceipt } from '../types';
import { printElement } from '../utils/printHelper';

interface ReceiptModalProps {
  receipt: ParkingReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    printElement('printable-receipt', `VPMS Receipt - ${receipt.receiptNumber}`);
  };

  const entryDate = new Date(receipt.entryTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const exitDate = new Date(receipt.exitTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="printable-card bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Window Header - Hidden in Print */}
        <div className="no-print bg-emerald-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">Payment Completed</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body Area */}
        <div id="printable-receipt" className="p-6 space-y-4 text-slate-800">
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <CarFront className="w-5 h-5 text-emerald-600" />
              <span className="font-black tracking-wide text-slate-900 text-base">VPMS PARKING</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Official Tax Invoice & Receipt
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1.5">Central Parking Facility</h2>
            <p className="text-xs text-slate-500 font-mono tracking-wider font-semibold mt-0.5">
              {receipt.receiptNumber}
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/90 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Vehicle Registration</span>
              <span className="font-mono font-black text-slate-950 text-sm tracking-wide">
                {receipt.vehicleNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Vehicle Type</span>
              <span className="font-semibold text-slate-800">{receipt.vehicleType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Owner Name</span>
              <span className="font-semibold text-slate-800">{receipt.ownerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Slot & Floor</span>
              <span className="font-semibold text-slate-800">
                {receipt.slotNumber} (Floor {receipt.floor})
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Entry Time</span>
              <span className="text-slate-700">{entryDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Exit Time</span>
              <span className="text-slate-700">{exitDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Billed Duration</span>
              <span className="font-bold text-slate-900">{receipt.durationHours} hr(s)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Payment Mode</span>
              <span className="font-bold text-slate-900">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Settlement Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PAID & VERIFIED
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-300">
              <span className="font-bold text-xs uppercase text-slate-700 tracking-wide">
                Total Fee Paid
              </span>
              <span className="font-black text-emerald-700 text-lg">
                ₹{receipt.parkingFee.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="text-[10px] text-slate-500 text-center border-t border-dashed border-slate-300 pt-2.5">
            <p className="font-semibold text-slate-800">Thank you for parking with VPMS Central!</p>
            <p>Computer generated invoice. Safe travels!</p>
          </div>
        </div>

        {/* Modal Action Buttons - Hidden in Print */}
        <div className="no-print px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
