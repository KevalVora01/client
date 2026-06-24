import { useState } from "react";
import { apartmentApi } from "../api/apartmentApi";
import type { CreateApartmentPayload, UpdateApartmentPayload } from "../types/apartment.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useApartmentMutations = (onSuccess?: () => void) => {
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const createApartment = async (payload: CreateApartmentPayload): Promise<boolean> => {
    try {
      setCreateLoading(true);
      await apartmentApi.createApartment(payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to create apartment"));
      return false;
    } finally {
      setCreateLoading(false);
    }
  };

  const updateApartment = async (id: number, payload: UpdateApartmentPayload): Promise<boolean> => {
    try {
      setUpdateLoading(true);
      await apartmentApi.updateApartment(id, payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to update apartment"));
      return false;
    } finally {
      setUpdateLoading(false);
    }
  };

  return {
    createApartment,
    createLoading,
    updateApartment,
    updateLoading,
  };
};