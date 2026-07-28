import type { PaginatedResult } from '../../../types/pagination.types';

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';

export interface ExtraCharge {
  label: string;
  amount: number;
}

export interface InvoiceResident {
  id: number;
  userId: number;
  apartmentId: number;
  name?: string;
}

export interface InvoiceApartment {
  id: number;
  block: string;
  floorNumber: number;
  unitNumber: string;
}

export interface Invoice {
  id: number;
  apartmentId: number;
  residentId: number;
  month: number;
  year: number;
  baseAmount: number;
  extraCharges: ExtraCharge[];
  totalAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  paidAt: string | null;
  paymentRef: string | null;
  pdfUrl: string | null;
  createdAt: string;
  resident?: InvoiceResident | null;
  apartment?: InvoiceApartment | null;
}


export interface MaintenanceSetting {
  id: number;
  amount: number;
  updatedAt: string;
}

export interface InvoiceListParams {
  pageNumber?: number;
  pageSize?: number;
  status?: InvoiceStatus;
  month?: number;
  year?: number;
  search?: string;
}

export interface GenerateInvoicesPayload {
  month: number;
  year: number;
  dueDate: string;
  extraCharges?: {
    label: string;
    amount: number;
  }[];
}

export interface UpdateMaintenanceAmountPayload {
  amount: number;
}



export interface AdminDashboardMetrics {
  totalCollected: number;
  totalPending: number;
  overdueCount: number;
}

export interface ResidentDashboardMetrics {
  pendingDues: number;
  nextDueDate: string | null;
}

export type PaginatedInvoices = PaginatedResult<Invoice>;