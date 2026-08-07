import { useState } from "react";
import { apartmentApi } from "../api/apartmentApi";
import type { CreateApartmentPayload, ImportApartmentResult } from "../types/apartment.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useApartmentMutations = (onSuccess?: () => void) => {
  const [createLoading, setCreateLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

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

  const importApartments = async (file: File): Promise<ImportApartmentResult | null> => {
    try {
      setImportLoading(true);
      const res = await apartmentApi.importApartments(file);
      onSuccess?.();
      return res;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to import apartments"));
      return null;
    } finally {
      setImportLoading(false);
    }
  };

  return {
    createApartment,
    createLoading,
    importApartments,
    importLoading,
  };
};