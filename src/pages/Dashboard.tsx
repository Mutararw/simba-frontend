import { useAuth } from "@/store/auth";
import AdminDashboard from "./AdminDashboard";
import BranchDashboard from "./BranchDashboard";
import SupplierDashboard from "./SupplierDashboard";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const user = useAuth((s) => s.user);

  if (!user) return <Navigate to="/login" />;

  const role = (user as any).accountType || user.role;

  if (role === "admin") {
    return <AdminDashboard />;
  }

  if (role === "manager") {
    return <BranchDashboard />;
  }

  if (role === "supplier") {
    return <SupplierDashboard />;
  }

  // Regular users ("user" / "customer") shouldn't see a dashboard
  return <Navigate to="/" />;
}
