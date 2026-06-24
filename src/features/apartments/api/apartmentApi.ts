import api from '../../../config/api';
import type { ApiResponse } from '../../../types/api.types';
import type {
  Apartment,
  ApartmentsResponse,
  ApartmentFilters,
  CreateApartmentPayload,
  UpdateApartmentPayload,
} from '../types/apartment.types';

export const apartmentApi = {

  getApartments: async (filters: ApartmentFilters): Promise<ApartmentsResponse> => {
    const params = new URLSearchParams();
    params.append("pageNumber", String(filters.pageNumber));
    params.append("pageSize", String(filters.pageSize));
    if (filters.block) params.append("block", filters.block);
    if (filters.floorNumber) params.append("floorNumber", String(filters.floorNumber));
    if (filters.type) params.append("type", filters.type);

    const response = await api.get<ApiResponse<{ data: ApartmentsResponse }>>(`/apartments?${params.toString()}`);
    return response.data.data.data;
  },

  getApartment: async (id: number): Promise<Apartment> => {
    const response = await api.get<ApiResponse<{ data: Apartment }>>(`/apartments/${id}`);
    return response.data.data.data;
  },

  createApartment: async (payload: CreateApartmentPayload): Promise<Apartment> => {
    const response = await api.post<ApiResponse<{ data: Apartment }>>('/apartments', payload);
    return response.data.data.data;
  },

  updateApartment: async (id: number, payload: UpdateApartmentPayload): Promise<Apartment> => {
    const response = await api.put<ApiResponse<{ data: Apartment }>>(`/apartments/${id}`, payload);
    return response.data.data.data;
  },

};