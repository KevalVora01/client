import { useState, useEffect } from 'react';
import type { Apartment } from '../types/apartment.types';
import { apartmentApi } from '../api/apartmentApi';
import { getErrorMessage } from '../../../utils/getErrorMessage';

export const useApartmentSelect = (
  currentApartmentId?: number,
  onlyVacant: boolean = false,
  onlyOccupied: boolean = false
) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await apartmentApi.getApartments({ pageSize: 100, pageNumber: 1 });
        let data = res.items || [];

        if (onlyOccupied) {
          data = data.filter((a) => a.isOccupied);
        } else if (onlyVacant) {
          data = data.filter((a) => !a.isOccupied);
        }

        // current apartment add karo agar list mein nahi hai
        if (currentApartmentId && !data.find(a => a.id === currentApartmentId)) {
          try {
            const current = await apartmentApi.getApartment(currentApartmentId);
            if (current) data.unshift(current);
          } catch {
            // ignore
          }
        }

        if (!cancelled) {
          setApartments(data);
        }
      } catch (err: unknown) {
        console.error(getErrorMessage(err, 'Failed to fetch apartments'));
        if (!cancelled) setApartments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [currentApartmentId, onlyVacant, onlyOccupied]);

  return { apartments, loading };
};