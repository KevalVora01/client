import { useCallback, useEffect, useState } from "react";
import { residentApi } from "../../residents/api/residentApi";
import type { TenantHistoryItem } from "../../residents/types/resident.types";

const useTenantHistory = () => {
  const [tenants, setTenants] = useState<TenantHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [notOwner, setNotOwner] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await residentApi.getMyApartmentTenants();
      const sorted = [...data].sort((a, b) => {
        const aCurrent = a.isActive && !a.moveOutDate ? 1 : 0;
        const bCurrent = b.isActive && !b.moveOutDate ? 1 : 0;
        if (aCurrent !== bCurrent) return bCurrent - aCurrent;
        return new Date(b.moveInDate).getTime() - new Date(a.moveInDate).getTime();
      });
      setTenants(sorted);
      setNotOwner(false);
    } catch (err) {
      const axiosError = err as { response?: { status?: number } };
      if (axiosError?.response?.status === 403) {
        setNotOwner(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const runLoad = async () => {
      setLoading(true);
      try {
        const data = await residentApi.getMyApartmentTenants();
        const sorted = [...data].sort((a, b) => {
          const aCurrent = a.isActive && !a.moveOutDate ? 1 : 0;
          const bCurrent = b.isActive && !b.moveOutDate ? 1 : 0;
          if (aCurrent !== bCurrent) return bCurrent - aCurrent;
          return new Date(b.moveInDate).getTime() - new Date(a.moveInDate).getTime();
        });
        if (!cancelled) {
          setTenants(sorted);
          setNotOwner(false);
        }
      } catch (err) {
        const axiosError = err as { response?: { status?: number } };
        if (axiosError?.response?.status === 403 && !cancelled) {
          setNotOwner(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    runLoad();
    return () => { cancelled = true; };
  }, []);

  return { tenants, loading, notOwner, load };
};

export default useTenantHistory;
