import { useState, useEffect } from 'react';
import type { Apartment } from '../types/apartment.types';
import { apartmentApi } from '../api/apartmentApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export const useApartmentSelect = (currentApartmentId?: number, onlyVacant: boolean = true) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const data = onlyVacant
          ? await apartmentApi.getVacantApartments()
          : (await apartmentApi.getApartments({ pageSize: 500, pageNumber: 1 })).items;

        // current apartment add karo agar list mein nahi hai
        if (currentApartmentId && !data.find(a => a.id === currentApartmentId)) {
          const current = await apartmentApi.getApartment(currentApartmentId);
          if (current) data.unshift(current);
        }

        if (!cancelled) {
          setApartments(data);
        }
      } catch (err: unknown) {
        console.error(getErrorMessage(err, 'Failed to fetch apartments'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [currentApartmentId, onlyVacant]);

  return { apartments, loading };
};