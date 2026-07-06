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

function normalizeRole(accountType?: string) {
  return accountType === "user" ? "customer" : accountType ?? "customer";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizePassword(password: string) {
  return password.trim();
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
    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = normalizePassword(password);
    const { data, error } = await authClient.signUp.email({
      email: normalizedEmail,
      password: normalizedPassword,
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
      adminRole: (data.user as any).adminRole,
      branchId: (data.user as any).branchId,
      isApproved: (data.user as any).isApproved,
      role: normalizeRole((data.user as any).accountType),
    };
  } catch (error) {
    throw new Error(getAuthErrorMessage(error, "An error occurred during sign up."));
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  try {
    const normalizedEmail = normalizeEmail(email);
    const normalizedPassword = normalizePassword(password);
    const { data, error } = await authClient.signIn.email({
      email: normalizedEmail,
      password: normalizedPassword,
    });

    if (error) {
      throw new Error(error.message || "Invalid credentials.");
    }

    return {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      accountType: (data.user as any).accountType,
      adminRole: (data.user as any).adminRole,
      branchId: (data.user as any).branchId,
      isApproved: (data.user as any).isApproved,
      role: normalizeRole((data.user as any).accountType),
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
