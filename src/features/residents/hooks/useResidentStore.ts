import { create } from 'zustand';
import type { ResidentFilters } from '../types/resident.types';

interface ResidentStore {
  filters: ResidentFilters;
  updateFilters: (newFilters: Partial<ResidentFilters>) => void;
  changePage: (pageNumber: number) => void;
  resetFilters: () => void;
}

const initialFilters: ResidentFilters = {
  pageNumber: 1,
  pageSize: 5,
  search: undefined,
  apartmentId: undefined,
  isActive: undefined,
  isOwner: undefined,
};

export const useResidentStore = create<ResidentStore>((set) => ({
  filters: initialFilters,

  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, pageNumber: 1 },
    })),

  changePage: (pageNumber) =>
    set((state) => ({
      filters: { ...state.filters, pageNumber },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}));