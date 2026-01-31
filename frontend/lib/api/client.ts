// lib/api/client.ts

import axios, { AxiosInstance, AxiosError } from "axios";

const baseURL =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : "http://localhost:8000";

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------- Response Interceptor ----------------

apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError<{ detail?: string }>) => {

    const message =
      error.response?.data?.detail ??
      (typeof error.response?.data === "string"
        ? error.response.data
        : null) ??
      error.message ??
      "Request failed";

    const code = error.response?.status
      ? `HTTP_${error.response.status}`
      : "NETWORK_ERROR";

    return Promise.reject({
      message,
      code,
      details: error.response?.data,
    });
  }
);

// Optional default export
export default apiClient;
