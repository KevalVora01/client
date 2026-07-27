import type { ComplaintPriority, ComplaintStatus } from '../types/complaint.types';

export const PRIORITY_CONFIG: Record<ComplaintPriority, { bg: string; color: string; border: string }> = {
  Low: { bg: '#f3f4f6', color: '#4b5563', border: '#9ca3af' },
  Medium: { bg: '#e0e7ff', color: '#3730a3', border: '#6366f1' },
  High: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' },
};

export const PRIORITY_BORDER_COLOR: Record<ComplaintPriority, string> = {
  Low: PRIORITY_CONFIG.Low.border,
  Medium: PRIORITY_CONFIG.Medium.border,
  High: PRIORITY_CONFIG.High.border,
};

export const STATUS_CONFIG: Record<ComplaintStatus, { bg: string; color: string; icon: string }> = {
  'Open': { bg: '#fef3c7', color: '#92400e', icon: 'bi-clock' },
  'In Progress': { bg: '#dbeafe', color: '#1e40af', icon: 'bi-arrow-repeat' },
  'Resolved': { bg: '#d1fae5', color: '#065f46', icon: 'bi-check-lg' },
};