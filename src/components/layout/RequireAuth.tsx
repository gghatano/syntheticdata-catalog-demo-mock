import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUserId } from "../../store/session";
import { USERS } from "../../data/users";
import { UserRole } from "../../types/models";

export function RequireAuth({ role }: { role?: UserRole } = {}) {
  const userId = getCurrentUserId();
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  if (role) {
    const user = USERS.find((u) => u.user_id === userId);
    if (user && user.role !== role) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  return <Outlet />;
}
