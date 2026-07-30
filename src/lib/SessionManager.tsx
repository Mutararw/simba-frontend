import { useEffect, useRef } from "react";
import { useAuth } from "@/store/auth";
import { useSession, authClient } from "./auth-client";

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const setupDone = useRef(false);

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
  }, [session, isPending, setUser, user]);

  useEffect(() => {
    const checkSession = async () => {
      const storeUser = useAuth.getState().user;
      if (!storeUser) return;
      try {
        const { data: s } = await authClient.getSession();
        if (s?.user?.id && s.user.id !== storeUser.id) {
          useAuth.getState().setUser(null);
        }
      } catch {}
    };

    const onShow = () => checkSession();
    document.addEventListener("visibilitychange", onShow);
    window.addEventListener("focus", onShow);

    return () => {
      document.removeEventListener("visibilitychange", onShow);
      window.removeEventListener("focus", onShow);
    };
  }, []);

  return null;
}
