import { useState, useEffect, useCallback } from "react";
import { residentApi } from "../api/residentApi";
import type { ResidentDetail } from "../types/resident.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useResident = (id: number) => {
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchResident = useCallback(async () => {
    setLoading(true);
    try {
      const response = await residentApi.getResident(id);
      setResident(response);
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to fetch resident"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await residentApi.getResident(id);
        if (!cancelled) setResident(response);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, "Failed to fetch resident"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [id]);

  return { resident, loading, refetch: fetchResident };
};