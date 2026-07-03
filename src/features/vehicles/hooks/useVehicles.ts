import { useState, useEffect } from "react";
import { vehicleApi } from "../api/vehicleApi";
import type { Vehicle } from "../types/vehicle.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useVehicles = (residentId: number) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      try {
        const data = await vehicleApi.getVehicles(residentId);
        if (!cancelled) setVehicles(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, "Failed to fetch vehicles"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => { cancelled = true; };
  }, [residentId]);

  return { vehicles, setVehicles, loading };
};