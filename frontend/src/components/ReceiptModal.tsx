import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { ParkingReceipt } from '../types';

interface ReceiptModalProps {
  receipt: ParkingReceipt | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <h3 className="font-bold text-base">Payment Completed</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 space-y-4">
          <div className="text-center border-b border-dashed border-slate-300 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Tax Invoice & Parking Receipt
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 mt-2">VPMS Central Facility</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{receipt.receiptNumber}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Vehicle Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{receipt.vehicleNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Vehicle Type</span>
              <span className="font-semibold text-slate-800">{receipt.vehicleType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Owner Name</span>
              <span className="font-semibold text-slate-800">{receipt.ownerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Parking Slot</span>
              <span className="font-semibold text-slate-800">{receipt.slotNumber} (Floor {receipt.floor})</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">Entry Time</span>
              <span className="text-slate-700">{entryDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Exit Time</span>
              <span className="text-slate-700">{exitDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Billed Duration</span>
              <span className="font-bold text-slate-800">{receipt.durationHours} hr(s)</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500">Payment Mode</span>
              <span className="font-bold text-slate-800">{receipt.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Status</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {receipt.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-300">
              <span className="font-bold text-sm text-slate-800">Total Fee Paid</span>
              <span className="font-extrabold text-emerald-600 text-lg">₹{receipt.parkingFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center border-t border-dashed border-slate-300 pt-3">
            <p className="font-semibold text-slate-600">Thank you for parking with VPMS!</p>
            <p className="mt-0.5">Computer-generated receipt. No signature required.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
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
