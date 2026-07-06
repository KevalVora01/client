import type { PaginatedResult } from '../../../types/pagination.types';

export type NoticeCategory = 'General' | 'Maintenance' | 'Emergency' | 'Event';

export interface NoticeAdmin {
  id: number;
  name: string;
}

export interface Notice {
  id: number;
  adminId: number;
  title: string;
  body: string;
  category: NoticeCategory;
  isPinned: boolean;
  isActive: boolean;
  publishedAt: string;
  updatedAt: string;
  admin: NoticeAdmin | null;
}

export interface CreateNoticePayload {
  title: string;
  body: string;
  category: NoticeCategory;
}

export interface UpdateNoticePayload {
  title?: string;
  body?: string;
  category?: NoticeCategory;
}

export interface NoticeListParams {
  pageNumber?: number;
  pageSize?: number;
  category?: NoticeCategory;
  isPinned?: boolean;
  isActive?: boolean;
  search?: string;
}

export type PaginatedNotices = PaginatedResult<Notice>;