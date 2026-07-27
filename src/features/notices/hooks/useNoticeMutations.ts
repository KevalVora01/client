import { useState } from 'react';
import { noticeApi } from '../api/noticeApi';
import type { CreateNoticePayload, UpdateNoticePayload } from '../types/notice.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showSuccess, showError } from '../../../utils/toast';

export const useNoticeMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);

  const createNotice = async (payload: CreateNoticePayload): Promise<boolean> => {
    try {
      setLoading(true);
      await noticeApi.createNotice(payload);
      showSuccess('Notice created successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to create notice'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateNotice = async (id: number, payload: UpdateNoticePayload): Promise<boolean> => {
    try {
      setLoading(true);
      await noticeApi.updateNotice(id, payload);
      showSuccess('Notice updated successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to update notice'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotice = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await noticeApi.deleteNotice(id);
      showSuccess('Notice deleted successfully');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to delete notice'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await noticeApi.togglePin(id);
      showSuccess('Notice pin status updated');
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to toggle pin'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNotice,
    updateNotice,
    deleteNotice,
    togglePin,
    loading,
  };
};