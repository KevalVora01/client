import type { BookingStatus, AvailabilitySlotStatus } from '../types/amenity.types';

export const BOOKING_STATUS_CONFIG: Record<BookingStatus, { bg: string; color: string; icon: string }> = {
  Pending: { bg: '#fef3c7', color: '#92400e', icon: 'bi-hourglass-split' },
  Confirmed: { bg: '#dbeafe', color: '#1e40af', icon: 'bi-check-circle' },
  Rejected: { bg: '#fee2e2', color: '#991b1b', icon: 'bi-x-circle' },
  Cancelled: { bg: '#f3f4f6', color: '#6b7280', icon: 'bi-slash-circle' },
};

export const SLOT_CONFIG: Record<AvailabilitySlotStatus, { bg: string; color: string; label: string }> = {
  free: { bg: '#d1fae5', color: '#065f46', label: 'Available' },
  booked: { bg: '#fee2e2', color: '#991b1b', label: 'Booked' },
  blackout: { bg: '#1f2937', color: '#ffffff', label: 'Blocked' },
  closed: { bg: '#f3f4f6', color: '#9ca3af', label: 'Closed' },
};

export const SLOT_MINUTES = 30;
