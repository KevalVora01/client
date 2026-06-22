import type { PaginatedRequest, PaginatedResult } from "../../../types/pagination.types";

export interface Resident {
  id: number;
  userId: number;
  apartmentId: number;
  isOwner: boolean;
  moveInDate: string;
  moveOutDate: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ResidentUser {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ResidentApartment {
  id: number;
  block: string;
  flateNumber: string;
  floorNumber: number;
}

export interface ResidentDetail extends Resident {
  user: ResidentUser;
  apartment: ResidentApartment;
}

export interface CreateResidentPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  apartmentId?: number;
  isOwner: boolean;
  moveInDate: string;
}

export interface UpdateResidentPayload {
  name?: string;
  phone?: string;
  apartmentId?: number;
  isOwner?: boolean;
  moveOutDate?: string;
}

export interface ResidentFilters extends PaginatedRequest {
  search?: string;
  apartmentId?: number;
  isActive?: boolean;
  isOwner?: boolean;
}

export type ResidentsResponse = PaginatedResult<ResidentDetail>;