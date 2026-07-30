import api from '../../../config/api';
import type {
  Visitor,
  VisitorListParams,
  PaginatedVisitors,
  LogWalkInPayload,
  VisitorDashboardMetrics,
} from '../types/visitor.types';

export const visitorApi = {

  getById: async (visitorId: number): Promise<Visitor> => {
    const response = await api.get(`/visitors/${visitorId}`);
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  preRegister: async (payload: {
    name: string;
    phone: string;
    purpose: string;
    expectedAt: string;
    vehicleNumber?: string;
  }): Promise<Visitor> => {
    const response = await api.post('/visitors/pre-register', payload);
    const body = response.data;
    return body?.data?.data || body?.data || body;
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
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  respond: async (visitorId: number, decision: 'Approve' | 'Reject'): Promise<Visitor> => {
    const response = await api.post(`/visitors/${visitorId}/respond`, { decision });
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  checkIn: async (visitorId: number, photo?: File): Promise<Visitor> => {
    if (photo) {
      const formData = new FormData();
      formData.append('photo', photo);
      const response = await api.patch(`/visitors/${visitorId}/check-in`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const body = response.data;
      return body?.data?.data || body?.data || body;
    }
    const response = await api.patch(`/visitors/${visitorId}/check-in`);
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  checkOut: async (visitorId: number): Promise<Visitor> => {
    const response = await api.patch(`/visitors/${visitorId}/check-out`);
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  cancel: async (visitorId: number): Promise<void> => {
    await api.delete(`/visitors/${visitorId}`);
  },

  getMyVisitors: async (params?: VisitorListParams): Promise<PaginatedVisitors> => {
    const response = await api.get('/visitors/my', { params });
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  getCurrentlyInside: async (): Promise<Visitor[]> => {
    const response = await api.get('/visitors/current');
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  getAll: async (params?: VisitorListParams): Promise<PaginatedVisitors> => {
    const response = await api.get('/visitors', { params });
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  searchByNameOrPhone: async (query: string): Promise<Visitor[]> => {
    const response = await api.get('/visitors', { params: { search: query, isPreRegistered: true } });
    const body = response.data;
    const dataObj = body?.data?.data || body?.data || body;
    const items: Visitor[] = Array.isArray(dataObj?.items) ? dataObj.items : Array.isArray(dataObj) ? dataObj : [];
    return items.filter((v) => v.isPreRegistered === true);
  },

  getDashboardMetrics: async (): Promise<VisitorDashboardMetrics> => {
    const response = await api.get('/visitors/dashboard');
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

};