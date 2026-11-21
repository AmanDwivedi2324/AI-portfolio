import axios from "axios";
import { clearToken, getToken } from "./tokenStorage";

/** Fired when the API rejects the session, so the UI can send the admin to login. */
export const UNAUTHORIZED_EVENT = "admin:unauthorized";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 30_000,
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLogin = error.config?.url?.includes("/api/auth/login");
    if (status === 401 && !isLogin) {
      clearToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(toApiError(error));
  },
);

/**
 * Normalise axios errors into { message, status, fieldErrors } where
 * fieldErrors maps "links.github" → "Must be a full URL…".
 */
export function toApiError(error) {
  const payload = error.response?.data?.error;
  const fieldErrors = {};
  (payload?.details ?? []).forEach(({ path, message }) => {
    if (path && !fieldErrors[path]) fieldErrors[path] = message;
  });
  const message =
    payload?.message ??
    (error.code === "ECONNABORTED"
      ? "The server took too long to respond."
      : error.response
        ? "Something went wrong."
        : "Can't reach the server. Is the backend running?");
  const apiError = new Error(message);
  apiError.status = error.response?.status;
  apiError.fieldErrors = fieldErrors;
  return apiError;
}

export default adminApi;
