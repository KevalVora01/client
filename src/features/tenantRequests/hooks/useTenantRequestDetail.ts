import { useCallback, useEffect, useState } from 'react';
import { tenantRequestApi } from '../api/tenantRequestApi';
import type {
  TenantRequestDetail as TenantRequestDetailData,
  VoteChoice,
} from '../types/tenantRequest.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError, showSuccess } from '../../../utils/toast';
import useAuth from '../../../hooks/useAuth';

const useTenantRequestDetail = (id: number) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [data, setData] = useState<TenantRequestDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await tenantRequestApi.getTenantRequest(id);
      setData(result);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch tenant request'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const recordVote = useCallback(
    async (committeeMemberId: number, vote: VoteChoice) => {
      setActionLoading(true);
      try {
        await tenantRequestApi.recordVote(id, committeeMemberId, vote);
        showSuccess(`Vote recorded: ${vote}`);
        await load();
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to record vote');
        if (/already voted/i.test(msg)) {
          await load();
          showError('This committee member has already voted on this request.');
        } else {
          showError(msg);
        }
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [id, load]
  );

  const recordAdminVote = useCallback(
    async (vote: VoteChoice) => {
      setActionLoading(true);
      try {
        await tenantRequestApi.recordVote(id, undefined, vote);
        showSuccess(`Admin vote recorded: ${vote}`);
        await load();
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to record admin vote');
        if (/already voted/i.test(msg)) {
          await load();
          showError('The admin has already voted on this request.');
        } else {
          showError(msg);
        }
        throw err;
      } finally {
        setActionLoading(false);
      }
    },
    [id, load]
  );

  const finalize = useCallback(async () => {
    setActionLoading(true);
    try {
      const result = await tenantRequestApi.finalizeRequest(id);
      showSuccess(result.approved ? 'Tenant request approved' : 'Tenant request rejected');
      await load();
      return result;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to finalize request'));
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, [id, load]);

  return { data, loading, actionLoading, recordVote, recordAdminVote, finalize, refetch: load, isAdmin };
};

export default useTenantRequestDetail;
