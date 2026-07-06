import { create } from 'zustand';
import type { NoticeListParams } from '../types/notice.types';

interface NoticeStore {
  filters: NoticeListParams;
  updateFilters: (newFilters: Partial<NoticeListParams>) => void;
  changePage: (pageNumber: number) => void;
  resetFilters: () => void;
}

const initialFilters: NoticeListParams = {
  pageNumber: 1,
  pageSize: 5,
  isActive: true,
};

export const useNoticeStore = create<NoticeStore>((set) => ({
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
