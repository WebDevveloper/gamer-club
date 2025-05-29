import { create } from 'zustand';
import { apiClient } from '../api/apiClient';
import type { User } from '../types/index';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isAdmin: false,
  isLoading: false,
  error: null,
  
  initialize: async () => {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    
    set({ isLoading: true });
    
    try {
      const response = await apiClient.auth.getCurrentUser();
      const user = response.data;
      
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('auth_token');
      
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        isLoading: false,
        isInitialized: true,
        error: error instanceof Error ? error.message : 'Failed to authenticate',
      });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.auth.login({ email, password });
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to login',
      });
      throw error;
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.auth.register({ name, email, password });
      const { user, token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      set({
        user,
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to register',
      });
      throw error;
    }
  },
  
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    
    set({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      error: null,
    });
  },
  
  updateProfile: async (userData: Partial<User>) => {
    const { user } = get();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiClient.users.update(user.id, userData);
      const updatedUser = response.data;
      
      set({
        user: { ...user, ...updatedUser },
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      });
      throw error;
    }
  },
}));
