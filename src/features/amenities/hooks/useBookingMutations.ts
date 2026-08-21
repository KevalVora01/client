import { useState } from 'react';
import { bookingApi } from '../api/bookingApi';
import type { CreateBookingPayload } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showSuccess, showError } from '../../../utils/toast';

export const useBookingMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);

  const create = async (payload: CreateBookingPayload): Promise<boolean> => {
    try {
      setLoading(true);
      await bookingApi.create(payload);
      showSuccess('Booking request submitted successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to create booking'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancel = async (id: number, reason: string): Promise<boolean> => {
    try {
      setLoading(true);
      await bookingApi.cancel(id, reason);
      showSuccess('Booking cancelled successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to cancel booking'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await bookingApi.approve(id);
      showSuccess('Booking approved successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to approve booking'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reject = async (id: number, reason: string): Promise<boolean> => {
    try {
      setLoading(true);
      await bookingApi.reject(id, reason);
      showSuccess('Booking rejected successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to reject booking'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const settle = async (id: number, paymentRef: string): Promise<boolean> => {
    try {
      setLoading(true);
      await bookingApi.settle(id, paymentRef);
      showSuccess('Payment recorded successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to record payment'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { create, cancel, approve, reject, settle, loading };
};
