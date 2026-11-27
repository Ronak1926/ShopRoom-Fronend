import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { apiClient } from "../../utils/apiClient";
import { getCookie } from "../../utils/cookieUtils";
import { markSignedIn, markSignedOut } from "../../utils/session";
import { saveVerification } from "./emailVerification";

import type {
  Customer,
  GoogleAuthRequest,
  LoginRequest,
  LoginResponse,
  MfaRequiredResponse,
  RegisterRequest,
} from "./authTypes";

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

export const registerCustomer = createAsyncThunk<
  LoginResponse,
  RegisterRequest
>("auth/registerCustomer", async (payload, thunkApi) => {
  try {
    const res = await apiClient.post<LoginResponse>(
      "/api/customers/register",
      payload,
    );
    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Registration failed";
    return thunkApi.rejectWithValue(message);
  }
});

/** The rejection value when the password was right but the email address is not confirmed yet. */
export const EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED";

export const loginCustomer = createAsyncThunk<LoginResponse | MfaRequiredResponse, LoginRequest>(
  "auth/loginCustomer",
  async (payload, thunkApi) => {
    try {
      const res = await apiClient.post<LoginResponse | MfaRequiredResponse>(
        "/api/customers/login",
        payload,
      );
      return res.data;
    } catch (err: any) {
      if (err?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        // The password was right, so the API hands over the token that lets the emailed code finish the sign-in.
        const verificationToken = err.response.data.verificationToken;
        if (typeof verificationToken === "string") saveVerification(payload.email, verificationToken);
        return thunkApi.rejectWithValue(EMAIL_NOT_VERIFIED);
      }
      const message =
        err?.response?.data?.message ?? err?.message ?? "Login failed";
      return thunkApi.rejectWithValue(message);
    }
  },
);

export const googleAuthCustomer = createAsyncThunk<
  LoginResponse | MfaRequiredResponse,
  GoogleAuthRequest
>("auth/googleAuthCustomer", async (payload, thunkApi) => {
  try {
    const res = await apiClient.post<LoginResponse | MfaRequiredResponse>(
      "/api/customers/google-auth",
      payload,
    );
    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Google sign-in failed";
    return thunkApi.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateToken(state) {
      const token = getCookie("token");
      state.token = token;
    },
    /** The second step of signing in finished: start the session. */
    sessionStarted(state, action: PayloadAction<string>) {
      state.status = "succeeded";
      markSignedIn("customer", action.payload);
      state.token = getCookie("token");
      state.error = null;
    },
    logout(state) {
      state.token = null;
      state.customer = null;
      state.status = "idle";
      state.error = null;
      markSignedOut("customer");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginCustomer.fulfilled, (state, action) => {
        if ("mfaRequired" in action.payload) {
          // Password accepted, code still needed: no session yet.
          state.status = "idle";
          return;
        }
        state.status = "succeeded";
        markSignedIn("customer", action.payload.customerId);
        state.token = getCookie("token");
        state.customer = action.payload.customer ?? null;
        state.error = null;
      })
      .addCase(loginCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Login failed";
      })
      .addCase(googleAuthCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(googleAuthCustomer.fulfilled, (state, action) => {
        if ("mfaRequired" in action.payload) {
          state.status = "idle";
          return;
        }
        state.status = "succeeded";
        markSignedIn("customer", action.payload.customerId);
        state.token = getCookie("token");
        state.customer = action.payload.customer ?? null;
        state.error = null;
      })
      .addCase(googleAuthCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Google sign-in failed";
      })
      .addCase(registerCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state, action) => {
        // Not signed in yet: the person confirms their email with a code first, then signs in.
        state.status = "succeeded";
        state.customer = action.payload.customer ?? null;
        state.error = null;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? "Registration failed";
      });
  },
});

export const { hydrateToken, logout, sessionStarted } = authSlice.actions;
export const authReducer = authSlice.reducer;
