import api from '../../../config/api';
import type { ResidentFilters, ResidentsResponse, ResidentDetail, Resident, CreateResidentPayload, UpdateResidentPayload, TenantHistoryItem } from "../types/resident.types";

export const residentApi = {

  getResidents: async (filters: ResidentFilters): Promise<ResidentsResponse> => {
    const params = new URLSearchParams();

    params.append("pageNumber", String(filters.pageNumber));
    params.append("pageSize", String(filters.pageSize));

    if (filters.search) params.append("search", filters.search);
    if (filters.apartmentId) params.append("apartmentId", String(filters.apartmentId));
    if (filters.isActive !== undefined) params.append("isActive", String(filters.isActive));
    if (filters.isOwner !== undefined) params.append("isOwner", String(filters.isOwner));

    const response = await api.get(`/residents?${params.toString()}`);
    return response.data.data.data;
  },

  getMyApartmentTenants: async (): Promise<TenantHistoryItem[]> => {
    const response = await api.get('/residents/my/tenants');
    return response.data.data;
  },

  getResident: async (id: number): Promise<ResidentDetail> => {
    const response = await api.get(`/residents/${id}`);
    return response.data.data.data;
  },

  getMyResident: async (): Promise<Resident> => {
    const response = await api.get('/residents/me');
    return response.data.data;
  },

  createResident: async (payload: CreateResidentPayload): Promise<ResidentDetail> => {
    const response = await api.post("/residents", payload);
    return response.data.data;
  },

  updateResident: async (id: number, payload: UpdateResidentPayload): Promise<ResidentDetail> => {
    const response = await api.put(`/residents/${id}`, payload);
    return response.data.data;
  },

  deactivateResident: async (id: number): Promise<void> => {
    await api.delete(`/residents/${id}`);
  },

  getResidentByApartment: async (apartmentId: number): Promise<ResidentDetail | null> => {
    const response = await api.get(`/residents/apartment/${apartmentId}`);
    return response.data.data;
  },
};
