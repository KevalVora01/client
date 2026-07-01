import { useState, useEffect } from "react";
import { apartmentApi } from "../api/apartmentApi";
import type { Apartment, ApartmentFilters, ApartmentStats } from "../types/apartment.types";
import type { PaginatedResult } from "../../../types/pagination.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useApartments = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [pagination, setPagination] = useState<Omit<PaginatedResult<Apartment>, "items">>({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [stats, setStats] = useState<ApartmentStats>({
    totalCount: 0,
    totalOccupied: 0,
    totalVacant: 0,
    occupancyRate: 0,
  });
  const [filters, setFilters] = useState<ApartmentFilters>({
    pageNumber: 1,
    pageSize: 5,
    block: undefined,
    floorNumber: undefined,
    type: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const response = await apartmentApi.getApartments(filters);
        if (!cancelled) {
          setApartments(response.items);
          setStats(response.stats);
          setPagination({
            totalCount: response.totalCount,
            pageNumber: response.pageNumber,
            pageSize: response.pageSize,
            totalPages: response.totalPages,
            hasNextPage: response.hasNextPage,
            hasPreviousPage: response.hasPreviousPage,
          });
        }
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, "Failed to fetch apartments"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [filters, refreshKey]);

  const updateFilters = (newFilters: Partial<ApartmentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, pageNumber: 1 }));
  };

  const changePage = (pageNumber: number) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
  };

  const refetch = () => setRefreshKey((prev) => prev + 1);

  return {
    apartments,
    pagination,
    stats,
    filters,
    loading,
    updateFilters,
    changePage,
    refetch,
  };
};