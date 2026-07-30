import { useSession } from "./auth-client";

export function SessionManager() {
  useSession();
  return null;
}
