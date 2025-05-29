import type { ApiResponse } from '../types/index.ts';

const API_BASE_URL = '/api';

// Helper to get auth token from storage
const getToken = () => {
  return localStorage.getItem('auth_token');
};

// Generic fetch function with auth header
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred');
  }
}

// API client with typed methods
export const apiClient = {
  // Auth endpoints
  auth: {
    register: async (userData: { email: string; password: string; name: string }) => {
      return fetchWithAuth<{ user: any; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    
    login: async (credentials: { email: string; password: string }) => {
      return fetchWithAuth<{ user: any; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    
    getCurrentUser: async () => {
      return fetchWithAuth<any>('/auth/me');
    },
  },
  
  // Users endpoints
  users: {
    getAll: async () => {
      return fetchWithAuth<any[]>('/users');
    },
    
    getById: async (id: string) => {
      return fetchWithAuth<any>(`/users/${id}`);
    },
    
    update: async (id: string, userData: any) => {
      return fetchWithAuth<any>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    },
    
    delete: async (id: string) => {
      return fetchWithAuth<void>(`/users/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Computers endpoints
  computers: {
    getAll: async () => {
      return fetchWithAuth<any[]>('/computers');
    },
    
    getById: async (id: string) => {
      return fetchWithAuth<any>(`/computers/${id}`);
    },
    
    create: async (computerData: any) => {
      return fetchWithAuth<any>('/computers', {
        method: 'POST',
        body: JSON.stringify(computerData),
      });
    },
    
    update: async (id: string, computerData: any) => {
      return fetchWithAuth<any>(`/computers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(computerData),
      });
    },
    
    delete: async (id: string) => {
      return fetchWithAuth<void>(`/computers/${id}`, {
        method: 'DELETE',
      });
    },
  },
  
  // Bookings endpoints
  bookings: {
    getAll: async () => {
      return fetchWithAuth<any[]>('/bookings');
    },
    
    getById: async (id: string) => {
      return fetchWithAuth<any>(`/bookings/${id}`);
    },
    
    create: async (bookingData: any) => {
      return fetchWithAuth<any>('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    },
    
    update: async (id: string, bookingData: any) => {
      return fetchWithAuth<any>(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(bookingData),
      });
    },
    
    cancel: async (id: string) => {
      return fetchWithAuth<any>(`/bookings/${id}/cancel`, {
        method: 'POST',
      });
    },
  },
  
  // Analytics endpoints
  analytics: {
    getOverview: async () => {
      return fetchWithAuth<any>('/analytics');
    },
  },
};
