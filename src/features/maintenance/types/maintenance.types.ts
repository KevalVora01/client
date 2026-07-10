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
}

export interface GenerateInvoicesPayload {
  month: number;
  year: number;
  dueDate: string;
}

export interface UpdateMaintenanceAmountPayload {
  amount: number;
}

export interface CreatePaymentIntentResult {
  clientSecret: string;
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