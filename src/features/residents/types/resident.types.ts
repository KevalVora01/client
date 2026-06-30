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
}

export interface UpdateResidentPayload {
  name?: string;
  phone?: string;
  apartmentId?: number;
  isOwner?: boolean;
  moveOutDate?: Date | string;
}

export interface ResidentFilters extends PaginatedRequest {
  search?: string;
  apartmentId?: number;
  isActive?: boolean;
  isOwner?: boolean;
}

export interface AddResidentModalProps {
  show: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (payload: CreateResidentPayload) => Promise<boolean>;
}

export interface ResidentFormModalProps {
  show: boolean;
  mode: "add" | "edit";
  resident?: ResidentDetail | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateResidentPayload | UpdateResidentPayload, id?: number) => Promise<boolean>;
}

export interface ResidentFiltersProps {
  filters: ResidentFilters;
  onFilterChange: (filters: Partial<ResidentFilters>) => void;
}

export interface ResidentTableProps {
  residents: ResidentDetail[];
  loading: boolean;
  onView: (resident: ResidentDetail) => void;
  onEdit: (resident: ResidentDetail) => void;
  onDeactivate: (resident: ResidentDetail) => void;
}


export interface ApartmentOption {
  value: number;
  label: string;
  floor?: string;
  block?: string;
}

export type ResidentsResponse = PaginatedResult<ResidentDetail>;