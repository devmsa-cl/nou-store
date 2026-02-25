import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h2 className="text-xl text-zinc-800 ">Welcome tom the admin panel</h2>
    </div>
  );
}
