import { useState, useEffect } from 'react';
import type { Apartment } from '../types/apartment.types';
import { apartmentApi } from '../api/apartmentApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showInfo } from '../../../utils/toast';

export const useApartmentSelect = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await apartmentApi.getVacantApartments();
        if (!cancelled) {
          setApartments(data);
          if (data.length === 0) {
            showInfo('All apartments are currently occupied. Please try again after some time.');
          }
        }
      } catch (err: unknown) {
        console.error(getErrorMessage(err, 'Failed to fetch apartments'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, []);

  return { apartments, loading };
};