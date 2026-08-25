import api from '../../../config/api';
import type {
  Booking,
  BookingDetail,
  BookingVote,
  BookingStats,
  BookingListFilters,
  CreateBookingPayload,
  VoteChoice,
} from '../types/amenity.types';

export const bookingApi = {
  create: async (payload: CreateBookingPayload): Promise<Booking> => {
    const response = await api.post('/bookings', payload);
    return response.data.data;
  },

  listMine: async (scope: 'upcoming' | 'past' = 'upcoming'): Promise<Booking[]> => {
    const response = await api.get('/bookings/me', { params: { scope } });
    return response.data.data;
  },

  listAdmin: async (filters: BookingListFilters = {}): Promise<Booking[]> => {
    const response = await api.get('/bookings', { params: filters });
    return response.data.data;
  },

  get: async (id: number): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  },

  getDetail: async (id: number): Promise<BookingDetail> => {
    const response = await api.get(`/bookings/${id}/detail`);
    return response.data.data;
  },

  bulkRecordVotes: async (
    id: number,
    votes: { committeeMemberId: number; vote: VoteChoice }[],
    adminVote?: VoteChoice
  ): Promise<BookingVote[]> => {
    const response = await api.post(`/bookings/${id}/votes`, { votes, adminVote });
    return response.data.data;
  },

  finalizeBooking: async (id: number): Promise<Booking> => {
    const response = await api.post(`/bookings/${id}/finalize`);
    return response.data.data;
  },

  cancel: async (id: number, reason: string): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/cancel`, { reason });
    return response.data.data;
  },

  approve: async (id: number): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/approve`);
    return response.data.data;
  },

  reject: async (id: number, reason: string): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/reject`, { reason });
    return response.data.data;
  },

  settle: async (id: number, paymentRef: string): Promise<Booking> => {
    const response = await api.patch(`/bookings/${id}/settle`, { paymentRef });
    return response.data.data;
  },

  stats: async (): Promise<BookingStats> => {
    const response = await api.get('/bookings/stats');
    return response.data.data;
  },

  downloadReceipt: async (id: number): Promise<Blob> => {
    const response = await api.get(`/bookings/${id}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getReceipt: async (id: number): Promise<string> => {
    const response = await api.get(`/bookings/${id}/receipt`, { params: { format: 'json' } });
    return response.data.data.url;
  },
};
