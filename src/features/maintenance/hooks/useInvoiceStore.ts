import { create } from 'zustand';
import type { InvoiceListParams } from '../types/maintenance.types';

interface InvoiceStore {
  filters: InvoiceListParams;
  updateFilters: (newFilters: Partial<InvoiceListParams>) => void;
  changePage: (pageNumber: number) => void;
  resetFilters: () => void;
}

const initialFilters: InvoiceListParams = {
  pageNumber: 1,
  pageSize: 10,
};

export const useInvoiceStore = create<InvoiceStore>((set) => ({
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