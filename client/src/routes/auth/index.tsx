import { createFileRoute } from "@tanstack/react-router";
import { BoxContainer, BoxHeadingText } from "../../components/BoxContainer";
import UncontrolledInput from "../../components/common/UncontrolledInput";
import Button from "../../components/common/Button";
import fetchAPI from "../../utils/fetchAPI";
import { useUserStore } from "../../store/useStore";
import { useLayoutEffect } from "react";
export const Route = createFileRoute("/auth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { loggedUser, loggedIn } = useUserStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = Object.fromEntries(formData);

    const res = await fetchAPI.post("/api/v1/auth/login", data);

    if (res.status === 200) {
      loggedUser({
        token: res.data.token,
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role,
        _id: res.data.user._id,
      });
      window.location.href = "/profile";
    }
  };
  useLayoutEffect(() => {
    if (loggedIn) {
      window.location.href = "/";
    }
  }, []);
  return (
    <section id="login">
      <div className="container mx-auto p-10 flex justify-center items-center">
        <BoxContainer className="w-110">
          <BoxHeadingText>Login</BoxHeadingText>
          <form action="" className="pt-3" onSubmit={handleSubmit}>
            <UncontrolledInput name="email" label="Email" />
            <UncontrolledInput name="password" label="Password" />
            <div className="pt-3">
              <Button>Submit</Button>
            </div>
          </form>
        </BoxContainer>
      </div>
    </section>
  );
}
