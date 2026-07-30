import { useEffect } from "react";
import { useAuth } from "@/store/auth";
import { API_URL } from "./config";

export function SessionManager() {
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);

  useEffect(() => {
    if (user) return;

    const baseURL = API_URL.endsWith("/api/auth") ? API_URL : `${API_URL}/api/auth`;
    fetch(`${baseURL}/get-session`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            role: (data.user as any).accountType || "customer",
          });
        }
      })
      .catch(() => {});
  }, []);

  return null;
}
