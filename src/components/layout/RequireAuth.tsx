import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUserId } from "../../store/session";

export function RequireAuth() {
  const userId = getCurrentUserId();
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
