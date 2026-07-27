import { useEffect, useState, useCallback } from "react";
import { documentRequestApi } from "../api/documentRequestApi";
import type { DocumentRequestItem } from "../types/documentRequest.types";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showError } from "../../../utils/toast";

export const useDocumentRequests = (isAdmin: boolean, isOwner: boolean) => {
  const [myRequests, setMyRequests] = useState<DocumentRequestItem[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<DocumentRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (isAdmin) {
          const recRes = await documentRequestApi.getReceivedRequests();
          if (!cancelled) setReceivedRequests(recRes || []);
        } else {
          const myRes = await documentRequestApi.getMyRequests();
          if (!cancelled) setMyRequests(myRes || []);
          if (isOwner) {
            try {
              const recRes = await documentRequestApi.getReceivedRequests();
              if (!cancelled) setReceivedRequests(recRes || []);
            } catch { /* ignore */ }
          }
        }
      } catch (err: unknown) {
        if (!cancelled) showError(getErrorMessage(err, "Failed to load document requests."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isAdmin, isOwner, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { myRequests, receivedRequests, loading, refetch };
};
