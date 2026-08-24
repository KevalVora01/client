import { useState } from 'react';
import { amenityApi } from '../api/amenityApi';
import type { CreateAmenityPayload, UpdateAmenityPayload } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showSuccess, showError } from '../../../utils/toast';

export const useAmenityMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);

  const create = async (payload: CreateAmenityPayload | FormData): Promise<boolean> => {
    try {
      setLoading(true);
      await amenityApi.create(payload);
      showSuccess('Amenity created successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to create amenity'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, payload: UpdateAmenityPayload | FormData): Promise<boolean> => {
    try {
      setLoading(true);
      await amenityApi.update(id, payload);
      showSuccess('Amenity updated successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to update amenity'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, loading };
};
