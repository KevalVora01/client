import { useState, useEffect, useCallback } from 'react';
import { maintenanceApi } from '../api/maintenanceApi';
import type { MaintenanceSetting } from '../types/maintenance.types';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { showError } from '../../../utils/toast';

export const useMaintenanceSettings = (enabled: boolean = true) => {
  const [setting, setSetting] = useState<MaintenanceSetting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchSetting = useCallback(async () => {
    setLoading(true);
    try {
      const data = await maintenanceApi.getMaintenanceAmount();
      setSetting(data);
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to fetch maintenance amount'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await maintenanceApi.getMaintenanceAmount();
        if (!cancelled) setSetting(data);
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, 'Failed to fetch maintenance amount'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, [enabled]);

  const updateAmount = async (amount: number): Promise<boolean> => {
    try {
      setUpdating(true);
      const updated = await maintenanceApi.updateMaintenanceAmount({ amount });
      setSetting(updated);
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, 'Failed to update maintenance amount'));
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { setting, loading, updating, updateAmount, refetch: fetchSetting };
};