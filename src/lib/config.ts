const rawApiUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_AUTH_URL?.trim() ||
  "";

export const API_URL =
  rawApiUrl || (typeof window !== "undefined" ? window.location.origin : "");

export const ROUTER_MODE =
  import.meta.env.VITE_ROUTER_MODE === "hash" ? "hash" : "browser";

export const isExplicitApiUrlConfigured = Boolean(rawApiUrl);

export function getAppPath(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return ROUTER_MODE === "hash" ? `/#${normalizedPath}` : normalizedPath;
}

export function getAppUrl(path: string) {
  if (typeof window === "undefined") {
    return getAppPath(path);
  }

  return `${window.location.origin}${getAppPath(path)}`;
}
