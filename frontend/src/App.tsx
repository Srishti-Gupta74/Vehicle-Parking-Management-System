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

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white text-xs">
        Loading VPMS Portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Dashboard & Analytics', subtitle: 'Real-time overview of parking lot metrics' };
      case '/parking-lot':
        return { title: 'Visual Parking Lot', subtitle: 'Live 2D floor grid and slot occupancy status' };
      case '/park':
        return { title: 'Park Vehicle', subtitle: 'Register entry and auto-assign parking slot' };
      case '/checkout':
        return { title: 'Checkout & Settlement', subtitle: 'Calculate fees and record payment' };
      case '/vehicles':
        return { title: 'Registered Vehicles', subtitle: 'Search vehicle database and audit lifecycle' };
      case '/history':
        return { title: 'Parking History', subtitle: 'Filter, sort, and reprint documents' };
      case '/slots':
        return { title: 'Slot Management', subtitle: 'Configure capacity, floors, and categories' };
      case '/reports':
        return { title: 'Reports & Export', subtitle: 'Download generated reports and binary backups' };
      default:
        return { title: 'Vehicle Parking Management System' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex min-h-screen bg-[#faf8fd]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1">{children}</main>
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
