import { create } from 'zustand';
import { apiClient } from '../api/apiClient';
import type { Booking } from '../types/index';

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  
  fetchBookings: () => Promise<void>;
  createBooking: (bookingData: Partial<Booking>) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  getUserBookings: () => Booking[];
  getActiveBookings: () => Booking[];
  getPastBookings: () => Booking[];
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.bookings.getAll();
      set({ bookings: response.data, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch bookings',
      });
    }
  },
  
  createBooking: async (bookingData: Partial<Booking>) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.bookings.create(bookingData);
      const newBooking = response.data;
      
      set(state => ({
        bookings: [...state.bookings, newBooking],
        isLoading: false,
      }));
      
      return newBooking;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create booking',
      });
      throw error;
    }
  },
  
  cancelBooking: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiClient.bookings.cancel(id);
      
      set(state => ({
        bookings: state.bookings.map(booking => 
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to cancel booking',
      });
      throw error;
    }
  },
  
  getUserBookings: () => {
    return get().bookings;
  },
  
  getActiveBookings: () => {
    const now = new Date();
    
    return get().bookings.filter(booking => {
      const endTime = new Date(booking.endTime);
      return endTime > now && booking.status !== 'cancelled';
    });
  },
  
  getPastBookings: () => {
    const now = new Date();
    
    return get().bookings.filter(booking => {
      const endTime = new Date(booking.endTime);
      return endTime <= now || booking.status === 'cancelled';
    });
  },
}));
