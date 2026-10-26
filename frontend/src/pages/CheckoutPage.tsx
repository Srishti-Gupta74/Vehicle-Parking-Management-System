import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  Search,
  CheckCircle2,
  Clock,
  Car,
  User,
  IndianRupee,
  AlertCircle,
  Banknote,
  Smartphone,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { ParkingReceipt, ParkingSession } from '../types';
import { ReceiptModal } from '../components/ReceiptModal';

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefillVehicle = searchParams.get('vehicle');

  const [vehicleNumber, setVehicleNumber] = useState(prefillVehicle || '');
  const [activeSessions, setActiveSessions] = useState<ParkingSession[]>([]);
  const [estimatedData, setEstimatedData] = useState<ParkingReceipt | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD'>('UPI');

  const [loading, setLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [finalReceipt, setFinalReceipt] = useState<ParkingReceipt | null>(null);

  // Fetch active sessions for quick select
  useEffect(() => {
    const loadActive = async () => {
      try {
        const list = await api.getActiveSessions();
        setActiveSessions(list);
      } catch (err) {
        console.error('Failed to load active sessions', err);
      }
    };
    loadActive();
  }, []);

  // Auto-search if prefilled
  useEffect(() => {
    if (prefillVehicle) {
      handleSearch(prefillVehicle);
    }
  }, [prefillVehicle]);

  const handleSearch = async (numToSearch?: string) => {
    const num = (numToSearch || vehicleNumber).trim().toUpperCase();
    if (!num) {
      setError('Please enter a vehicle registration number to search.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const est = await api.estimateCheckout(num);
      setEstimatedData(est);
    } catch (err: any) {
      setEstimatedData(null);
      setError(err.message || `No active parking session found for vehicle: ${num}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estimatedData) return;

    try {
      setCheckoutLoading(true);
      setError(null);
      const receipt = await api.checkoutVehicle(estimatedData.vehicleNumber, paymentMethod);
      setFinalReceipt(receipt);
      setEstimatedData(null);
      setVehicleNumber('');

      // Refresh active sessions list
      const updated = await api.getActiveSessions();
      setActiveSessions(updated);
    } catch (err: any) {
      setError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="glass-panel p-5 md:p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-display font-extrabold text-white tracking-wide">
              Exit Terminal Checkout
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              POS Terminal
            </span>
          </div>
          <p className="text-xs text-violet-300/80 mt-1 font-medium">
            Cashier POS Terminal: Calculate polymorph tariff, collect payment & release parking bay
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-200 text-xs font-semibold shadow-glow-sm">
          <CreditCard className="w-4 h-4 text-cyan-400" />
          <span>Exit Gate POS</span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 font-medium shadow-glow-rose">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input Box */}
      <div className="glass-panel p-5 md:p-6 space-y-3">
        <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider">
          Search Active Vehicle by Registration Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-cyan-400" />
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. KA-05-MJ-4321 or KA-01-AB-1234"
              className="w-full glass-input pl-10 pr-4 font-mono font-bold tracking-wider uppercase text-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={loading}
            className="btn-ethereal px-5 py-2.5 flex items-center gap-2 text-xs font-bold"
          >
            <Search className="w-4 h-4 text-cyan-300" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>

        {/* Quick Select from Active Sessions */}
        {activeSessions.length > 0 && (
          <div className="pt-2">
            <span className="text-[10px] font-bold text-violet-300/70 uppercase tracking-widest block mb-1.5">
              Quick Select Currently Parked ({activeSessions.length}):
            </span>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
              {activeSessions.map((s) => (
                <button
                  key={s.sessionId}
                  type="button"
                  onClick={() => {
                    setVehicleNumber(s.vehicle.vehicleNumber);
                    handleSearch(s.vehicle.vehicleNumber);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/25 text-violet-200 hover:text-white text-xs font-mono font-semibold transition-all flex items-center gap-1.5 hover:border-violet-400/50"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
                  <span>{s.vehicle.vehicleNumber}</span>
                  <span className="text-[10px] text-cyan-300/80">({s.slot.slotNumber})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bill Calculation & Checkout Card */}
      {estimatedData && (
        <form onSubmit={handleCheckoutSubmit} className="glass-panel p-6 space-y-5 border-violet-400/30 shadow-glow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-violet-500/20">
            <div>
              <h2 className="text-base md:text-lg font-display font-extrabold text-white">
                Settlement Statement
              </h2>
              <p className="text-[11px] text-violet-300/70 font-mono">Session ID: #{estimatedData.sessionId}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-cyan-950/50 text-cyan-300 border border-cyan-500/40 shadow-glow-sm">
              Bay {estimatedData.slotNumber} (Floor {estimatedData.floor})
            </span>
          </div>

          <div className="space-y-4">
            {/* Vehicle & Customer Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20">
                <span className="text-[10px] text-violet-300/70 block uppercase tracking-wider">Vehicle Plate</span>
                <span className="font-mono font-black text-white text-sm block mt-0.5">
                  {estimatedData.vehicleNumber}
                </span>
                <span className="text-[10px] text-cyan-300 font-semibold mt-0.5 block">{estimatedData.vehicleType}</span>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20">
                <span className="text-[10px] text-violet-300/70 block uppercase tracking-wider">Owner Name</span>
                <span className="font-bold text-white text-sm block mt-0.5 truncate">
                  {estimatedData.ownerName}
                </span>
                <span className="text-[10px] text-violet-300/60 block mt-0.5">Registered Driver</span>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20">
                <span className="text-[10px] text-violet-300/70 block uppercase tracking-wider">Slot Assigned</span>
                <span className="font-display font-black text-white text-sm block mt-0.5">
                  {estimatedData.slotNumber}
                </span>
                <span className="text-[10px] text-violet-300/60 block mt-0.5">Floor Level {estimatedData.floor}</span>
              </div>

              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20">
                <span className="text-[10px] text-violet-300/70 block uppercase tracking-wider">Elapsed Time</span>
                <span className="font-mono font-black text-emerald-400 text-sm block mt-0.5">
                  {estimatedData.formattedDuration || `${estimatedData.durationHours} hrs`}
                </span>
                <span className="text-[10px] text-violet-300/70 font-semibold block mt-0.5">
                  Billed: {estimatedData.durationHours} hr rate
                </span>
              </div>
            </div>

            {/* Time Stamp breakdown */}
            <div className="flex justify-between items-center text-xs text-violet-300/80 px-1 font-mono">
              <div>
                <span className="text-violet-400/70">Check-in: </span>
                <span className="font-bold text-white">
                  {new Date(estimatedData.entryTime).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-violet-400/70">Check-out: </span>
                <span className="font-bold text-white">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total Fee Highlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900/40 via-fuchsia-900/30 to-indigo-900/40 border border-violet-400/40 shadow-glow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-violet-200 uppercase tracking-wider block">
                  Computed Parking Tariff
                </span>
                <span className="text-[11px] text-violet-300/80">
                  Dynamic Polymorphic Dispatch: {estimatedData.vehicleType}.calculateParkingFee({estimatedData.durationHours})
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl md:text-4xl font-display font-black bg-gradient-to-r from-white via-cyan-200 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-sm">
                  ₹{estimatedData.parkingFee.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-violet-500/20">
              <label className="block text-xs font-bold text-violet-200 uppercase tracking-wider">
                Tendered Payment Instrument <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone, desc: 'Digital QR Transfer' },
                  { id: 'CASH', label: 'Cash', icon: Banknote, desc: 'Cash Counter Tender' },
                  { id: 'CARD', label: 'Card', icon: CreditCard, desc: 'POS Terminal Swipe' },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                      paymentMethod === pm.id
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-glow-cyan scale-[1.02]'
                        : 'border-violet-500/20 hover:border-violet-500/40 bg-violet-950/20'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl ${
                        paymentMethod === pm.id
                          ? 'bg-gradient-to-tr from-cyan-500 to-teal-500 text-white shadow-glow-cyan'
                          : 'bg-violet-950/60 text-violet-300'
                      }`}
                    >
                      <pm.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{pm.label}</span>
                      <span className="text-[10px] text-violet-300/60">{pm.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkout Confirmation Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={checkoutLoading}
                className="w-full py-3.5 px-4 btn-emerald-glow flex items-center justify-center gap-2 text-sm font-bold tracking-wide shadow-glow-emerald"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                <span>
                  {checkoutLoading
                    ? 'Recording Collection & Vacating Bay...'
                    : `Confirm Collection & Vacate Bay (₹${estimatedData.parkingFee.toFixed(2)})`}
                </span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Final Receipt Modal */}
      <ReceiptModal receipt={finalReceipt} onClose={() => setFinalReceipt(null)} />
    </div>
  );
};
