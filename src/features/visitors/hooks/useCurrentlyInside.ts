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

    const load = async () => {
      setLoading(true);
      try {
        const data = await visitorApi.getCurrentlyInside();
        if (!cancelled) setVisitors(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch visitors currently inside'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  return { visitors, loading, refetch: fetchVisitors };
};