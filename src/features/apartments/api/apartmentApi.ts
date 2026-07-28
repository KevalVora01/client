import api from '../../../config/api';
import type { ApiResponse } from '../../../types/api.types';
import type {
  Apartment,
  ApartmentsResponse,
  ApartmentFilters,
  CreateApartmentPayload,
  UpdateApartmentPayload,
} from '../types/apartment.types';

export interface FailedImportItem {
  row: number;
  identifier: string;
  reason: string;
}

export interface ImportResponse {
  successCount: number;
  failedCount: number;
  failedItems: FailedImportItem[];
}

export const apartmentApi = {
  getApartments: async (filters: ApartmentFilters): Promise<ApartmentsResponse> => {
    const params = new URLSearchParams();
    params.append("pageNumber", String(filters.pageNumber));
    params.append("pageSize", String(filters.pageSize));
    if (filters.search) params.append("search", filters.search);
    if (filters.type) params.append("type", filters.type);
    if (filters.isOccupied !== undefined) params.append("isOccupied", String(filters.isOccupied));

    const response = await api.get(`/apartments?${params.toString()}`);
    const body = response.data;
    const dataObj = body?.data?.data || body?.data || body;
    const pageNum = dataObj?.pageNumber || filters.pageNumber;
    const totalP = dataObj?.totalPages || 1;
    return {
      items: Array.isArray(dataObj?.items) ? dataObj.items : [],
      pageNumber: pageNum,
      pageSize: dataObj?.pageSize || filters.pageSize,
      totalCount: dataObj?.totalCount || 0,
      totalPages: totalP,
      hasNextPage: dataObj?.hasNextPage ?? pageNum < totalP,
      hasPreviousPage: dataObj?.hasPreviousPage ?? pageNum > 1,
      stats: dataObj?.stats,
    };
  },

  getApartment: async (id: number): Promise<Apartment> => {
    const response = await api.get(`/apartments/${id}`);
    const body = response.data;
    return body?.data?.data || body?.data || body;
  },

  getVacantApartments: async (): Promise<Apartment[]> => {
    const res = await apartmentApi.getApartments({ pageSize: 100, pageNumber: 1 });
    return res.items.filter((a) => !a.isOccupied);
  },

  createApartment: async (payload: CreateApartmentPayload): Promise<Apartment> => {
    const response = await api.post<ApiResponse<{ data: Apartment }>>('/apartments', payload);
    return response.data.data.data;
  },

  updateApartment: async (id: number, payload: UpdateApartmentPayload): Promise<Apartment> => {
    const response = await api.put<ApiResponse<{ data: Apartment }>>(`/apartments/${id}`, payload);
    return response.data.data.data;
  },

  importApartments: async (file: File): Promise<ImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<{ data: ImportResponse }>>('/apartments/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.data;
  },
  
};