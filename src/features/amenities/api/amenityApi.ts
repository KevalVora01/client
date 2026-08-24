import api from '../../../config/api';
import type {
  Amenity,
  Blackout,
  AvailabilityResult,
  CreateAmenityPayload,
  UpdateAmenityPayload,
  CreateBlackoutPayload,
} from '../types/amenity.types';

export const amenityApi = {
  list: async (): Promise<Amenity[]> => {
    const response = await api.get('/amenities');
    return response.data.data;
  },

  get: async (id: number): Promise<Amenity> => {
    const response = await api.get(`/amenities/${id}`);
    return response.data.data;
  },

  create: async (payload: CreateAmenityPayload | FormData): Promise<Amenity> => {
    const response = await api.post('/amenities', payload);
    return response.data.data;
  },

  update: async (id: number, payload: UpdateAmenityPayload | FormData): Promise<Amenity> => {
    const response = await api.put(`/amenities/${id}`, payload);
    return response.data.data;
  },

  getAvailability: async (id: number, date: string): Promise<AvailabilityResult> => {
    const response = await api.get(`/amenities/${id}/availability`, { params: { date } });
    return response.data.data;
  },

  listBlackouts: async (id: number): Promise<Blackout[]> => {
    const response = await api.get(`/amenities/${id}/blackouts`);
    return response.data.data;
  },

  createBlackout: async (id: number, payload: CreateBlackoutPayload): Promise<Blackout> => {
    const response = await api.post(`/amenities/${id}/blackouts`, payload);
    return response.data.data;
  },

  deleteBlackout: async (id: number, bid: number): Promise<void> => {
    await api.delete(`/amenities/${id}/blackouts/${bid}`);
  },
};
