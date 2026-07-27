import { useState } from "react";
import { documentRequestApi } from "../api/documentRequestApi";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { showSuccess, showError } from "../../../utils/toast";

export const useDocumentRequestMutations = (onSuccess?: () => void) => {
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const createRequest = async (payload: { documentType: string; customDocumentName?: string; note?: string }): Promise<boolean> => {
    setSubmittingRequest(true);
    try {
      await documentRequestApi.createRequest(payload);
      showSuccess("Document request sent successfully!");
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      showError(getErrorMessage(err, "Failed to create document request."));
      return false;
    } finally {
      setSubmittingRequest(false);
    }
  };

  const uploadDocument = async (requestId: number, file: File): Promise<boolean> => {
    setUploading(true);
    try {
      await documentRequestApi.uploadDocument(requestId, file);
      showSuccess("Document uploaded and request fulfilled!");
      onSuccess?.();
      return true;
    } catch {
      showError("Failed to upload document.");
      return false;
    } finally {
      setUploading(false);
    }
  };

  const rejectRequest = async (requestId: number, reason?: string): Promise<boolean> => {
    setRejecting(true);
    try {
      await documentRequestApi.rejectRequest(requestId, reason || "");
      showSuccess("Request declined.");
      onSuccess?.();
      return true;
    } catch {
      showError("Failed to reject request.");
      return false;
    } finally {
      setRejecting(false);
    }
  };

  const cancelRequest = async (requestId: number): Promise<boolean> => {
    try {
      await documentRequestApi.cancelRequest(requestId);
      showSuccess("Request cancelled.");
      onSuccess?.();
      return true;
    } catch {
      showError("Failed to cancel request.");
      return false;
    }
  };

  return {
    createRequest,
    uploadDocument,
    rejectRequest,
    cancelRequest,
    submittingRequest,
    uploading,
    rejecting,
  };
};
