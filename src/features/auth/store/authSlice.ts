import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginPayload, User } from '../types/auth.types';
import { getMeApi, loginApi, logoutApi, refreshTokenApi } from '../api/authApi';
import { clearTokens, getRefreshToken, setAccessToken, setRefreshToken } from '../../../config/api';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

export const login = createAsyncThunk<User, LoginPayload>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const loginResponse = await loginApi(payload);
      setAccessToken(loginResponse.accessToken);
      setRefreshToken(loginResponse.refreshToken);

      if (loginResponse.user.mustResetPassword) {
        return loginResponse.user as unknown as User;
      }
      const user = await getMeApi();
      return user as unknown as User;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(axiosErr?.response?.data?.error || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    try {
      await logoutApi();
    } finally {
      clearTokens();
    }
  }
);

export const silentRefresh = createAsyncThunk<User | null>(
  'auth/silentRefresh',
  async (_, { rejectWithValue }) => {
    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
      clearTokens();
      return null;
    }
    try {
      const { accessToken, refreshToken, user: refreshedUser } = await refreshTokenApi(storedRefreshToken);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      if (refreshedUser.mustResetPassword) {
        return refreshedUser as unknown as User;
      }
      const user = await getMeApi();
      return user as unknown as User;
    } catch (err: unknown) {
      clearTokens();
      const axiosErr = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(axiosErr?.response?.data?.error || 'Session restoration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuth(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(silentRefresh.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(silentRefresh.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(silentRefresh.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });

    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.isLoading = false;
        state.error = (action.payload as string) || action.error.message || 'Login failed';
      });

    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { setUser, updateUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;