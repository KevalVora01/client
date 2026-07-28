import { useState, useEffect, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';
import type { PaginatedVisitors } from '../types/visitor.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const usePendingVisitors = () => {
  const [visitors, setVisitors] = useState<PaginatedVisitors | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await visitorApi.getAll({ status: 'Pending', pageSize: 20 });
      setVisitors(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch pending visitors'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await visitorApi.getAll({ status: 'Pending', pageSize: 20 });
        if (!cancelled) setVisitors(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch pending visitors'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  return { visitors, loading, refetch: fetchVisitors };
};