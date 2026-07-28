import { useState, useEffect, useCallback } from 'react';
import type { Visitor, VisitorStatus, VisitorListParams } from '../types/visitor.types';
import { visitorApi } from '../api/visitorApi';
import { showError } from '../../../utils/toast';

interface UseVisitorsOptions {
  userRole?: 'admin' | 'resident' | 'security';
  pageSize?: number;
}

export const useVisitors = (options: UseVisitorsOptions = {}) => {
  const { userRole = 'resident', pageSize = 9 } = options;

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<VisitorStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: VisitorListParams = {
        pageNumber,
        pageSize,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery.trim() || undefined,
      };

      const result = userRole === 'resident'
        ? await visitorApi.getMyVisitors(params)
        : await visitorApi.getAll(params);

      setVisitors(result.items);
      setTotalPages(result.totalPages || 1);
      setTotalCount(result.totalCount || result.items.length);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const msg = axiosError?.response?.data?.message || 'Failed to fetch visitor logs';
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  }, [userRole, pageNumber, pageSize, statusFilter, searchQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const params: VisitorListParams = {
          pageNumber,
          pageSize,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          search: searchQuery.trim() || undefined,
        };

        const result = userRole === 'resident'
          ? await visitorApi.getMyVisitors(params)
          : await visitorApi.getAll(params);

        if (isMounted) {
          setVisitors(result.items);
          setTotalPages(result.totalPages || 1);
          setTotalCount(result.totalCount || result.items.length);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const axiosError = err as { response?: { data?: { message?: string } } };
          const msg = axiosError?.response?.data?.message || 'Failed to fetch visitor logs';
          setError(msg);
          showError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [userRole, pageNumber, pageSize, statusFilter, searchQuery]);

  const handleFilterChange = (status: VisitorStatus | 'ALL') => {
    setStatusFilter(status);
    setPageNumber(1);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setPageNumber(1);
  };

  return {
    visitors,
    loading,
    error,
    statusFilter,
    searchQuery,
    pageNumber,
    totalPages,
    totalCount,
    setPageNumber,
    setStatusFilter: handleFilterChange,
    setSearchQuery: handleSearchSubmit,
    refetch: fetchVisitors,
  };
};

export default useVisitors;
