import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi } from './authApi';

interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await loginApi(credentials);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async (credentials: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await loginApi(credentials);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state: AuthState) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state: AuthState, action: any) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state: AuthState, action: any) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
