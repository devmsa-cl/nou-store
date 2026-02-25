import { useUserStore } from "../store/useStore";
import { Navigate } from "@tanstack/react-router";
export default function Protected({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useUserStore();
  if (!loggedIn) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}
