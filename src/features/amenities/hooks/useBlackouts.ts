import { useState } from 'react';
import { amenityApi } from '../api/amenityApi';
import type { CreateBlackoutPayload } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showSuccess, showError } from '../../../utils/toast';

export const useBlackouts = (amenityId: number, refetch: () => void) => {
  const [loading, setLoading] = useState(false);

  const create = async (payload: CreateBlackoutPayload): Promise<boolean> => {
    try {
      setLoading(true);
      await amenityApi.createBlackout(amenityId, payload);
      showSuccess('Blackout added successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to add blackout'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (bid: number): Promise<boolean> => {
    try {
      setLoading(true);
      await amenityApi.deleteBlackout(amenityId, bid);
      showSuccess('Blackout removed successfully');
      refetch();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to remove blackout'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, remove, loading };
};
