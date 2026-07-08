import { create } from 'zustand';
import type { ComplaintListParams } from '../types/complaint.types';

interface ComplaintStore {
  filters: ComplaintListParams;
  updateFilters: (newFilters: Partial<ComplaintListParams>) => void;
  changePage: (pageNumber: number) => void;
  resetFilters: () => void;
}

const initialFilters: ComplaintListParams = {
  pageNumber: 1,
  pageSize: 10,
};

export const useComplaintStore = create<ComplaintStore>((set) => ({
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