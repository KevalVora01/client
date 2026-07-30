import { useState, useEffect, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';
import type { Visitor } from '../types/visitor.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';
import useSocket from '../../../hooks/useSocket';

export const useVisitorSearch = () => {
  const socket = useSocket();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await visitorApi.searchByNameOrPhone(searchQuery.trim());
      setResults(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to search visitors'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await visitorApi.searchByNameOrPhone(query.trim());
        if (!cancelled) setResults(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to search visitors'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    if (!socket) return;
    const handleRefresh = () => {
      visitorApi.searchByNameOrPhone(query.trim()).then((data) => setResults(data)).catch(() => {});
    };
    socket.on('notification:new', handleRefresh);
    socket.on('visitor:updated', handleRefresh);
    return () => {
      socket.off('notification:new', handleRefresh);
      socket.off('visitor:updated', handleRefresh);
    };
  }, [socket, query]);

  return { query, setQuery, results, loading, search };
};