import { create } from 'zustand';
import { apiClient } from '../api/apiClient';
import type { Computer } from '../types';

interface ComputerState {
  computers: Computer[];
  isLoading: boolean;
  error: string | null;
  fetchComputers: () => Promise<void>;
  getComputerById: (id: string) => Computer | undefined;
  getAvailableComputers: () => Computer[];
}

export const useComputerStore = create<ComputerState>((set, get) => ({
  computers: [],
  isLoading: false,
  error: null,

  fetchComputers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.computers.getAll();
      // Здесь — маппим «плоский» ответ в нужный формат
      const computers: Computer[] = response.data.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        type: c.type,
        specs: {
          cpu: c.cpu,
          gpu: c.gpu,
          ram: c.ram,
          storage: c.storage,
          monitor: c.monitor,
        },
        status: c.status,
        hourlyRate: Number(c.hourly_rate),
        image: c.image,
      }));
      set({ computers, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch computers',
      });
    }
  },

  getComputerById: (id: string) =>
    get().computers.find(computer => computer.id === id),

  getAvailableComputers: () =>
    get().computers.filter(computer => computer.status === 'available'),
}));
