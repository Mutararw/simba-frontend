import axios from "axios";
import { API_URL } from "./config";

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  isNetworkError: boolean;

  constructor(message: string, options?: { status?: number; code?: string; details?: unknown; isNetworkError?: boolean }) {
    super(message);
    this.name = "ApiError";
    this.status = options?.status;
    this.code = options?.code;
    this.details = options?.details;
    this.isNetworkError = Boolean(options?.isNetworkError);
  }
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiLong = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

function errorInterceptor(error: unknown) {
  const axiosErr = error as any;
  const message = axiosErr?.response?.data?.message || axiosErr?.message || "An unexpected error occurred";
  return Promise.reject(
    new ApiError(message, {
      status: axiosErr?.response?.status,
      code: axiosErr?.code,
      details: axiosErr?.response?.data?.details,
      isNetworkError: !axiosErr?.response,
    })
  );
}

api.interceptors.response.use((r) => r, errorInterceptor);
apiLong.interceptors.response.use((r) => r, errorInterceptor);
