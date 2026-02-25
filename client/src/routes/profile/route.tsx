import { createFileRoute, Outlet } from "@tanstack/react-router";
import Protected from "../../components/Protected";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Protected>{<Outlet />}</Protected>;
}
