import type { InvoiceStatus } from '../types/maintenance.types';

export const STATUS_CONFIG: Record<InvoiceStatus, { bg: string; color: string; icon: string }> = {
  'Pending': { bg: '#fef3c7', color: '#92400e', icon: 'bi-clock' },
  'Paid': { bg: '#d1fae5', color: '#065f46', icon: 'bi-check-lg' },
  'Overdue': { bg: '#fee2e2', color: '#991b1b', icon: 'bi-exclamation-circle' },
};