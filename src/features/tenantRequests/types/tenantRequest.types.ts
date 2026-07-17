export type TenantRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface TenantRequest {
  id: number;
  apartmentId: number;
  requestedBy: number;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  moveInDate: string;
  status: TenantRequestStatus;
  createdAt: string;
  decidedAt: string | null;
  owner?: { id: number; userId: number; apartmentId: number } | null;
  apartment?: { id: number; block: string; floorNumber: number; unitNumber: string } | null;
}

export interface TenantResident {
  id: number;
  userId: number;
  apartmentId: number;
  isOwner: boolean;
  isOccupant: boolean;
  moveInDate: string;
  moveOutDate: string | null;
  isActive: boolean;
  user?: { id: number; name: string; email: string; phone: string } | null;
  apartment?: { id: number; block: string; floorNumber: number; unitNumber: string } | null;
}

export interface OwnerTenantStatus {
  isOwner: boolean;
  apartmentId: number;
  pendingRequest: TenantRequest | null;
  activeTenant: TenantResident | null;
}

export interface SubmitTenantRequestPayload {
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  moveInDate: string;
}

export type VoteChoice = 'Approve' | 'Reject';

export interface TenantRequestVote {
  id: number;
  tenantRequestId: number;
  committeeMemberId: number;
  vote: VoteChoice;
  recordedByAdminId: number;
  createdAt: string;
  committeeMember?: {
    id: number;
    userId: number;
    apartmentId: number;
    user?: { id: number; name: string; email: string } | null;
  } | null;
}

export interface CommitteeMember {
  id: number;
  userId: number;
  apartmentId: number;
  user?: { id: number; name: string; email: string; phone?: string } | null;
}

export interface TenantRequestDetail extends TenantRequest {
  votes: TenantRequestVote[];
  committeeMembers: CommitteeMember[];
}

export interface FinalizeResult {
  request: TenantRequest;
  approved: boolean;
  newResident: {
    id: number;
    userId: number;
    apartmentId: number;
    user?: { id: number; name: string; email: string } | null;
  } | null;
}

export interface TenantRequestFilters {
  status: TenantRequestStatus | 'All';
  pageNumber: number;
  pageSize: number;
}
