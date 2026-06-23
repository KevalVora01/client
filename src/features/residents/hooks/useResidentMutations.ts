import { useState } from "react";
import { residentApi } from "../api/residentApi";
import type { CreateResidentPayload, UpdateResidentPayload } from "../types/resident.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useResidentMutations = (onSuccess?: () => void) => {
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const createResident = async (payload: CreateResidentPayload): Promise<boolean> => {
    try {
      setCreateLoading(true);
      await residentApi.createResident(payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to create resident"));
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateResident = async (id: number, payload: UpdateResidentPayload): Promise<boolean> => {
    try {
      setUpdateLoading(true);
      await residentApi.updateResident(id, payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to update resident"));
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  const deactivateResident = async (id: number): Promise<boolean> => {
    try {
      setDeactivateLoading(true);
      await residentApi.deactivateResident(id);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to deactivate resident"));
      return false;
    } finally {
      setDeactivateLoading(false);
    }
  };

  return {
    createResident,
    createLoading,
    updateResident,
    updateLoading,
    deactivateResident,
    deactivateLoading,
  };
};