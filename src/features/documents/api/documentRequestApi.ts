import api from "../../../config/api";
import type { CreateDocumentRequestPayload, DocumentRequestItem, DocumentRequestDetail } from "../types/documentRequest.types";

export const documentRequestApi = {
  createRequest: async (payload: CreateDocumentRequestPayload): Promise<DocumentRequestItem> => {
    const res = await api.post<{ success: boolean; data: DocumentRequestItem }>("/document-requests", payload);
    return res.data.data;
  },

  getMyRequests: async (): Promise<DocumentRequestItem[]> => {
    const res = await api.get<{ success: boolean; data: DocumentRequestItem[] }>("/document-requests/my-requests");
    return res.data.data;
  },

  getReceivedRequests: async (): Promise<DocumentRequestItem[]> => {
    const res = await api.get<{ success: boolean; data: DocumentRequestItem[] }>("/document-requests/received-requests");
    return res.data.data;
  },

  uploadDocument: async (requestId: number, file: File): Promise<DocumentRequestItem> => {
    const formData = new FormData();
    formData.append("document", file);
    const res = await api.post<{ success: boolean; data: DocumentRequestItem }>(
      `/document-requests/${requestId}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },

  rejectRequest: async (requestId: number, rejectionReason: string): Promise<DocumentRequestItem> => {
    const res = await api.post<{ success: boolean; data: DocumentRequestItem }>(
      `/document-requests/${requestId}/reject`,
      { rejectionReason }
    );
    return res.data.data;
  },

  cancelRequest: async (requestId: number): Promise<void> => {
    await api.delete(`/document-requests/${requestId}`);
  },

  getDetail: async (requestId: number): Promise<DocumentRequestDetail> => {
    const res = await api.get<{ success: boolean; data: DocumentRequestDetail }>(
      `/document-requests/${requestId}/detail`,
    );
    return res.data.data;
  },

  bulkRecordVotes: async (requestId: number, votes: { committeeMemberId: number; vote: "Approve" | "Reject" }[], adminVote?: "Approve" | "Reject"): Promise<void> => {
    await api.post(`/document-requests/${requestId}/votes`, { votes, adminVote });
  },

  finalizeRequest: async (requestId: number): Promise<DocumentRequestItem> => {
    const res = await api.post<{ success: boolean; data: DocumentRequestItem }>(
      `/document-requests/${requestId}/finalize`,
    );
    return res.data.data;
  },
};
