import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const hasAccess = sessionStorage.getItem("admin_access") === "true";

  if (!hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
}
