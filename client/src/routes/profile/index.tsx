import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb } from "../../components/common/breadcrumb/Breadcrumb";
import { BoxContainer } from "../../components/BoxContainer";
import { useUserStore } from "../../store/useStore";
import Button from "../../components/common/Button";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, logoutUser } = useUserStore();
  return (
    <section id="profile">
      <Breadcrumb
        title="Profile"
        sub="Manage your profile information and settings."
      />
      <div className="container mx-auto py-10">
        <BoxContainer>
          <h2 className="text-2xl">
            <p className="font-bold">
              Welcome back , <span className="capitalize">{user?.name}</span>
            </p>
          </h2>
          <div className="profile-information mt-6">
            <p>Below is your information.</p>
          </div>

          <Button onClick={() => logoutUser()}>Logout</Button>
        </BoxContainer>
      </div>
    </section>
  );
}
