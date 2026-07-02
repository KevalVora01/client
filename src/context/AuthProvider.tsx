import {
  useState, useEffect, useCallback, useRef, type ReactNode
} from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';
import { setAccessToken } from '../config/api';
import { getMeApi, loginApi, logoutApi, refreshTokenApi } from '../features/auth/api/authApi';
import type { User, LoginPayload } from '../features/auth/types/auth.types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const silentRefresh = async () => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      try {
        const { accessToken } = await refreshTokenApi();
        setAccessToken(accessToken);
        const user = await getMeApi();
        setUser(user as unknown as User);
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
    const loginResponse = await loginApi(payload);
    setAccessToken(loginResponse.accessToken);
    const user = await getMeApi();
    setUser(user as unknown as User);
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

  const updateUser = useCallback((updated: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...updated } : prev);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};