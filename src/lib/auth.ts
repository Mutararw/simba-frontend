/**
 * Better Auth Client Integration.
 * Points to the backend server configured in auth-client.ts.
 */
import { authClient } from "./auth-client";
import type { User } from "./types";

export async function signUp(email: string, password: string, name: string): Promise<User> {
  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name,
  });

  if (error) {
    throw new Error(error.message || "An error occurred during sign up.");
  }

  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
  };
}

export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "Invalid credentials.");
  }

  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.name,
  };
}

export async function signInWithGoogle() {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: window.location.origin + "/dashboard",
  });
}

export async function signInWithGithub() {
  return await authClient.signIn.social({
    provider: "github",
    callbackURL: window.location.origin + "/dashboard",
  });
}

export async function logout() {
  await authClient.signOut();
  window.location.href = "/login";
}

export async function requestReset(email: string): Promise<void> {
  const { error } = await authClient.forgetPassword({
    email,
    redirectTo: "/reset-password",
  });
  
  if (error) throw new Error(error.message);
}