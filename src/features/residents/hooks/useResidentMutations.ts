import { useState } from "react";
import { residentApi } from "../api/residentApi";
import type { CreateResidentPayload, UpdateResidentPayload } from "../types/resident.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";

interface MutationState {
  loading: boolean;
  error: string | null;
}

export const useResidentMutations = (onSuccess?: () => void) => {
  const [createState, setCreateState] = useState<MutationState>({ loading: false, error: null });
  const [updateState, setUpdateState] = useState<MutationState>({ loading: false, error: null });
  const [deactivateState, setDeactivateState] = useState<MutationState>({ loading: false, error: null });

  const createResident = async (payload: CreateResidentPayload): Promise<boolean> => {
    try {
      setCreateState({ loading: true, error: null });
      await residentApi.createResident(payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      setCreateState((prev) => ({
        ...prev,
        error: getErrorMessage(err, "Failed to create resident"),
      }));
      return false;
    } finally {
      setCreateState((prev) => ({ ...prev, loading: false }));
    }
  };

  const updateResident = async (id: number, payload: UpdateResidentPayload): Promise<boolean> => {
    try {
      setUpdateState({ loading: true, error: null });
      await residentApi.updateResident(id, payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      setUpdateState((prev) => ({
        ...prev,
        error: getErrorMessage(err, "Failed to update resident"),
      }));
      return false;
    } finally {
      setUpdateState((prev) => ({ ...prev, loading: false }));
    }
  };

  const deactivateResident = async (id: number): Promise<boolean> => {
    try {
      setDeactivateState({ loading: true, error: null });
      await residentApi.deactivateResident(id);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      setDeactivateState((prev) => ({
        ...prev,
        error: getErrorMessage(err, "Failed to deactivate resident"),
      }));
      return false;
    } finally {
      setDeactivateState((prev) => ({ ...prev, loading: false }));
    }
  };

  return {
    createResident,
    createLoading: createState.loading,
    createError: createState.error,

    updateResident,
    updateLoading: updateState.loading,
    updateError: updateState.error,

    deactivateResident,
    deactivateLoading: deactivateState.loading,
    deactivateError: deactivateState.error,
  };
};