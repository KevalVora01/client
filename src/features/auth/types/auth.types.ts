export type UserRole = 'admin' | 'resident' | 'security';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  user: User;
}

export interface MeResponse {
  user: User;
}