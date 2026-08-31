import {
  useState, useEffect, useCallback, useRef, type ReactNode
} from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';
import { setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '../config/api';
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
      const storedRefreshToken = getRefreshToken();
      if (!storedRefreshToken) {
        clearTokens();
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const { accessToken, refreshToken, user: refreshedUser } = await refreshTokenApi(storedRefreshToken);
        setAccessToken(accessToken);
        if (refreshToken) {
          setRefreshToken(refreshToken);
        }
        if (refreshedUser?.mustResetPassword) {
          setUser(refreshedUser as unknown as User);
        } else {
          const user = await getMeApi();
          setUser(user as unknown as User);
        }
      } catch {
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    silentRefresh();
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<User | null> => {
    const loginResponse = await loginApi(payload);
    setAccessToken(loginResponse.accessToken);
    if (loginResponse.refreshToken) {
      setRefreshToken(loginResponse.refreshToken);
    }
    if (loginResponse.user?.mustResetPassword) {
      const user = loginResponse.user as unknown as User;
      setUser(user);
      return user;
    }
    const user = await getMeApi();
    setUser(user as unknown as User);
    return user as unknown as User;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutApi();
    } catch {
      // Even if API fails, clear client state
    } finally {
      clearTokens();
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