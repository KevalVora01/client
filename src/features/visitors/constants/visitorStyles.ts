import type { VisitorStatus } from '../types/visitor.types';

export const STATUS_CONFIG: Record<VisitorStatus, { bg: string; color: string; icon: string }> = {
  'Pending': { bg: '#fef3c7', color: '#92400e', icon: 'bi-hourglass-split' },
  'Approved': { bg: '#dbeafe', color: '#1e40af', icon: 'bi-check-circle' },
  'Rejected': { bg: '#fee2e2', color: '#991b1b', icon: 'bi-x-circle' },
  'CheckedIn': { bg: '#d1fae5', color: '#065f46', icon: 'bi-box-arrow-in-right' },
  'CheckedOut': { bg: '#f3f4f6', color: '#4b5563', icon: 'bi-box-arrow-right' },
};