import { useState, useEffect, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';
import type { Visitor } from '../types/visitor.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useCurrentlyInside = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await visitorApi.getCurrentlyInside();
      setVisitors(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch visitors currently inside'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const data = await visitorApi.getCurrentlyInside();
        if (!cancelled) setVisitors(data);
      } catch (err: unknown) {
        if (!cancelled && !silent) showError(getErrorMessage(err, 'Failed to fetch visitors currently inside'));
      } finally {
        if (!cancelled && !silent) setLoading(false);
      }
    };

    load();

    const handleVisitorUpdate = () => load(true);
    window.addEventListener('visitor-updated', handleVisitorUpdate);
    window.addEventListener('focus', handleVisitorUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener('visitor-updated', handleVisitorUpdate);
      window.removeEventListener('focus', handleVisitorUpdate);
    };
  }, []);

  return { visitors, loading, refetch: fetchVisitors };
};