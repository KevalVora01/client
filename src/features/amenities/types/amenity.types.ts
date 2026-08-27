export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled';

export type AmenityBookingType = 'EXCLUSIVE' | 'SHARED_CAPACITY';

export type VoteChoice = 'Approve' | 'Reject';

export interface Amenity {
  id: number;
  name: string;
  description: string | null;
  capacity: number | null;
  operatingStart: string;
  operatingEnd: string;
  price: number;
  images?: string[];
  bookingType?: AmenityBookingType;
  isSharedCapacity?: boolean;
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

export interface BookingResidentInfo {
  id: number;
  userId: number;
  name: string;
  email?: string;
  phone?: string;
  user?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
  } | null;
  apartment?: BookingApartmentInfo | null;
}

export interface BookingApartmentInfo {
  id: number;
  block: string;
  floorNumber: number;
  unitNumber: string;
  unitFormatted?: string;
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
  receiptUrl?: string | null;
  memberCount?: number;
  resident?: BookingResidentInfo | null;
  apartment?: BookingApartmentInfo | null;
  amenity?: Amenity | null;
  createdAt: string;
}

export interface BusyInterval {
  id?: number;
  startTime: string;
  endTime: string;
  type: 'booking' | 'blackout';
  status?: string;
  label?: string;
  memberCount?: number;
}

export interface SharedCapacitySlot {
  startTime: string;
  endTime: string;
  totalCapacity: number;
  currentOccupancy: number;
  availableSpots: number;
  occupancyPercent: number;
  isBlackout: boolean;
  blackoutReason?: string;
  status: 'Available' | 'Moderate' | 'Almost Full' | 'Full' | 'Blackout';
  isAvailable: boolean;
}

export interface CurrentCrowdStats {
  currentHourSlot: string;
  currentOccupancy: number;
  totalCapacity: number;
  availableSpots: number;
  crowdLevel: 'Quiet' | 'Moderate' | 'Busy' | 'Full' | 'Closed';
}

export interface AvailabilityResult {
  amenityId?: number;
  date: string;
  operatingStart: string;
  operatingEnd: string;
  bookingType?: AmenityBookingType;
  totalCapacity?: number;
  slots: AvailabilitySlot[];
  busyIntervals?: BusyInterval[];
  sharedSlots?: SharedCapacitySlot[];
  currentCrowdNow?: CurrentCrowdStats;
}

export interface AvailabilitySlot {
  startTime?: string;
  endTime?: string;
  start?: string;
  end?: string;
  status?: string;
  available?: boolean;
}

export type AvailabilitySlotStatus = 'free' | 'booked' | 'blackout' | 'closed';

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
  price?: number;
  images?: string[];
  bookingType?: AmenityBookingType;
  isActive?: boolean;
}

export interface UpdateAmenityPayload {
  name?: string;
  description?: string | null;
  capacity?: number | null;
  operatingStart?: string;
  operatingEnd?: string;
  price?: number;
  images?: string[];
  bookingType?: AmenityBookingType;
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
  memberCount?: number;
  purpose?: string | null;
  residentId?: number;
  apartmentId?: number;
}

export interface BookingListFilters {
  amenityId?: number;
  date?: string;
  status?: BookingStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CommitteeMember {
  id: number;
  userId: number;
  apartmentId: number | null;
  fullName?: string | null;
  name?: string;
  email: string;
  user?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

export interface BookingVote {
  id: number;
  bookingId: number;
  committeeMemberId: number | null;
  vote: VoteChoice;
  recordedByAdminId?: number | null;
  createdAt: string;
  committeeMember?: CommitteeMember | null;
}

export interface BookingDetail extends Booking {
  committeeMembers?: CommitteeMember[];
  votes?: BookingVote[];
}

export interface BookingDecisionSummary {
  status: 'Pending' | 'Confirmed' | 'Rejected';
  totalEligible: number;
  votedCount: number;
  approvals: number;
  rejections: number;
  adminVoted: boolean;
  adminDecision: 'Approve' | 'Reject' | null;
  isConcluded: boolean;
}
