import { useEffect, useRef } from "react";
import { useAuth } from "@/store/auth";
import { useSession, authClient } from "./auth-client";

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const setupDone = useRef(false);

  // First mount: auto-login from cookie if store is empty.
  // After setup: clear store if session became null (logout) or
  // changed to a different user (cross-tab sign-in).
  useEffect(() => {
    if (isPending) return;
    if (!setupDone.current) {
      setupDone.current = true;
      if (!user && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: (session.user as any).accountType || "customer",
        });
      }
      return;
    }
    if (!user) return;
    if (!session?.user) {
      setUser(null);
      return;
    }
    if (session.user.id !== user.id) {
      setUser(null);
    }
  }, [session, isPending, setUser, user]);

  // Tab focus/visibility: verify session against store on return
  useEffect(() => {
    const check = async () => {
      const storeUser = useAuth.getState().user;
      if (!storeUser) return;
      try {
        const { data: s } = await authClient.getSession();
        if (!s?.user || (s.user.id && s.user.id !== storeUser.id)) {
          useAuth.getState().setUser(null);
        }
      } catch {}
    };
    addEventListener("visibilitychange", check);
    addEventListener("focus", check);
    return () => {
      removeEventListener("visibilitychange", check);
      removeEventListener("focus", check);
    };
  }, []);

  return null;
}
