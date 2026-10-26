import React, { useState } from 'react';
import {
  Car,
  Bike,
  Truck,
  PlusCircle,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Ticket,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { TicketModal } from '../components/TicketModal';
import { ParkingTicket } from '../types';

export const ParkVehiclePage: React.FC = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [vehicleType, setVehicleType] = useState('CAR');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTicket, setSuccessTicket] = useState<ParkingTicket | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    const cleanNum = vehicleNumber.trim().toUpperCase();
    const cleanPhone = phoneNumber.trim();

    if (!cleanNum) {
      setError('Vehicle registration number is required');
      return;
    }
    if (!ownerName.trim()) {
      setError('Owner name is required');
      return;
    }
    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setError('Phone number must be exactly 10 digits (e.g. 9876543210)');
      return;
    }

    try {
      setLoading(true);
      const res = await api.parkVehicle({
        vehicleNumber: cleanNum,
        ownerName: ownerName.trim(),
        vehicleType,
        phoneNumber: cleanPhone,
      });

      const ticket: ParkingTicket = {
        sessionId: res.sessionId,
        ticketNumber: res.ticketNumber,
        vehicleNumber: res.vehicleNumber,
        vehicleType: res.vehicleType,
        ownerName: res.ownerName,
        phoneNumber: cleanPhone,
        slotNumber: res.slotNumber,
        floor: res.floor,
        entryTime: res.entryTime,
      };

      setSuccessTicket(ticket);

      // Reset form
      setVehicleNumber('');
      setOwnerName('');
      setPhoneNumber('');
    } catch (err: any) {
      setError(err.message || 'Failed to park vehicle. Please check slot availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 md:p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Vehicle Check-In
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Entry Gate
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Register vehicle arrival, enforce OOP validation & auto-assign next available parking bay
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-200 text-xs font-semibold shadow-glow-sm">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Synchronized Allocation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Park Form */}
        <div className="md:col-span-2 glass-panel p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-medium shadow-glow-rose">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Type Cards */}
            <div>
              <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-2">
                Vehicle Classification <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'BIKE', label: 'Bike', icon: Bike, rate: '₹20 + ₹10/hr', desc: 'Two-Wheeler' },
                  { id: 'CAR', label: 'Car', icon: Car, rate: '₹30 + ₹20/hr', desc: 'Four-Wheeler' },
                  { id: 'TRUCK', label: 'Truck', icon: Truck, rate: '₹50 + ₹30/hr', desc: 'Commercial' },
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setVehicleType(type.id)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${
                      vehicleType === type.id
                        ? 'border-violet-400 bg-violet-900/40 shadow-glow-sm scale-[1.02]'
                        : 'border-violet-500/20 hover:border-violet-500/40 bg-violet-950/20'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl mb-2 ${
                        vehicleType === type.id
                          ? 'bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-glow-sm'
                          : 'bg-violet-950/60 text-violet-300'
                      }`}
                    >
                      <type.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-white">{type.label}</span>
                    <span className="text-[10px] text-cyan-300/90 font-semibold mt-0.5">{type.rate}</span>
                    <span className="text-[9px] text-violet-300/60 mt-0.5">{type.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Registration Number */}
            <div>
              <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
                License Plate / Registration No. <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="e.g. KA-05-MJ-4321 or DL-03-C-8899"
                className="w-full glass-input font-mono font-bold tracking-wider uppercase text-sm"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
                Owner Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full glass-input"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider mb-1.5">
                Contact Phone Number (10 Digits) <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 9876543210"
                className="w-full glass-input font-mono"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 btn-ethereal flex items-center justify-center gap-2 text-sm font-bold tracking-wide shadow-glow-md"
              >
                <PlusCircle className="w-4 h-4 text-cyan-300" />
                <span>{loading ? 'Assigning Bay & Slot...' : 'Park Vehicle & Generate Smart Slip'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Pricing Guide & Business Rules */}
        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-violet-500/15">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Official Tariff Rules</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/25">
                <div className="flex justify-between font-bold text-white">
                  <span>Bike (TwoWheeler)</span>
                  <span className="text-cyan-300 font-extrabold">₹20 1st hr</span>
                </div>
                <p className="text-[11px] text-violet-300/70 mt-0.5">₹10 for each additional hour</p>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/25">
                <div className="flex justify-between font-bold text-white">
                  <span>Car (FourWheeler)</span>
                  <span className="text-cyan-300 font-extrabold">₹30 1st hr</span>
                </div>
                <p className="text-[11px] text-violet-300/70 mt-0.5">₹20 for each additional hour</p>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/25">
                <div className="flex justify-between font-bold text-white">
                  <span>Truck (Commercial)</span>
                  <span className="text-cyan-300 font-extrabold">₹50 1st hr</span>
                </div>
                <p className="text-[11px] text-violet-300/70 mt-0.5">₹30 for each additional hour</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 border-violet-500/30 text-xs space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-violet-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>OOP Architecture</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-violet-300/80">
              Upon submission, the Spring Boot backend invokes <code>ParkingLot.assignSlot</code> synchronized method and
              applies <strong>Runtime Polymorphism</strong> using the <code>Vehicle</code> class hierarchy.
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Modal popup on success */}
      <TicketModal ticket={successTicket} onClose={() => setSuccessTicket(null)} />
    </div>
  );
};
