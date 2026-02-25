import { useUserStore } from "../store/useStore";
import { Navigate } from "@tanstack/react-router";
export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { loggedIn, user } = useUserStore();
  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return children;
}
