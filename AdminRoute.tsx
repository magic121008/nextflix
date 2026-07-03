import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}
