import type { PaginatedRequest, PaginatedResult } from "../../../types/pagination.types";

export const ApartmentType = {
  STUDIO: "studio",
  ONE_BHK: "1bhk",
  TWO_BHK: "2bhk",
  THREE_BHK: "3bhk",
  FOUR_BHK: "4bhk",
} as const;

export type ApartmentType = typeof ApartmentType[keyof typeof ApartmentType];

export interface ApartmentResident {
  id: number;
  isOwner: boolean;
  moveInDate: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export interface Apartment {
  id: number;
  block: string;
  floorNumber: number;
  unitNumber: string;
  flateNumber?: string;
  areaSqft: number;
  type: ApartmentType;
  isOccupied: boolean;
  resident?: ApartmentResident | null;
  createdAt: string;
}

export interface CreateApartmentPayload {
  block: string;
  floorNumber: number;
  unitNumber: string;
  areaSqft: number;
  type: ApartmentType;
}

export interface UpdateApartmentPayload {
  block?: string;
  floorNumber?: number;
  unitNumber?: string;
  areaSqft?: number;
  type?: ApartmentType;
}

export interface ApartmentFilters extends PaginatedRequest {
  search?: string;
  type?: string;
  isOccupied?: boolean;
}

export interface ApartmentStats {
  totalCount: number;
  totalOccupied: number;
  totalVacant: number;
  occupancyRate: number;
}

export interface ApartmentsResponse extends PaginatedResult<Apartment> {
  stats: ApartmentStats;
}

export interface ApartmentSelectOption {
  value: number;
  label: string;
  floor: string;
  block: string;
}

export interface FailedImportItem {
  row: number;
  data: Record<string, unknown>;
  error: string;
}

export interface ImportApartmentResult {
  successCount: number;
  totalProcessed: number;
  failedItems: FailedImportItem[];
}