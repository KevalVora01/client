import { useState, useEffect, useCallback } from 'react';
import { maintenanceApi } from '../api/maintenanceApi';
import type { AdminDashboardMetrics, ResidentDashboardMetrics } from '../types/maintenance.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | ResidentDashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await maintenanceApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch dashboard metrics'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await maintenanceApi.getDashboardMetrics();
        if (!cancelled) setMetrics(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch dashboard metrics'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  return { metrics, loading, refetch: fetchMetrics };
};