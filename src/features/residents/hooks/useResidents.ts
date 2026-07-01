import { useState, useEffect } from "react";
import { residentApi } from "../api/residentApi";
import type { ResidentDetail, ResidentFilters, ResidentStats } from "../types/resident.types";
import type { PaginatedResult } from "../../../types/pagination.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useResidents = () => {
  const [residents, setResidents] = useState<ResidentDetail[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResult<ResidentDetail>, "items">>({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [stats, setStats] = useState<ResidentStats>({  
    totalActive: 0,
    totalOwners: 0,
    totalTenants: 0,
  });

  const [filters, setFilters] = useState<ResidentFilters>({
    pageNumber: 1,
    pageSize: 5,
    search: undefined,
    apartmentId: undefined,
    isActive: undefined,
    isOwner: undefined,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const response = await residentApi.getResidents(filters);
        if (!cancelled) {
          setResidents(response.items);
          setPagination({
            totalCount: response.totalCount,
            pageNumber: response.pageNumber,
            pageSize: response.pageSize,
            totalPages: response.totalPages,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
          });
          setStats(response.stats);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          showError(getErrorMessage(err, "Failed to fetch residents"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();

    return () => { cancelled = true; };
  }, [filters, refreshKey]);

  const updateFilters = (newFilters: Partial<ResidentFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      pageNumber: 1,
    }));
  };

  const changePage = (pageNumber: number) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
  };

  const refetch = () => setRefreshKey((prev) => prev + 1);

  return {
    residents,
    pagination,
    stats,  
    filters,
    loading,
    updateFilters,
    changePage,
    refetch,
  };
};