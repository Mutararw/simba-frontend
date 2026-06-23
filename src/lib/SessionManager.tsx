import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { useSession } from "./auth-client";

function normalizeRole(accountType?: string) {
  return accountType === "user" ? "customer" : accountType ?? "customer";
}

export function SessionManager() {
  const { data: session, isPending } = useSession();
  const setUser = useAuth((s) => s.setUser);

  useEffect(() => {
    if (!isPending) {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          role: normalizeRole((session.user as any).accountType),
        });
      } else {
        // Clear user if no session is found (e.g. expired or logged out elsewhere)
        // But only if we currently have a user (to avoid infinite loops or unnecessary state updates)
        setUser(null);
      }
    }
  }, [session, isPending, setUser]);

  return null;
}
