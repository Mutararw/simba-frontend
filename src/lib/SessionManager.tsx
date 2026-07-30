import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useSession, authClient } from "./auth-client";

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);

  // React to session atom changes (broadcast from sign-out, refetch on focus)
  useEffect(() => {
    if (isPending || !user) return;
    if (!session?.user) {
      setUser(null);
      return;
    }
    if (session.user.id !== user.id) {
      setUser(null);
    }
  }, [session, isPending, setUser, user]);

  // Tab visibility/focus: verify session against store on return
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
    window.addEventListener("pageshow", (e) => { if (e.persisted) check(); });
    return () => {
      removeEventListener("visibilitychange", check);
      removeEventListener("focus", check);
    };
  }, []);

  return null;
}
