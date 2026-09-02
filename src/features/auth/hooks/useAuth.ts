  import { useCallback } from 'react';
  import { useAppDispatch, useAppSelector } from '../../../store/hooks';
  import {
    login as loginThunk,
    logout as logoutThunk,
    updateUser as updateUserAction,
  } from '../store/authSlice';
  import type { LoginPayload, User } from '../types/auth.types';

  export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, isLoading } = useAppSelector((state) => state.auth);

    const login = useCallback(
      async (payload: LoginPayload): Promise<User | null> => {
        const result = await dispatch(loginThunk(payload)).unwrap();
        return result;
      },
      [dispatch]
    );

    const logout = useCallback(async (): Promise<void> => {
      await dispatch(logoutThunk()).unwrap();
    }, [dispatch]);

    const updateUser = useCallback(
      (updated: Partial<User>) => {
        dispatch(updateUserAction(updated));
      },
      [dispatch]
    );

    return {
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      updateUser,
    };
  };

  export default useAuth;