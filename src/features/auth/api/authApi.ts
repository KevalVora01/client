import api from '../../../config/api';
import type { ApiResponse } from '../../../types/api.types';
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  RefreshTokenResponse,
  MeResponse,
} from '../types/auth.types';

// ─── Login ────────────────────────────────────────────────────────
export const loginApi = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  return response.data.data;
};

// ─── Register ─────────────────────────────────────────────────────
export const registerApi = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
  return response.data.data;
};

// ─── Refresh token ────────────────────────────────────────────────
export const refreshTokenApi = async (): Promise<RefreshTokenResponse> => {
  const response = await api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh');
  return response.data.data;
};

// ─── Get current user ─────────────────────────────────────────────
export const getMeApi = async (): Promise<MeResponse> => {
  const response = await api.get<ApiResponse<MeResponse>>('/auth/me');
  return response.data.data;
};

// ─── Logout ───────────────────────────────────────────────────────
export const logoutApi = async (): Promise<void> => {
  await api.post('/auth/logout');
};