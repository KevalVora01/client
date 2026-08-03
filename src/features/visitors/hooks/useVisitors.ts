import { useState, useEffect, useCallback } from 'react';
import type { Visitor, VisitorStatus, VisitorListParams } from '../types/visitor.types';
import { visitorApi } from '../api/visitorApi';
import { showError } from '../../../utils/toast';

interface UseVisitorsOptions {
  userRole?: 'admin' | 'resident' | 'security';
  pageSize?: number;
  status?: VisitorStatus | 'ALL';
}

export const useVisitors = (options: UseVisitorsOptions = {}) => {
  const { userRole = 'security', pageSize = 10, status: initialStatus } = options;

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [statusFilter, setStatusFilter] = useState<VisitorStatus | 'ALL'>(initialStatus ?? 'ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const params: VisitorListParams = {
        pageNumber,
        pageSize,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        search: searchQuery.trim() || undefined,
        loggedOnly: statusFilter === 'ALL' && userRole !== 'resident' ? true : undefined,
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
      showError(msg);
    } finally {
      setLoading(false);
    }
  }, [userRole, pageNumber, pageSize, statusFilter, searchQuery]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const params: VisitorListParams = {
          pageNumber,
          pageSize,
          status: statusFilter === 'ALL' ? undefined : statusFilter,
          search: searchQuery.trim() || undefined,
          loggedOnly: statusFilter === 'ALL' && userRole !== 'resident' ? true : undefined,
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
        if (isMounted && !silent) {
          const axiosError = err as { response?: { data?: { message?: string } } };
          const msg = axiosError?.response?.data?.message || 'Failed to fetch visitor logs';
          showError(msg);
        }
      } finally {
        if (isMounted && !silent) {
          setLoading(false);
        }
      }
    };

    loadData();

    const handleVisitorUpdate = () => loadData(true);
    window.addEventListener('visitor-updated', handleVisitorUpdate);
    window.addEventListener('focus', handleVisitorUpdate);

    const pollInterval = setInterval(() => {
      loadData(true);
    }, 8000);

    return () => {
      isMounted = false;
      window.removeEventListener('visitor-updated', handleVisitorUpdate);
      window.removeEventListener('focus', handleVisitorUpdate);
      clearInterval(pollInterval);
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
