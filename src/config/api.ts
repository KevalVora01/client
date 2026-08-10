import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { connectSocket } from '../services/socket';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── In-memory access token ───────────────────────────────────────
let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

// ─── Axios instance ───────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request interceptor ─────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

// ─── Endpoints that should never trigger refresh logic ────────────
const skipRefreshUrls = [
  '/auth/refresh',
  '/auth/login',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password',
];

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints
    const isSkipped = skipRefreshUrls.some((url) =>
      originalRequest.url?.includes(url)
    );

    // 403 from jwtMiddleware (mustResetPassword) — force redirect
    if (
      error.response?.status === 403 &&
      !isSkipped &&
      typeof error.response?.data?.error === 'string' &&
      error.response.data.error.includes('Password reset required')
    ) {
      setAccessToken(null);
      window.location.href = '/set-password-required';
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry && !isSkipped) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken: string = data.data.accessToken;
        setAccessToken(newToken);
        connectSocket(accessToken ?? '');
        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;