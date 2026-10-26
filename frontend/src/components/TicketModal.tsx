import React from 'react';
import { X, Printer, CheckCircle, QrCode, CarFront } from 'lucide-react';
import { ParkingTicket } from '../types';
import { printElement } from '../utils/printHelper';

interface TicketModalProps {
  ticket: ParkingTicket | null;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  const handlePrint = () => {
    printElement('printable-ticket', `VPMS Ticket - ${ticket.ticketNumber}`);
  };

  const formattedDate = new Date(ticket.entryTime).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="printable-card bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-violet-400/40 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Window Header - Hidden in Print */}
        <div className="no-print bg-gradient-to-r from-violet-700 via-fuchsia-700 to-indigo-700 px-6 py-4 flex items-center justify-between text-white border-b border-violet-400/30">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-cyan-300" />
            <h3 className="font-display font-extrabold text-base tracking-wide">Vehicle Checked-In Successfully</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Slip Area */}
        <div id="printable-ticket" className="p-6 space-y-4 text-slate-800 bg-white">
          {/* Header */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <CarFront className="w-5 h-5 text-violet-600" />
              <span className="font-black tracking-wide text-slate-900 text-base font-display">VPMS PRO PARKING</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-200">
              Official Parking Ticket
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 mt-1.5 font-display">Central Parking Facility</h2>
            <p className="text-xs text-slate-500 font-mono tracking-wider font-semibold mt-0.5">
              {ticket.ticketNumber}
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Vehicle Registration</span>
              <span className="font-mono font-black text-slate-950 text-sm tracking-wide">
                {ticket.vehicleNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Vehicle Class</span>
              <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-violet-100 text-violet-800 border border-violet-200">
                {ticket.vehicleType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Driver / Owner</span>
              <span className="font-semibold text-slate-900">{ticket.ownerName}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Assigned Parking Bay</span>
              <div className="text-right">
                <span className="font-black text-violet-700 text-base tracking-wide font-display">
                  {ticket.slotNumber}
                </span>
                <span className="text-[11px] text-violet-600/80 font-medium block">
                  Level / Floor {ticket.floor}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Check-In Timestamp</span>
              <span className="font-semibold text-slate-900 font-mono">{formattedDate}</span>
            </div>
          </div>

          {/* QR Verification Box */}
          <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
            <QrCode className="w-14 h-14 text-slate-800" />
            <p className="text-[9px] text-slate-500 mt-1 font-mono">Scan at exit cashier for instant clearance</p>
          </div>

          {/* Footer Warning */}
          <div className="text-[10px] text-slate-500 text-center border-t border-dashed border-slate-300 pt-2.5 space-y-0.5">
            <p className="font-semibold text-slate-700">Please present this ticket at the exit booth upon departure.</p>
            <p>Loss of ticket incurs flat full-day rate penalty.</p>
          </div>
        </div>

        {/* Modal Action Buttons - Hidden in Print */}
        <div className="no-print px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="btn-ethereal flex items-center gap-1.5 px-4 py-2 text-xs font-bold shadow-glow-sm"
          >
            <Printer className="w-4 h-4 text-cyan-300" />
            <span>Print Ticket Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
