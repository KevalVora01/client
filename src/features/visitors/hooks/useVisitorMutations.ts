import { useState, useCallback } from 'react';
import { visitorApi } from '../api/visitorApi';
import type { Visitor, LogWalkInPayload } from '../types/visitor.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError, showSuccess } from '../../../utils/toast';

interface PreRegisterPayload {
  name: string;
  phone: string;
  purpose: string;
  expectedAt: string;
  vehicleNumber?: string;
}

export const useVisitorMutations = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionId, setActionId] = useState<number | null>(null);

  const preRegister = useCallback(async (payload: PreRegisterPayload, photo?: File): Promise<Visitor | null> => {
    try {
      setSubmitting(true);
      setLoading(true);
      const visitor = await visitorApi.preRegister(payload, photo);
      showSuccess('Visitor pre-registered successfully!');
      window.dispatchEvent(new CustomEvent('visitor-updated'));
      onSuccess?.();
      return visitor;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to pre-register visitor'));
      return null;
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }, [onSuccess]);

  const logWalkIn = useCallback(async (payload: LogWalkInPayload, photo?: File): Promise<boolean> => {
    try {
      setSubmitting(true);
      setLoading(true);
      await visitorApi.logWalkIn(payload, photo);
      showSuccess('Walk-in visitor logged successfully!');
      window.dispatchEvent(new CustomEvent('visitor-updated'));
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to log walk-in visitor'));
      return false;
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  }, [onSuccess]);

  const respond = useCallback(async (visitorId: number, decision: 'Approve' | 'Reject'): Promise<boolean> => {
    try {
      setActionId(visitorId);
      setLoading(true);
      await visitorApi.respond(visitorId, decision);
      showSuccess(`Visitor entry request ${decision.toLowerCase()}d.`);
      window.dispatchEvent(new CustomEvent('visitor-updated'));
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, `Failed to ${decision.toLowerCase()} visitor`));
      return false;
    } finally {
      setActionId(null);
      setLoading(false);
    }
  }, [onSuccess]);

  const checkIn = useCallback(async (visitorId: number, photo?: File): Promise<boolean> => {
    try {
      setActionId(visitorId);
      setLoading(true);
      await visitorApi.checkIn(visitorId, photo);
      showSuccess('Visitor checked in successfully.');
      window.dispatchEvent(new CustomEvent('visitor-updated'));
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to check in visitor'));
      return false;
    } finally {
      setActionId(null);
      setLoading(false);
    }
  }, [onSuccess]);

  const checkOut = useCallback(async (visitorId: number): Promise<boolean> => {
    try {
      setActionId(visitorId);
      setLoading(true);
      await visitorApi.checkOut(visitorId);
      showSuccess('Visitor checked out successfully.');
      window.dispatchEvent(new CustomEvent('visitor-updated'));
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to check out visitor'));
      return false;
    } finally {
      setActionId(null);
      setLoading(false);
    }
  }, [onSuccess]);

  const cancel = useCallback(async (visitorId: number): Promise<boolean> => {
    try {
      setActionId(visitorId);
      setLoading(true);
      await visitorApi.cancel(visitorId);
      showSuccess('Pre-registration cancelled successfully.');
      window.dispatchEvent(new CustomEvent('visitor-updated'));
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to cancel pre-registration'));
      return false;
    } finally {
      setActionId(null);
      setLoading(false);
    }
  }, [onSuccess]);

  return {
    loading,
    submitting,
    actionId,
    preRegister,
    logWalkIn,
    respond,
    checkIn,
    checkOut,
    cancel,
  };
};

export default useVisitorMutations;