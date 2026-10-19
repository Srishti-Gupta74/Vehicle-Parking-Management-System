export interface User {
  userId: number;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export type VehicleType = 'BIKE' | 'CAR' | 'TRUCK';
export type SlotStatus = 'AVAILABLE' | 'OCCUPIED';
export type SessionStatus = 'ACTIVE' | 'COMPLETED';
export type PaymentMethod = 'CASH' | 'UPI' | 'CARD';
export type PaymentStatus = 'PAID' | 'PENDING' | 'FAILED';

export interface ParkingSlot {
  slotId: number;
  slotNumber: string;
  slotType: VehicleType;
  floor: number;
  status: SlotStatus;
  currentVehicleNumber?: string;
  currentOwnerName?: string;
  currentVehicleType?: VehicleType;
  currentEntryTime?: string;
  currentDurationHours?: number;
  currentEstimatedFee?: number;
}

export interface Vehicle {
  vehicleId: number;
  vehicleNumber: string;
  ownerName: string;
  vehicleType: VehicleType;
  phoneNumber: string;
  createdAt?: string;
  currentlyParked?: boolean;
  currentSlotNumber?: string;
  currentSessionId?: number;
  currentEntryTime?: string;
  currentDurationHours?: number;
  currentEstimatedFee?: number;
}

export interface ParkingSession {
  sessionId: number;
  vehicle: Vehicle;
  slot: ParkingSlot;
  entryTime: string;
  exitTime?: string;
  duration?: number;
  parkingFee?: number;
  status: SessionStatus;
}

export interface ParkingTicket {
  ticketNumber: string;
  sessionId: number;
  vehicleNumber: string;
  vehicleType: string;
  ownerName: string;
  phoneNumber?: string;
  slotNumber: string;
  floor: number;
  entryTime: string;
}

export interface ParkingReceipt {
  receiptNumber: string;
  sessionId: number;
  vehicleNumber: string;
  vehicleType: string;
  ownerName: string;
  slotNumber: string;
  floor: number;
  entryTime: string;
  exitTime: string;
  durationHours: number;
  parkingFee: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentTime?: string;
}

export interface DailyRevenuePoint {
  date: string;
  revenue: number;
  vehicleCount: number;
}

export interface ActivityLog {
  logId: number;
  activityType: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  vehiclesParkedToday: number;
  activeSessions: number;
  todayRevenue: number;
  totalRevenue: number;
  occupancyRatePercentage: number;
  vehicleTypeDistribution: Record<string, number>;
  paymentMethodRevenue: Record<string, number>;
  weeklyRevenue: DailyRevenuePoint[];
  recentActivities: ActivityLog[];
}

export interface ReportSummary {
  totalVehicles: number;
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalRevenue: number;
  averageFee: number;
  averageDurationHours: number;
  occupancyRate: number;
  vehicleCountsByType: Record<string, number>;
  revenueByType: Record<string, number>;
  sessionsByPaymentMethod: Record<string, number>;
  exportFilesAvailable: string[];
  generatedAt: string;
}
