import { useState, useEffect, useCallback } from 'react';
import { bookingApi } from '../api/bookingApi';
import type { Booking } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useBookingDetail = (id: number) => {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const b = await bookingApi.get(id);
      setBooking(b);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load booking'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const b = await bookingApi.get(id);
        if (!cancelled) setBooking(b);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to load booking'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  return { booking, loading, refetch: fetchDetail };
};
