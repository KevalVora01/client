export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled';

export interface Amenity {
  id: number;
  name: string;
  description: string | null;
  capacity: number | null;
  operatingStart: string;
  operatingEnd: string;
  isActive: boolean;
  createdAt: string;
} 

export interface Blackout {
  id: number;
  amenityId: number;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  createdByAdminId: number;
  createdAt: string;
}

export interface Booking {
  id: number;
  amenityId: number;
  apartmentId: number | null;
  residentId: number | null;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose: string | null;
  status: BookingStatus;
  rejectionReason: string | null;
  cancellationReason: string | null;
  approvedBySecurityId: number | null;
  paidAt: string | null;
  paymentRef: string | null;
  createdAt: string;
}

export type AvailabilitySlotStatus = 'free' | 'booked' | 'blackout' | 'closed';

export interface AvailabilitySlot {
  start: string;
  end: string;
  status: AvailabilitySlotStatus;
}

export interface AvailabilityResult {
  date: string;
  operatingStart: string;
  operatingEnd: string;
  slots: AvailabilitySlot[];
}

export interface BookingStats {
  Confirmed: number;
  Pending: number;
  Rejected: number;
  Cancelled: number;
}

export interface CreateAmenityPayload {
  name: string;
  description?: string | null;
  capacity?: number | null;
  operatingStart: string;
  operatingEnd: string;
  isActive?: boolean;
}

export interface UpdateAmenityPayload {
  name?: string;
  description?: string | null;
  capacity?: number | null;
  operatingStart?: string;
  operatingEnd?: string;
  isActive?: boolean;
}

export interface CreateBlackoutPayload {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export interface CreateBookingPayload {
  amenityId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  purpose?: string | null;
  residentId?: number;
  apartmentId?: number;
}

export interface BookingListFilters {
  amenityId?: number;
  date?: string;
  status?: BookingStatus;
  residentId?: number;
}
