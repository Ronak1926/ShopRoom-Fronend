import axios from "axios";

import { API_BASE_URL } from "../constants/api";
import { TOKEN_MODE, sessionFromResponse, storeSessionToken, tokenForRequest } from "./sessionMode";

/**
 * Every request carries the browser's HttpOnly session cookie (`withCredentials`), and asks the API to
 * answer sign-ins with a cookie instead of a token in the response (`X-Session-Mode`). There is no token
 * for a script to read or attach: see utils/session.ts.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: !TOKEN_MODE,
  headers: {
    "Content-Type": "application/json",
    ...(TOKEN_MODE ? {} : { "X-Session-Mode": "cookie" }),
  },
});

// Token mode (utils/sessionMode.ts): no cookie, so a sign-in answer hands over the token and every
// request carries it. Off by default; the cookie path above is untouched.
if (TOKEN_MODE) {
  apiClient.interceptors.request.use((config) => {
    const token = typeof window === "undefined" ? null : tokenForRequest(window.location.pathname);
    if (token && !config.headers.has("Authorization")) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  });
  apiClient.interceptors.response.use((response) => {
    const session = sessionFromResponse(response.config.url, response.data);
    if (session) storeSessionToken(session.role, session.token);
    return response;
  });
}
