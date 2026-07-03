import api from '../../../config/api';
import type { Vehicle, CreateVehiclePayload, UpdateVehiclePayload } from '../types/vehicle.types';

export const vehicleApi = {

  getVehicles: async (residentId: number): Promise<Vehicle[]> => {
    const response = await api.get(`/residents/${residentId}/vehicles`);
    return response.data.data.data;
  },

  createVehicle: async (residentId: number, payload: CreateVehiclePayload): Promise<Vehicle> => {
    const response = await api.post(`/residents/${residentId}/vehicles`, payload);
    return response.data.data.data;
  },

  updateVehicle: async (residentId: number, id: number, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const response = await api.put(`/residents/${residentId}/vehicles/${id}`, payload);
    return response.data.data.data;
  },

  deleteVehicle: async (residentId: number, id: number): Promise<void> => {
    await api.delete(`/residents/${residentId}/vehicles/${id}`);
  },

};