import { createFileRoute, Outlet } from "@tanstack/react-router";
import Protected from "../../components/Protected";

export const Route = createFileRoute("/orders")({
  component: () => (
    <Protected>
      <RouteComponent />
    </Protected>
  ),
});

function RouteComponent() {
  return <Outlet />;
}
