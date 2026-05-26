import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { apiClient, setAuthToken } from "../../utils/apiClient";

import type { Customer, LoginRequest, LoginResponse } from "./authTypes";

type AuthState = {
  token: string | null;
  customer: Customer | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  customer: null,
  status: "idle",
  error: null,
};

export const loginCustomer = createAsyncThunk<LoginResponse, LoginRequest>(
  "auth/loginCustomer",
  async (payload, thunkApi) => {
    try {
      const res = await apiClient.post<LoginResponse>("/api/customers/login", payload);
      return res.data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? err?.message ?? "Login failed";
      return thunkApi.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateToken(state) {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      state.token = token;
      setAuthToken(token);
    },
    logout(state) {
      state.token = null;
      state.customer = null;
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setAuthToken(null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.customer = action.payload.customer ?? null;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }
        setAuthToken(action.payload.token);
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      });
  },
});

export const { hydrateToken, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
