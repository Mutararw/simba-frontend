import { useEffect, useRef } from "react";
import { useAuth } from "@/store/auth";
import { useSession } from "./auth-client";

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) {
      if (!isPending && session && user && session.user?.id !== user.id) {
        useAuth.getState().setUser(null);
      }
      return;
    }
    if (isPending) return;
    done.current = true;

    if (user) return;

    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: (session.user as any).accountType || "customer",
      });
    }
  }, [session, isPending, setUser, user]);

  return null;
}
