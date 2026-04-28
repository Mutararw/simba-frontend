import { authClient } from "./auth-client";
import { getAppPath, getAppUrl } from "./config";
import type { User } from "./types";

function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    // Show the real error for debugging, not a generic message
    return error.message || fallback;
  }
  return fallback;
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  accountType: string = "user",
  adminRole?: string,
  branchId?: string
): Promise<User> {
  try {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      accountType,
      adminRole,
      branchId,
    });

    if (error) {
      throw new Error(error.message || "An error occurred during sign up.");
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      accountType: (data.user as any).accountType,
      branchId: (data.user as any).branchId,
      role: (data.user as any).accountType,
    };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "An error occurred during sign up."));
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message || "Invalid credentials.");
    }

    // Return ALL fields from the server including accountType and branchId
    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      accountType: (data.user as any).accountType,
      branchId: (data.user as any).branchId,
      role: (data.user as any).accountType,
    };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Invalid credentials."));
  }
}

export async function signInWithGoogle() {
  try {
    return await authClient.signIn.social({
      provider: "google",
      callbackURL: getAppUrl("/dashboard"),
    });
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Google sign-in is unavailable right now."));
  }
}

export async function signInWithGithub() {
  try {
    return await authClient.signIn.social({
      provider: "github",
      callbackURL: getAppUrl("/dashboard"),
    });
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "GitHub sign-in is unavailable right now."));
  }
}

export async function logout() {
  await authClient.signOut();
  window.location.href = getAppPath("/login");
}

export async function requestReset(email: string): Promise<void> {
  try {
    const { error } = await authClient.forgetPassword({
      email,
      redirectTo: getAppUrl("/reset-password"),
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "Password reset is unavailable right now."));
  }
}
