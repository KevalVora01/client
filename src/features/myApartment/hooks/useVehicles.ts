import { useState, useEffect } from "react";
import { vehicleApi } from "../api/vehicleApi";
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from "../types/vehicle.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError, showSuccess } from "../../../utils/toast";

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

  const addVehicle = async (payload: CreateVehiclePayload): Promise<boolean> => {
    try {
      const newVehicle = await vehicleApi.createVehicle(residentId, payload);
      setVehicles((prev) => [...prev, newVehicle]);
      showSuccess("Vehicle added successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to add vehicle"));
      return false;
    }
  };

  const editVehicle = async (id: number, payload: UpdateVehiclePayload): Promise<boolean> => {
    try {
      const updated = await vehicleApi.updateVehicle(residentId, id, payload);
      setVehicles((prev) => prev.map((v) => v.id === id ? updated : v));
      showSuccess("Vehicle updated successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to update vehicle"));
      return false;
    }
  };

  const removeVehicle = async (id: number): Promise<boolean> => {
    try {
      await vehicleApi.deleteVehicle(residentId, id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showSuccess("Vehicle removed successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to remove vehicle"));
      return false;
    }
  };

  return {
    vehicles,
    loading,
    addVehicle,
    editVehicle,
    removeVehicle,
  };
};
