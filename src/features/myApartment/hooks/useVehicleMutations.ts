import { useState } from "react";
import { vehicleApi } from "../api/vehicleApi";
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from "../types/vehicle.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError, showSuccess } from "../../../utils/toast";

export const useVehicleMutations = (
  residentId: number,
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>
) => {
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const createVehicle = async (payload: CreateVehiclePayload): Promise<boolean> => {
    try {
      setCreateLoading(true);
      const newVehicle = await vehicleApi.createVehicle(residentId, payload);
      setVehicles((prev) => [...prev, newVehicle]);
      showSuccess("Vehicle added successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to add vehicle"));
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateVehicle = async (id: number, payload: UpdateVehiclePayload): Promise<boolean> => {
    try {
      setUpdateLoading(true);
      const updated = await vehicleApi.updateVehicle(residentId, id, payload);
      setVehicles((prev) => prev.map((v) => v.id === id ? updated : v));
      showSuccess("Vehicle updated successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to update vehicle"));
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deleteVehicle = async (id: number): Promise<boolean> => {
    try {
      setDeleteLoading(true);
      await vehicleApi.deleteVehicle(residentId, id);
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      showSuccess("Vehicle removed successfully");
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to remove vehicle"));
      return false;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    createVehicle, createLoading,
    updateVehicle, updateLoading,
    deleteVehicle, deleteLoading,
  };
};