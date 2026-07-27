import { useNotices } from './useNotices';
import { useNoticeStore } from './useNoticeStore';

export const useNoticesPage = () => {
  const { filters, updateFilters, changePage } = useNoticeStore();

  const { notices, loading, refetch } = useNotices(filters);

  return {
    notices,
    loading,
    filters,
    updateFilters,
    changePage,
    refetch,
    pagination: {
      pageNumber: notices?.pageNumber ?? 1,
      totalPages: notices?.totalPages ?? 1,
      pageSize: notices?.pageSize ?? 10,
      totalCount: notices?.totalCount ?? 0,
      hasNextPage: notices?.hasNextPage ?? false,
      hasPreviousPage: notices?.hasPreviousPage ?? false,
    },
  };
};
