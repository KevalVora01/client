import api from '../../../config/api';
import type {
  Complaint,
  ComplaintListParams,
  PaginatedComplaints,
  UpdateComplaintStatusPayload,
} from '../types/complaint.types';

export const complaintApi = {

  getComplaints: async (params?: ComplaintListParams): Promise<PaginatedComplaints> => {
    const response = await api.get('/complaints', { params });
    return response.data.data.data;
  },

  getMyComplaints: async (params?: ComplaintListParams): Promise<PaginatedComplaints> => {
    const response = await api.get('/complaints/my', { params });
    return response.data.data.data;
  },

  getComplaint: async (id: number): Promise<Complaint> => {
    const response = await api.get(`/complaints/${id}`);
    return response.data.data.data;
  },

  updateStatus: async (id: number, payload: UpdateComplaintStatusPayload): Promise<Complaint> => {
    const response = await api.patch(`/complaints/${id}/status`, payload);
    return response.data.data.data;
  },

  createComplaint: async (formData: FormData): Promise<Complaint> => {
    const response = await api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.data;
  },

  addComment: async (id: number, content: string): Promise<void> => {
    await api.post(`/complaints/${id}/comments`, { content });
  },

  getComments: async (id: number) => {
    const response = await api.get(`/complaints/${id}/comments`);
    return response.data.data.data;
  },

};