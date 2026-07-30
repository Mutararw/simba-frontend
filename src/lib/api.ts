import axios from "axios";
import { API_URL } from "./config";
import { useAuth } from "@/store/auth";
import { authClient } from "./auth-client";

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

function getGuestId(): string {
  const key = 'simba_guest_id'
  let id = localStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(key, id)
  }
  return id
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  config.headers['x-guest-id'] = getGuestId()
  if (config.url?.startsWith("/api/admin")) {
    const user = useAuth.getState().user;
    if (user) {
      try {
        const { data: session } = await authClient.getSession();
        if (session?.user?.id && session.user.id !== user.id) {
          useAuth.getState().setUser(null);
          window.location.href = "/login";
          return Promise.reject("Session mismatch");
        }
      } catch {}
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.config?.url?.startsWith("/api/admin")) {
      useAuth.getState().setUser(null);
      window.location.href = "/login";
    }
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";
    return Promise.reject(
      new ApiError(message, {
        status: error.response?.status,
        code: error.code,
        details: error.response?.data?.details,
        isNetworkError: !error.response,
      })
    );
  }
);
