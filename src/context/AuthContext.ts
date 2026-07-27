import { createContext } from 'react';
import type { User, LoginPayload } from '../features/auth/types/auth.types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User | null>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);