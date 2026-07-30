import type { PaginatedResult } from '../../../types/pagination.types';

export type VisitorStatus = 'Pending' | 'Approved' | 'Rejected' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';

export interface VisitorResident {
  id: number;
  userId: number;
  apartmentId: number;
}

export interface VisitorApartment {
  id: number;
  block: string;
  floorNumber: number;
  unitNumber: string;
}

export interface Visitor {
  id: number;
  apartmentId: number;
  residentId: number;
  name: string;
  phone: string;
  purpose: string;
  photoUrl: string | null;
  vehicleNumber: string | null;
  isPreRegistered: boolean;
  expectedAt: string | null;
  status: VisitorStatus;
  approvalRequestedAt: string | null;
  checkedInAt: string | null;
  checkedOutAt: string | null;
  loggedBySecurityId: number | null;
  createdAt: string;
  apartment?: VisitorApartment | null;
  resident?: VisitorResident | null;
}

export interface LogWalkInPayload {
  apartmentId: number;
  name: string;
  phone: string;
  purpose: string;
  vehicleNumber?: string;
}

export interface VisitorListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: VisitorStatus;
  apartmentId?: number;
  search?: string;
}

export interface VisitorDashboardMetrics {
  visitorsToday: number;
  currentlyInside: number;
  averageVisitDurationMinutes: number;
}

export type PaginatedVisitors = PaginatedResult<Visitor>;