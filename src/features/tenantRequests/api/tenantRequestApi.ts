import api from '../../../config/api';
import type { ApiResponse } from '../../../types/api.types';
import type { PaginatedResult } from '../../../types/pagination.types';
import type {
  OwnerTenantStatus,
  SubmitTenantRequestPayload,
  TenantRequest,
  TenantRequestDetail,
  TenantRequestFilters,
  TenantRequestVote,
  FinalizeResult,
  BulkRecordVotesPayload,
} from '../types/tenantRequest.types';

export const tenantRequestApi = {
  getMyStatus: async (): Promise<OwnerTenantStatus> => {
    const response = await api.get<ApiResponse<OwnerTenantStatus>>('/tenant-requests/my');
    return response.data.data;
  },

  submitRequest: async (payload: SubmitTenantRequestPayload): Promise<void> => {
    await api.post('/tenant-requests/', payload);
  },

  revokeTenancy: async (): Promise<void> => {
    await api.post('/tenant-requests/revoke-tenancy');
  },

  listTenantRequests: async (
    filters: TenantRequestFilters
  ): Promise<PaginatedResult<TenantRequest>> => {
    const params = new URLSearchParams();
    if (filters.status !== 'All') params.append('status', filters.status);
    params.append('pageNumber', String(filters.pageNumber));
    params.append('pageSize', String(filters.pageSize));
    const response = await api.get<ApiResponse<PaginatedResult<TenantRequest>>>(
      '/tenant-requests',
      { params }
    );
    return response.data.data;
  },

  getTenantRequest: async (id: number): Promise<TenantRequestDetail> => {
    const response = await api.get<ApiResponse<TenantRequestDetail>>(
      `/tenant-requests/${id}`
    );
    return response.data.data;
  },

  saveVotes: async (
    id: number,
    payload: BulkRecordVotesPayload
  ): Promise<TenantRequestVote[]> => {
    const response = await api.post<ApiResponse<TenantRequestVote[]>>(
      `/tenant-requests/${id}/votes`,
      payload
    );
    return response.data.data;
  },

  finalizeRequest: async (id: number): Promise<FinalizeResult> => {
    const response = await api.post<ApiResponse<FinalizeResult>>(
      `/tenant-requests/${id}/finalize`
    );
    return response.data.data;
  },
};
