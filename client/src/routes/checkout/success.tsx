import { createFileRoute, Link } from "@tanstack/react-router";
import { BoxContainer } from "../../components/BoxContainer";
import { useLayoutEffect } from "react";
import { useCartStore } from "../../store/cartStore";

export const Route = createFileRoute("/checkout/success")({
  component: RouteComponent,
});

function RouteComponent() {
  const { clearCart } = useCartStore();
  useLayoutEffect(() => {
    clearCart();
  }, []);
  return (
    <div className="container mx-auto">
      <section className="pt-24 grid place-items-center">
        <BoxContainer className="min-w-96">
          <h1 className="text-2xl font-bold leading-loose text-emerald-600">
            Order Success
          </h1>
          <Link to="/products" className="underline underline-offset-4">
            Continuing shopping
          </Link>
        </BoxContainer>
      </section>
    </div>
  );
}
