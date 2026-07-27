import api from '../../../config/api';
import type { UpdateProfilePayload, ChangePasswordPayload } from '../types/profile.types';

export const profileApi = {

  updateProfile: async (payload: UpdateProfilePayload): Promise<void> => {
    await api.put('/auth/me', payload);
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    await api.put('/auth/me/password', payload);
  },

};