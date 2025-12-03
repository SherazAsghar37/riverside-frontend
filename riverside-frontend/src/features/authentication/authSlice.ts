import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, signUpApi } from "./authApi";

interface User {
  name: string;
  email: string;
  id: string;
  token: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Load persisted user from localStorage
const storedUser = localStorage.getItem("user");
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const user = await loginApi(credentials);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error || "Login failed");
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    credentials: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const user = await signUpApi(credentials);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response.data.error || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state: AuthState) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("JWT");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state: AuthState, action) => {
        state.loading = false;
        state.user = action.payload.data;
        // Persist user and token
        localStorage.setItem("user", JSON.stringify(state.user));
        localStorage.setItem("JWT", state.user.token);
      })
      .addCase(login.rejected, (state: AuthState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
