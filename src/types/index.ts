// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  phone?: string;
  avatar?: string;
}

export interface AuthUser extends User {
  token: string;
}

// Computer types
export interface Computer {
  id: string;
  name: string;
  type: 'gaming' | 'standard' | 'premium';
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    monitor: string;
  };
  status: 'available' | 'booked' | 'maintenance';
  hourlyRate: number;
  image?: string;
}

// Booking types
export interface TimeSlot {
  start: string; // ISO date string
  end: string; // ISO date string
}

export interface Booking {
  id: string;
  userId: string;
  userName?: string;
  computerId: string;
  computerName?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalPrice: number;
  createdAt: string;
}

// Analytics types
export interface DailyStats {
  date: string;
  bookings: number;
  revenue: number;
}

export interface ComputerUsage {
  computerId: string;
  computerName: string;
  hoursBooked: number;
  bookingsCount: number;
  revenue: number;
}

export interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  dailyStats: DailyStats[];
  computerUsage: ComputerUsage[];
  userStats: {
    new: number;
    returning: number;
  };
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
