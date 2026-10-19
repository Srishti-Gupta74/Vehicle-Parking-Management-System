import React from 'react';
import { X, Printer, CheckCircle, QrCode } from 'lucide-react';
import { ParkingTicket } from '../types';

interface TicketModalProps {
  ticket: ParkingTicket | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(ticket.entryTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-base">Vehicle Parked Successfully</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Area */}
        <div id="printable-ticket" className="p-6 space-y-5">
          <div className="text-center border-b border-dashed border-slate-300 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Official Parking Ticket
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 mt-2">VPMS Central Facility</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{ticket.ticketNumber}</p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Vehicle Number</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{ticket.vehicleNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Vehicle Type</span>
              <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-slate-200 text-slate-800">
                {ticket.vehicleType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Owner Name</span>
              <span className="font-semibold text-slate-800">{ticket.ownerName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Assigned Slot</span>
              <div className="text-right">
                <span className="font-extrabold text-indigo-600 text-base">{ticket.slotNumber}</span>
                <span className="text-[11px] text-slate-500 block">Floor {ticket.floor}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Entry Timestamp</span>
              <span className="font-medium text-slate-800">{formattedDate}</span>
            </div>
          </div>

          {/* Simulated QR Code / Barcode */}
          <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200">
            <QrCode className="w-16 h-16 text-slate-800" />
            <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-widest uppercase">
              SCAN AT EXIT TO CHECKOUT
            </p>
          </div>

          <div className="text-[11px] text-slate-400 text-center space-y-0.5">
            <p>Please keep this ticket safely until departure.</p>
            <p>Parking fee is calculated according to duration upon checkout.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
          >
            Done
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
