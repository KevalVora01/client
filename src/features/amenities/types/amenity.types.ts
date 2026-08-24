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

export interface BusyInterval {
  id?: number;
  startTime: string;
  endTime: string;
  type: 'booking' | 'blackout';
  status?: string;
  label?: string;
}

export interface AvailabilityResult {
  amenityId?: number;
  date: string;
  operatingStart: string;
  operatingEnd: string;
  slots: AvailabilitySlot[];
  busyIntervals?: BusyInterval[];
}

export interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  rejected: number;
  cancelled: number;
  paid?: number;
  Confirmed?: number;
  Pending?: number;
  Rejected?: number;
  Cancelled?: number;
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

export type VoteChoice = 'Approve' | 'Reject';

export interface BookingVote {
  id: number;
  bookingId: number;
  committeeMemberId: number | null;
  vote: VoteChoice;
  recordedByAdminId: number | null;
  createdAt: string;
  committeeMember?: {
    id: number;
    apartmentId: number;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  } | null;
}

export interface CommitteeMember {
  id: number;
  fullName: string;
  email: string;
  apartmentId: number;
}

export interface BookingDetail extends Booking {
  votes: BookingVote[];
  committeeMembers: CommitteeMember[];
  resident?: {
    id: number;
    apartmentId?: number;
    user?: {
      id: number;
      name: string;
      email: string;
      phone: string;
    };
    apartment?: {
      id: number;
      block: string;
      floorNumber: number;
      unitNumber: string;
    };
  } | null;
  amenity?: Amenity | null;
}
