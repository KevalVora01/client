import api from '../../../config/api';
import type {
  Notice,
  CreateNoticePayload,
  UpdateNoticePayload,
  NoticeListParams,
  PaginatedNotices,
} from '../types/notice.types';

export const noticeApi = {

  getNotices: async (params?: NoticeListParams): Promise<PaginatedNotices> => {
    const response = await api.get('/notices', { params });
    return response.data.data.data;
  },

  getNotice: async (id: number): Promise<Notice> => {
    const response = await api.get(`/notices/${id}`);
    return response.data.data.data;
  },

  createNotice: async (payload: CreateNoticePayload): Promise<Notice> => {
    const response = await api.post('/notices', payload);
    return response.data.data.data;
  },

  updateNotice: async (id: number, payload: UpdateNoticePayload): Promise<Notice> => {
    const response = await api.put(`/notices/${id}`, payload);
    return response.data.data.data;
  },

  deleteNotice: async (id: number): Promise<void> => {
    await api.delete(`/notices/${id}`);
  },

  togglePin: async (id: number): Promise<Notice> => {
    const response = await api.patch(`/notices/${id}/toggle-pin`);
    return response.data.data.data;
  },

};