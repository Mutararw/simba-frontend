import { useEffect, useRef } from "react";
import { useAuth } from "@/store/auth";
import { useSession } from "./auth-client";

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const setUser = useAuth((s) => s.setUser);
  const setupDone = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (setupDone.current) return;
    setupDone.current = true;
    if (!session?.user) return;
    const storeUser = useAuth.getState().user;
    if (storeUser) return;
    setUser({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      role: (session.user as any).accountType || "customer",
    });
  }, [session, isPending, setUser]);

  return null;
}
