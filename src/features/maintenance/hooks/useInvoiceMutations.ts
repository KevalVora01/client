import { useState } from 'react';
import { maintenanceApi } from '../api/maintenanceApi';
import type { GenerateInvoicesPayload } from '../types/maintenance.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useInvoiceMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false);

  const generateInvoices = async (payload: GenerateInvoicesPayload): Promise<boolean> => {
    try {
      setLoading(true);
      await maintenanceApi.generateInvoices(payload);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to generate invoices'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markInvoiceSettled = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      await maintenanceApi.markInvoiceSettled(id);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to mark invoice as settled'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateInvoices,
    markInvoiceSettled,
    loading,
  };
};