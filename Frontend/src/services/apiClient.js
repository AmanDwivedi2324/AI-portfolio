import axios from "axios";

/**
 * Shared axios instance for the Node backend.
 * In dev, Vite proxies /api to http://localhost:5000 (see vite.config.js);
 * in production set VITE_API_URL to the deployed backend origin.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 15000,
});

export default apiClient;
