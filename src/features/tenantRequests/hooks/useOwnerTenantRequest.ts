import { useCallback, useEffect, useState } from 'react';
import { tenantRequestApi } from '../api/tenantRequestApi';
import type { OwnerTenantStatus, SubmitTenantRequestPayload } from '../types/tenantRequest.types';
import { showError, showSuccess } from '../../../utils/toast';

const useOwnerTenantRequest = () => {
  const [status, setStatus] = useState<OwnerTenantStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notOwner, setNotOwner] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tenantRequestApi.getMyStatus();
      setStatus(data);
      setNotOwner(false);
    } catch (err) {
      const axiosError = err as { response?: { status?: number } };
      if (axiosError?.response?.status === 403) {
        setNotOwner(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submitRequest = useCallback(
    async (payload: SubmitTenantRequestPayload) => {
      setActionLoading(true);
      try {
        await tenantRequestApi.submitRequest(payload);
        showSuccess('Tenant request submitted for committee review');
        await load();
      } catch (err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        showError(axiosError?.response?.data?.error || 'Failed to submit tenant request');
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [load]
  );

  const revokeTenancy = useCallback(async () => {
    setActionLoading(true);
    try {
      await tenantRequestApi.revokeTenancy();
      showSuccess('Tenancy revoked successfully');
      await load();
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      showError(axiosError?.response?.data?.error || 'Failed to revoke tenancy');
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [load]);

  return { status, loading, actionLoading, notOwner, load, submitRequest, revokeTenancy };
};

export default useOwnerTenantRequest;
