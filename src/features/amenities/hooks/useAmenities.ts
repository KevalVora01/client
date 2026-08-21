import { useState, useEffect, useCallback } from 'react';
import { amenityApi } from '../api/amenityApi';
import type { Amenity } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useAmenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAmenities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await amenityApi.list();
      setAmenities(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch amenities'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await amenityApi.list();
        if (!cancelled) setAmenities(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch amenities'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return { amenities, loading, refetch: fetchAmenities };
};
