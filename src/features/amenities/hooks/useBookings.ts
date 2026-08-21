import { useState, useEffect, useCallback } from 'react';
import { bookingApi } from '../api/bookingApi';
import type { Booking } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useMyBookings = (scope: 'upcoming' | 'past') => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await bookingApi.listMine(scope);
        if (!cancelled) setBookings(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to load bookings'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [scope, nonce]);

  return { bookings, loading, refetch };
};

export const useAdminBookings = (filters: { amenityId?: number; date?: string; status?: string; residentId?: number } = {}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  const serialized = JSON.stringify(filters);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const parsed = serialized ? JSON.parse(serialized) : {};
        const data = await bookingApi.listAdmin(parsed);
        if (!cancelled) setBookings(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to load bookings'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [serialized, nonce]);

  return { bookings, loading, refetch };
};
