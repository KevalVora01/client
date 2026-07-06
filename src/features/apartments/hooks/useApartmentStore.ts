import { create } from 'zustand';
import type { ApartmentFilters } from '../types/apartment.types';

interface ApartmentStore {
  filters: ApartmentFilters;
  updateFilters: (newFilters: Partial<ApartmentFilters>) => void;
  changePage: (pageNumber: number) => void;
  resetFilters: () => void;
}

const initialFilters: ApartmentFilters = {
  pageNumber: 1,
  pageSize: 5,
  block: undefined,
  floorNumber: undefined,
  type: undefined,
  isOccupied: undefined,
};

export const useApartmentStore = create<ApartmentStore>((set) => ({
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