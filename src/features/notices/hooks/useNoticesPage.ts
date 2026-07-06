import { useState, useCallback } from 'react';
import { useNotices } from './useNotices';
import type { NoticeListParams } from '../types/notice.types';

const DEFAULT_PARAMS: NoticeListParams = {
  pageNumber: 1,
  pageSize: 5,
  isActive: true,
};

export const useNoticesPage = () => {
  const [filters, setFilters] = useState<NoticeListParams>(DEFAULT_PARAMS);

  const { notices, loading, refetch } = useNotices(filters);

  const updateFilters = useCallback((updated: Partial<NoticeListParams>) => {
    setFilters((prev) => ({ ...prev, ...updated, pageNumber: 1 }));
  }, []);

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  return {
    notices,
    loading,
    filters,
    updateFilters,
    changePage,
    refetch,
    pagination: {
      pageNumber:      notices?.pageNumber      ?? 1,
      totalPages:      notices?.totalPages      ?? 1,
      pageSize:        notices?.pageSize        ?? 5,
      totalCount:      notices?.totalCount      ?? 0,
      hasNextPage:     notices?.hasNextPage     ?? false,
      hasPreviousPage: notices?.hasPreviousPage ?? false,
    },
  };
};