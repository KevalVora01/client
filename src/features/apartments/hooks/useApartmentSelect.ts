import { useState, useEffect } from 'react';
import type { Apartment } from '../types/apartment.types';
import { apartmentApi } from '../api/apartmentApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showInfo } from '../../../utils/toast';

export const useApartmentSelect = (currentApartmentId?: number) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await apartmentApi.getVacantApartments();
        
        // ✅ current apartment add karo agar list mein nahi hai
        if (currentApartmentId && !data.find(a => a.id === currentApartmentId)) {
          const current = await apartmentApi.getApartment(currentApartmentId);
          if (current) data.unshift(current);
        }

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
  }, [currentApartmentId]);

  return { apartments, loading };
};