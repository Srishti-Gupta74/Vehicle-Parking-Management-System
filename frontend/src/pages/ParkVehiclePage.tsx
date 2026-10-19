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
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Park Vehicle Entry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Register vehicle arrival and automatically assign an available parking slot
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          <span>Synchronized Allocation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Park Form */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Type Cards */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Vehicle Type Category <span className="text-rose-500">*</span>
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
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                      vehicleType === type.id
                        ? 'border-indigo-600 bg-indigo-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <type.icon
                      className={`w-6 h-6 mb-1 ${
                        vehicleType === type.id ? 'text-indigo-600' : 'text-slate-500'
                      }`}
                    />
                    <span className="text-xs font-bold text-slate-900">{type.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{type.desc}</span>
                    <span className="text-[10px] font-bold text-indigo-600 mt-1">{type.rate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Vehicle Registration Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. KA-05-MJ-4321 or DL-01-AB-1234"
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Must be unique. System checks for active parking sessions.
              </p>
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Owner Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Phone Number (10 Digits) <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{loading ? 'Assigning Slot...' : 'Park Vehicle & Generate Ticket'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Pricing Guide & Business Rules */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Official Tariff Rules</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Bike (TwoWheeler)</span>
                  <span className="text-indigo-600">₹20 1st hr</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">₹10 for each additional hour</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Car (FourWheeler)</span>
                  <span className="text-indigo-600">₹30 1st hr</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">₹20 for each additional hour</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Truck (Commercial)</span>
                  <span className="text-indigo-600">₹50 1st hr</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">₹30 for each additional hour</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50/80 p-4 rounded-2xl border border-indigo-200 text-xs text-indigo-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-indigo-900">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>OOP Verification</span>
            </h4>
            <p className="text-[11px] leading-relaxed text-indigo-800">
              When submitting, the Java backend invokes the <code>ParkingLot.assignSlot</code> synchronized method and
              applies <strong>Runtime Polymorphism</strong> using the <code>Vehicle</code> hierarchy.
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Modal popup on success */}
      <TicketModal ticket={successTicket} onClose={() => setSuccessTicket(null)} />
    </div>
  );
};
