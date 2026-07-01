import { useState, useEffect } from "react";
import { apartmentApi } from "../api/apartmentApi";
import type { Apartment } from "../types/apartment.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";

export const useApartment = (id: number) => {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apartmentApi.getApartment(id);
        if (!cancelled) setApartment(response);
      } catch (err: unknown) {
        if (!cancelled) setError(getErrorMessage(err, "Failed to fetch apartment"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [id, refreshKey]);

  const refetch = () => setRefreshKey((prev) => prev + 1);

  return { apartment, loading, error, refetch };
};