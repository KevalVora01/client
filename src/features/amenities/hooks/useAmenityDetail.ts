import { useState, useEffect, useCallback } from 'react';
import { amenityApi } from '../api/amenityApi';
import type { Amenity, Blackout } from '../types/amenity.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useAmenityDetail = (id: number) => {
  const [amenity, setAmenity] = useState<Amenity | null>(null);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([amenityApi.get(id), amenityApi.listBlackouts(id)]);
      setAmenity(a);
      setBlackouts(b);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to load amenity'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [a, b] = await Promise.all([amenityApi.get(id), amenityApi.listBlackouts(id)]);
        if (!cancelled) {
          setAmenity(a);
          setBlackouts(b);
        }
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to load amenity'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  return { amenity, blackouts, loading, refetch: fetchDetail };
};
