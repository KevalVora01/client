import { useState, useEffect, useCallback } from 'react';
import { bookingApi } from '../api/bookingApi';
import type { BookingStats } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useBookingStats = () => {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await bookingApi.stats();
      setStats(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load booking stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refetch: fetchStats };
};
