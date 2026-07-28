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

    const load = async () => {
      setLoading(true);
      try {
        const data = await visitorApi.getDashboardMetrics();
        if (!cancelled) setMetrics(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch dashboard metrics'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [enabled]);

  return { metrics, loading, refetch: fetchMetrics };
};