import api from '../../../config/api';
import type {
  Visitor,
  VisitorListParams,
  PaginatedVisitors,
  LogWalkInPayload,
  VisitorDashboardMetrics,
} from '../types/visitor.types';

export const visitorApi = {

  preRegister: async (payload: {
    name: string;
    phone: string;
    purpose: string;
    expectedAt: string;
    vehicleNumber?: string;
  }): Promise<Visitor> => {
    const response = await api.post('/visitors/pre-register', payload);
    return response.data.data;
  },

  logWalkIn: async (payload: LogWalkInPayload, photo?: File): Promise<Visitor> => {
    const formData = new FormData();
    formData.append('apartmentId', String(payload.apartmentId));
    formData.append('name', payload.name);
    formData.append('phone', payload.phone);
    formData.append('purpose', payload.purpose);
    if (payload.vehicleNumber) formData.append('vehicleNumber', payload.vehicleNumber);
    if (photo) formData.append('photo', photo);

    const response = await api.post('/visitors/walk-in', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },

  respond: async (visitorId: number, decision: 'Approve' | 'Reject'): Promise<Visitor> => {
    const response = await api.post(`/visitors/${visitorId}/respond`, { decision });
    return response.data.data;
  },

  checkIn: async (visitorId: number): Promise<Visitor> => {
    const response = await api.patch(`/visitors/${visitorId}/check-in`);
    return response.data.data;
  },

  checkOut: async (visitorId: number): Promise<Visitor> => {
    const response = await api.patch(`/visitors/${visitorId}/check-out`);
    return response.data.data;
  },

  cancel: async (visitorId: number): Promise<void> => {
    await api.delete(`/visitors/${visitorId}`);
  },

  getMyVisitors: async (params?: VisitorListParams): Promise<PaginatedVisitors> => {
    const response = await api.get('/visitors/my', { params });
    return response.data.data;
  },

  getCurrentlyInside: async (): Promise<Visitor[]> => {
    const response = await api.get('/visitors/current');
    return response.data.data;
  },

  getAll: async (params?: VisitorListParams): Promise<PaginatedVisitors> => {
    const response = await api.get('/visitors', { params });
    return response.data.data;
  },

  searchByNameOrPhone: async (query: string): Promise<Visitor[]> => {
    const response = await api.get('/visitors', { params: { search: query, status: 'Approved' } });
    return response.data.data.items;
  },

  getDashboardMetrics: async (): Promise<VisitorDashboardMetrics> => {
    const response = await api.get('/visitors/dashboard');
    return response.data.data;
  },

};