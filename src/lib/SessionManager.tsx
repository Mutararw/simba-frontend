import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { getSession } from "./auth-client";

export function SessionManager() {
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);

  useEffect(() => {
    if (user) return;

    getSession().then(({ data, error }) => {
      if (error || !data?.user) return;
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image,
        role: (data.user as any).accountType || "customer",
      });
    });
  }, []);

  return null;
}
