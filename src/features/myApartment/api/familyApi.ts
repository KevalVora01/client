import api from '../../../config/api';
import type { FamilyMember, CreateFamilyMemberPayload, UpdateFamilyMemberPayload } from '../types/familyMember.types';

export const familyApi = {

  getFamilyMembers: async (residentId: number): Promise<FamilyMember[]> => {
    const response = await api.get(`/residents/${residentId}/family-members`);
    return response.data.data;
  },

  createFamilyMember: async (residentId: number, payload: CreateFamilyMemberPayload): Promise<FamilyMember> => {
    const response = await api.post(`/residents/${residentId}/family-members`, payload);
    return response.data.data;
  },

  updateFamilyMember: async (residentId: number, id: number, payload: UpdateFamilyMemberPayload): Promise<FamilyMember> => {
    const response = await api.put(`/residents/${residentId}/family-members/${id}`, payload);
    return response.data.data;
  },

  deleteFamilyMember: async (residentId: number, id: number): Promise<void> => {
    await api.delete(`/residents/${residentId}/family-members/${id}`);
  },

};