import axios from "axios";

import { API_BASE_URL } from "../constants/api";

/**
 * Every request carries the browser's HttpOnly session cookie (`withCredentials`), and asks the API to
 * answer sign-ins with a cookie instead of a token in the response (`X-Session-Mode`). There is no token
 * for a script to read or attach: see utils/session.ts.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Session-Mode": "cookie",
  },
});
