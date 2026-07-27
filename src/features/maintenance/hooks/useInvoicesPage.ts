import { useInvoices } from './useInvoices';
import { useInvoiceStore } from './useInvoiceStore';

export const useInvoicesPage = (isAdmin: boolean, apartmentView: boolean = false) => {
  const { filters, updateFilters, changePage } = useInvoiceStore();

  const { invoices, loading, refetch } = useInvoices(filters, isAdmin, apartmentView);

  return {
    invoices,
    loading,
    filters,
    updateFilters,
    changePage,
    refetch,
    pagination: {
      pageNumber: invoices?.pageNumber ?? 1,
      totalPages: invoices?.totalPages ?? 1,
      pageSize: invoices?.pageSize ?? 10,
      totalCount: invoices?.totalCount ?? 0,
      hasNextPage: invoices?.hasNextPage ?? false,
      hasPreviousPage: invoices?.hasPreviousPage ?? false,
    },
  };
};