import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ParkingLotPage } from './pages/ParkingLotPage';
import { ParkVehiclePage } from './pages/ParkVehiclePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { ParkingHistoryPage } from './pages/ParkingHistoryPage';
import { SlotManagementPage } from './pages/SlotManagementPage';
import { ReportsPage } from './pages/ReportsPage';
import { Sparkles, Loader2 } from 'lucide-react';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070414] text-white">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full bg-violet-600/30 blur-xl animate-pulse"></div>
          <Loader2 className="w-9 h-9 animate-spin text-fuchsia-400 relative z-10" />
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest uppercase text-violet-300/80 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Initializing VPMS Pro Portal...</span>
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Dashboard & Analytics', subtitle: 'Real-time telemetry, capacity rates & financial intelligence' };
      case '/parking-lot':
        return { title: 'Visual Parking Grid', subtitle: 'Interactive 2D spatial floor plan & live sensor slot telemetry' };
      case '/park':
        return { title: 'Vehicle Check-In', subtitle: 'Automated slot allocation & smart encrypted ticket issuance' };
      case '/checkout':
        return { title: 'Exit Booth Checkout', subtitle: 'Dynamic polymorph pricing, instant UPI/Cash collection & clearance' };
      case '/vehicles':
        return { title: 'Registered Fleet & Vehicles', subtitle: 'Vehicle registry search, owner telemetry & lifecycle tracking' };
      case '/history':
        return { title: 'Audit Parking Logs', subtitle: 'Searchable historical ledger, revenue records & receipt reprints' };
      case '/slots':
        return { title: 'Slot Configuration Matrix', subtitle: 'Manage floor geometry, vehicle category allowances & bays' };
      case '/reports':
        return { title: 'Intelligence & Export', subtitle: 'Generate automated audit summaries & serialized binary snapshots' };
      default:
        return { title: 'Vehicle Parking Management System' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex min-h-screen bg-[#070414] text-slate-100 relative overflow-hidden font-sans">
      {/* Ethereal Ambient Glow Orbs */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow"></div>
      <div className="fixed top-1/3 -right-40 w-[650px] h-[650px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="fixed -bottom-40 left-1/3 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative z-10">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 relative">{children}</main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <DashboardPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/parking-lot"
            element={
              <ProtectedLayout>
                <ParkingLotPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/park"
            element={
              <ProtectedLayout>
                <ParkVehiclePage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedLayout>
                <CheckoutPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/vehicles"
            element={
              <ProtectedLayout>
                <VehiclesPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedLayout>
                <ParkingHistoryPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/slots"
            element={
              <ProtectedLayout>
                <SlotManagementPage />
              </ProtectedLayout>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedLayout>
                <ReportsPage />
              </ProtectedLayout>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
