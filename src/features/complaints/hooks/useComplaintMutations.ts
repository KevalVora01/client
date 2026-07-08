import { useState } from 'react';
import { complaintApi } from '../api/complaintApi';
import type { UpdateComplaintStatusPayload } from '../types/complaint.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useComplaintMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);

  const createComplaint = async (formData: FormData): Promise<boolean> => {
    try {
      setLoading(true);
      await complaintApi.createComplaint(formData);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to create complaint'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, payload: UpdateComplaintStatusPayload): Promise<boolean> => {
    try {
      setLoading(true);
      await complaintApi.updateStatus(id, payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to update complaint status'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (id: number, content: string): Promise<boolean> => {
    try {
      setLoading(true);
      await complaintApi.addComment(id, content);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to add comment'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createComplaint,
    updateStatus,
    addComment,
    loading,
  };
};