import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserInfo } from '../types/userTypes';

interface AuthState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  userInfo: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.userInfo = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
      };
      state.isAuthenticated = true;
      state.error = null;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    resetError(state) {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, resetError } =
  authSlice.actions;
export default authSlice.reducer;
