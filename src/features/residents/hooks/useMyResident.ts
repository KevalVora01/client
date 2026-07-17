import { useEffect, useState, useCallback } from "react";
import { residentApi } from "../api/residentApi";
import type { Resident } from "../types/resident.types";

const useMyResident = () => {
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResident = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchResident();
  }, [fetchResident]);

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
