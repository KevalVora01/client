import { useState, useEffect, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';
import type { VisitorDashboardMetrics } from '../types/visitor.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useDashboardMetrics = (enabled: boolean = true) => {
  const [metrics, setMetrics] = useState<VisitorDashboardMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);

  const fetchMetrics = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const data = await visitorApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch dashboard metrics'));
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const load = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await visitorApi.getDashboardMetrics();
        if (!cancelled) setMetrics(data);
      } catch (err: unknown) {
        if (!cancelled && !silent) showError(getErrorMessage(err, 'Failed to fetch dashboard metrics'));
      } finally {
        if (!cancelled && !silent) setLoading(false);
      }
    };

    load();

    const handleVisitorUpdate = () => load(true);
    window.addEventListener('visitor-updated', handleVisitorUpdate);
    window.addEventListener('focus', handleVisitorUpdate);

    const pollInterval = setInterval(() => {
      load(true);
    }, 8000);

    return () => {
      cancelled = true;
      window.removeEventListener('visitor-updated', handleVisitorUpdate);
      window.removeEventListener('focus', handleVisitorUpdate);
      clearInterval(pollInterval);
    };
  }, [enabled]);

  return { metrics, loading, refetch: fetchMetrics };
};