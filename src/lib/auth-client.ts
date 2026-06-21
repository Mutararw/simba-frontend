import { createAuthClient } from "better-auth/react";
import { API_URL } from "./config";

export const authClient = createAuthClient({
  baseURL: API_URL.endsWith("/api/auth") ? API_URL : `${API_URL}/api/auth`,
});

export const { signIn, signUp, useSession, signOut } = authClient;
