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
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Checkout & Fee Settlement</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculate final fee via Java Runtime Polymorphism, process payment, and vacate slot
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
          <CreditCard className="w-4 h-4" />
          <span>Polymorphic Billing</span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700">
          Search Active Vehicle by Registration Number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. KA-05-MJ-4321 or KA-01-AB-1234"
              className="w-full pl-10 pr-4 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase tracking-wider"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? 'Searching...' : 'Calculate Fee'}
          </button>
        </div>

        {/* Quick select chips of currently parked vehicles */}
        {activeSessions.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">
              Quick Select Currently Parked ({activeSessions.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeSessions.map((s) => (
                <button
                  key={s.sessionId}
                  type="button"
                  onClick={() => {
                    setVehicleNumber(s.vehicle.vehicleNumber);
                    handleSearch(s.vehicle.vehicleNumber);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 text-[11px] font-mono font-bold text-slate-700 transition-colors"
                >
                  {s.vehicle.vehicleNumber} ({s.slot.slotNumber})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parking Summary & Payment Card */}
      {estimatedData && (
        <form onSubmit={handleCheckoutSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-indigo-600" />
                <span>Parking Summary for {estimatedData.vehicleNumber}</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Active Session #{estimatedData.sessionId}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Vehicle Type</span>
                <span className="font-bold text-slate-800 text-sm">{estimatedData.vehicleType}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Owner Name</span>
                <span className="font-semibold text-slate-800 text-sm truncate block">
                  {estimatedData.ownerName}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Assigned Slot</span>
                <span className="font-extrabold text-indigo-600 text-base">
                  {estimatedData.slotNumber} (Floor {estimatedData.floor})
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Duration Elapsed</span>
                <span className="font-extrabold text-slate-900 text-base">
                  {estimatedData.durationHours} hr(s)
                </span>
              </div>
            </div>

            {/* Time Stamp breakdown */}
            <div className="flex justify-between items-center text-xs text-slate-600 px-1">
              <div>
                <span className="text-slate-400">Entry Time: </span>
                <span className="font-medium text-slate-800">
                  {new Date(estimatedData.entryTime).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Estimated Exit: </span>
                <span className="font-medium text-slate-800">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Total Fee Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 border border-indigo-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Final Calculated Parking Fee
                </span>
                <span className="text-[11px] text-slate-500">
                  Calculated dynamically in Java: {estimatedData.vehicleType}.calculateParkingFee({estimatedData.durationHours})
                </span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-indigo-600">
                  ₹{estimatedData.parkingFee.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700">
                Select Payment Method <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone, desc: 'Instant Digital' },
                  { id: 'CASH', label: 'Cash', icon: Banknote, desc: 'Counter Payment' },
                  { id: 'CARD', label: 'Card', icon: CreditCard, desc: 'Debit / Credit' },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMethod === pm.id
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        paymentMethod === pm.id ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <pm.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{pm.label}</span>
                      <span className="text-[10px] text-slate-400">{pm.desc}</span>
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
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {checkoutLoading
                    ? 'Processing Payment & Vacating Slot...'
                    : `Complete Checkout & Pay ₹${estimatedData.parkingFee.toFixed(2)}`}
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
