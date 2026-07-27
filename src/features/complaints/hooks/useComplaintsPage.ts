import { useComplaints } from './useComplaints';
import { useComplaintStore } from './useComplaintStore';

export const useComplaintsPage = (isAdmin: boolean, ownOnly: boolean = false) => {
  const { filters, updateFilters, changePage } = useComplaintStore();

  const { complaints, loading, refetch } = useComplaints(filters, isAdmin, ownOnly);

  return {
    complaints,
    loading,
    filters,
    updateFilters,
    changePage,
    refetch,
    pagination: {
      pageNumber: complaints?.pageNumber ?? 1,
      totalPages: complaints?.totalPages ?? 1,
      pageSize: complaints?.pageSize ?? 10,
      totalCount: complaints?.totalCount ?? 0,
      hasNextPage: complaints?.hasNextPage ?? false,
      hasPreviousPage: complaints?.hasPreviousPage ?? false,
    },
  };
};