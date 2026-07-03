import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();

  // 👤 not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
