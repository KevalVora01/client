import api from '../../../config/api';
import type {
  Invoice,
  InvoiceListParams,
  PaginatedInvoices,
  MaintenanceSetting,
  GenerateInvoicesPayload,
  UpdateMaintenanceAmountPayload,
  AdminDashboardMetrics,
  ResidentDashboardMetrics,
} from '../types/maintenance.types';

export const maintenanceApi = {

  getMaintenanceAmount: async (): Promise<MaintenanceSetting> => {
    const response = await api.get('/maintenance/settings');
    return response.data.data;
  },

  updateMaintenanceAmount: async (payload: UpdateMaintenanceAmountPayload): Promise<MaintenanceSetting> => {
    const response = await api.put('/maintenance/settings', payload);
    return response.data.data;
  },

  generateInvoices: async (payload: GenerateInvoicesPayload): Promise<Invoice[]> => {
    const response = await api.post('/maintenance/invoices/generate', payload);
    return response.data.data;
  },

  getInvoices: async (params?: InvoiceListParams): Promise<PaginatedInvoices> => {
    const response = await api.get('/maintenance/invoices', { params });
    return response.data.data;
  },

  getMyInvoices: async (params?: InvoiceListParams): Promise<PaginatedInvoices> => {
    const response = await api.get('/maintenance/invoices/my', { params });
    return response.data.data;
  },

  getApartmentInvoices: async (params?: InvoiceListParams): Promise<PaginatedInvoices> => {
    const response = await api.get('/maintenance/invoices/apartment', { params });
    return response.data.data;
  },

  getInvoice: async (id: number): Promise<Invoice> => {
    const response = await api.get(`/maintenance/invoices/${id}`);
    return response.data.data;
  },

  markInvoiceSettled: async (id: number, paymentRef?: string): Promise<Invoice> => {
    const response = await api.patch(`/maintenance/invoices/${id}/settle`, { paymentRef });
    return response.data.data;
  },



  downloadReceipt: async (invoiceId: number): Promise<Blob> => {
    const response = await api.get(`/maintenance/invoices/${invoiceId}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getDashboardMetrics: async (): Promise<AdminDashboardMetrics | ResidentDashboardMetrics> => {
    const response = await api.get('/maintenance/dashboard');
    return response.data.data;
  },

  applyPenalties: async (): Promise<{ penaltiesApplied: number; remindersSent: number }> => {
    const response = await api.post('/maintenance/invoices/apply-penalties');
    const body = response.data;
    const data = body?.data?.data || body?.data || body;
    return data ?? { penaltiesApplied: 0, remindersSent: 0 };
  },

};