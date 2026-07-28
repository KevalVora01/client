import { useEffect, useState, useCallback } from "react";
import { residentApi } from "../api/residentApi";
import type { Resident } from "../types/resident.types";

const useMyResident = (enabled: boolean = true) => {
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchResident = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await residentApi.getMyResident();
      setResident(data);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch resident";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await residentApi.getMyResident();
        if (!cancelled) {
          setResident(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to fetch resident";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [enabled]);

  const isOwner = resident?.isOwner ?? false;
  const isOccupant = resident?.isOccupant ?? false;
  const isActiveResident = resident?.isActive ?? false;
  const isCurrentOccupant = isActiveResident && isOccupant;

  return {
    resident,
    loading,
    error,
    isOwner,
    isOccupant,
    isActiveResident,
    isCurrentOccupant,
    canRaiseComplaint: isCurrentOccupant,
    canPayMaintenance: isCurrentOccupant,
    refetch: fetchResident,
  };
};

export default useMyResident;
