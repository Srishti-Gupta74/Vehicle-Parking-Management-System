import {
  DashboardStats,
  ParkingReceipt,
  ParkingSession,
  ParkingSlot,
  ParkingTicket,
  ReportSummary,
  User,
  Vehicle,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<User>(res);
  },

  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    return handleResponse<DashboardStats>(res);
  },

  // Slots
  async getSlots(): Promise<ParkingSlot[]> {
    const res = await fetch(`${API_BASE_URL}/slots`);
    return handleResponse<ParkingSlot[]>(res);
  },

  async createSlot(slotNumber: string, slotType: string, floor: number): Promise<ParkingSlot> {
    const res = await fetch(`${API_BASE_URL}/slots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotNumber, slotType, floor }),
    });
    return handleResponse<ParkingSlot>(res);
  },

  async updateSlotStatus(slotId: number, status: string): Promise<ParkingSlot> {
    const res = await fetch(`${API_BASE_URL}/slots/${slotId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return handleResponse<ParkingSlot>(res);
  },

  async deleteSlot(slotId: number): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE_URL}/slots/${slotId}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(res);
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    const res = await fetch(`${API_BASE_URL}/vehicles`);
    return handleResponse<Vehicle[]>(res);
  },

  async searchVehicles(query?: string): Promise<Vehicle[]> {
    const url = query ? `${API_BASE_URL}/vehicles/search?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/vehicles`;
    const res = await fetch(url);
    return handleResponse<Vehicle[]>(res);
  },

  async getVehicleSessions(vehicleId: number): Promise<ParkingSession[]> {
    const res = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/sessions`);
    return handleResponse<ParkingSession[]>(res);
  },

  // Parking Operations
  async parkVehicle(data: {
    vehicleNumber: string;
    ownerName: string;
    vehicleType: string;
    phoneNumber: string;
  }): Promise<{
    sessionId: number;
    ticketNumber: string;
    vehicleNumber: string;
    vehicleType: string;
    ownerName: string;
    slotNumber: string;
    floor: number;
    entryTime: string;
    message: string;
  }> {
    const res = await fetch(`${API_BASE_URL}/parking/park`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async estimateCheckout(vehicleNumber: string): Promise<ParkingReceipt> {
    const res = await fetch(`${API_BASE_URL}/parking/estimate/${encodeURIComponent(vehicleNumber)}`);
    return handleResponse<ParkingReceipt>(res);
  },

  async checkoutVehicle(vehicleNumber: string, paymentMethod: string): Promise<ParkingReceipt> {
    const res = await fetch(`${API_BASE_URL}/parking/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleNumber, paymentMethod }),
    });
    return handleResponse<ParkingReceipt>(res);
  },

  async getActiveSessions(): Promise<ParkingSession[]> {
    const res = await fetch(`${API_BASE_URL}/parking/active`);
    return handleResponse<ParkingSession[]>(res);
  },

  async getParkingHistory(search?: string, status?: string, vehicleType?: string): Promise<ParkingSession[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (vehicleType) params.append('vehicleType', vehicleType);

    const res = await fetch(`${API_BASE_URL}/parking/history?${params.toString()}`);
    return handleResponse<ParkingSession[]>(res);
  },

  async getTicket(sessionId: number): Promise<ParkingTicket> {
    const res = await fetch(`${API_BASE_URL}/parking/ticket/${sessionId}`);
    return handleResponse<ParkingTicket>(res);
  },

  async getReceipt(sessionId: number): Promise<ParkingReceipt> {
    const res = await fetch(`${API_BASE_URL}/parking/receipt/${sessionId}`);
    return handleResponse<ParkingReceipt>(res);
  },

  // Reports
  async getReports(): Promise<ReportSummary> {
    const res = await fetch(`${API_BASE_URL}/reports`);
    return handleResponse<ReportSummary>(res);
  },

  getExportUrl(type: 'txt' | 'backup' = 'txt'): string {
    return `${API_BASE_URL}/reports/export?type=${type}`;
  },

  // OOP Viva Demos
  async getDemo(concept: string): Promise<{ concept: string; output: string }> {
    const res = await fetch(`${API_BASE_URL}/demo/${concept}`);
    return handleResponse<{ concept: string; output: string }>(res);
  },

  async getAllDemos(): Promise<Record<string, string>> {
    const res = await fetch(`${API_BASE_URL}/demo/all`);
    return handleResponse<Record<string, string>>(res);
  },
};
