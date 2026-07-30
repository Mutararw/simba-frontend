import { useEffect, useRef } from "react";
import { useAuth } from "@/store/auth";
import { useSession } from "./auth-client";

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);
  const initialized = useRef(false);

  useEffect(() => {
    if (isPending) return;

    if (!initialized.current) {
      initialized.current = true;
      if (session?.user) {
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

    if (session?.user && user && session.user.id !== user.id) {
      return;
    }

    if (!session?.user && user) {
      setUser(null);
    }
  }, [session, isPending, setUser, user]);

  return null;
}
