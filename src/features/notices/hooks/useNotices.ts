import { useState, useEffect, useCallback } from 'react';
import { noticeApi } from '../api/noticeApi';
import type { Notice, NoticeListParams, PaginatedNotices } from '../types/notice.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useNotices = (params?: NoticeListParams) => {
  const [notices, setNotices] = useState<PaginatedNotices | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const serializedParams = JSON.stringify(params);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    try {
      const parsed = serializedParams ? JSON.parse(serializedParams) : undefined;
      const response = await noticeApi.getNotices(parsed);
      setNotices(response);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch notices'));
    } finally {
      setLoading(false);
    }
  }, [serializedParams]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const parsed = serializedParams ? JSON.parse(serializedParams) : undefined;
        const response = await noticeApi.getNotices(parsed);
        if (!cancelled) setNotices(response);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch notices'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [serializedParams]);

  return { notices, loading, refetch: fetchNotices };
};

export const useNotice = (id: number) => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNotice = useCallback(async () => {
    setLoading(true);
    try {
      const response = await noticeApi.getNotice(id);
      setNotice(response);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch notice'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const response = await noticeApi.getNotice(id);
        if (!cancelled) setNotice(response);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch notice'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [id]);

  return { notice, loading, refetch: fetchNotice };
};