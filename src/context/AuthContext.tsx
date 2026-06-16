import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  useRef,
} from 'react';
import { setAccessToken } from '../config/api';
import { loginApi, logoutApi, refreshTokenApi } from '../features/auth/api/authApi';
import type { User, LoginPayload } from '../features/auth/types/auth.types';

// ─── Context type ─────────────────────────────────────────────────
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const silentRefresh = async () => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      try {
        const { accessToken, user } = await refreshTokenApi();
        setAccessToken(accessToken);
        setUser(user);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    silentRefresh();
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const { accessToken, user } = await loginApi(payload);
    setAccessToken(accessToken);
    setUser(user);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutApi();
    } catch {
      // Even if API fails, clear client state
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};