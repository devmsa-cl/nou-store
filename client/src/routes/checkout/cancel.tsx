import { createFileRoute, Link } from "@tanstack/react-router";
import { BoxContainer } from "../../components/BoxContainer";
import { useEffect } from "react";

export const Route = createFileRoute("/checkout/cancel")({
  component: RouteComponent,
});

function RouteComponent() {
  useEffect(() => {
    const previousUrl = document.referrer;
    console.log("User came from:", previousUrl);

    if (previousUrl && previousUrl.includes("specific-external-site.com")) {
      // Logic for users from a specific external site
    }
  }, []);
  return (
    <div className="container mx-auto">
      <section className="pt-24 grid place-items-center">
        <BoxContainer className="min-w-96">
          <h1 className="text-2xl font-bold leading-loose">Order Cancelled</h1>
          <Link to="/cart" className="underline underline-offset-4">
            Go back to cart
          </Link>
        </BoxContainer>
      </section>
    </div>
  );
}
