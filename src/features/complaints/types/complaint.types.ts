import type { PaginatedResult } from '../../../types/pagination.types';

export type ComplaintPriority = 'Low' | 'Medium' | 'High';
export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';

export interface ComplaintResident {
  id: number;
  userId: number;
  apartmentId: number;
  user?: { id: number; name: string } | null;
  apartment?: { block: string; floorNumber: number; unitNumber: string } | null;
}

export interface ComplaintImage {
  id: number;
  complaintId: number;
  imageUrl: string;
  createdAt: string;
}

export interface Complaint {
  id: number;
  residentId: number;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  resident: ComplaintResident | null;
  images?: ComplaintImage[];
}

export interface ComplaintListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  search?: string;
}

export interface Comment {
  id: number;
  complaintId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: { id: number; name: string } | null;
}

export interface UpdateComplaintStatusPayload {
  status: ComplaintStatus;
}

export type PaginatedComplaints = PaginatedResult<Complaint>;