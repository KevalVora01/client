import api from '../../../config/api';

export interface NotificationItem {
  id: number;
  userId: number;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const notificationApi = {
  getNotifications: async (pageNumber = 1, pageSize = 20): Promise<PaginatedResponse<NotificationItem>> => {
    const response = await api.get('/notifications', { params: { pageNumber, pageSize } });
    return response.data.data.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.data.count;
  },

  markAsRead: async (ids: number[]): Promise<void> => {
    await api.patch('/notifications/read', { ids });
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
