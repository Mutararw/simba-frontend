import { createAuthClient } from "better-auth/react";

// The baseURL points to your backend. 
// In development, if the backend is not running, the client will simply return errors instead of crashing the app.
export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_AUTH_URL || "http://localhost:5000",
});

export const { signIn, signUp, useSession, signOut } = authClient;
