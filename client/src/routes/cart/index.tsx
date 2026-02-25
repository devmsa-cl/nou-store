import { createFileRoute } from "@tanstack/react-router";
import { BoxContainer } from "../../components/BoxContainer";
import { Breadcrumb } from "../../components/common/breadcrumb/Breadcrumb";
import { useCartStore } from "../../store/cartStore";
import { CartItem } from "./_components/CartItem";
import ShippingAddress from "./_components/ShippingAddress";
import TotalPanel from "./_components/TotalPanel";
import RequireAuth from "../../components/RequireAuth";

export const Route = createFileRoute("/cart/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { cartItem, updateQuantity } = useCartStore();
  return (
    <section id="cart">
      <Breadcrumb title="Check out" sub="Life is short, buy the shoes." />
      <div className="container mx-auto py-10">
        <div className="shopping-cart flex  flex-col m-6 md:grid md:grid-cols-12 md:grid-rows-auto gap-4">
          <BoxContainer className="row-start-1 col-span-12 lg:col-start-1 lg:col-end-10 lg:cols-span-10">
            <h2 className="text-2xl">Shopping items</h2>
            <div className="cart-items md:gap-0 mt-4">
              {cartItem.map((item) => {
                return (
                  <CartItem
                    key={`${item.productId}_${item.color}_${item.size}`}
                    productId={item.productId}
                    color={item.color}
                    size={item.size}
                    price={item.price}
                    name={item.productName}
                    imageUrl={item.imageUrl}
                    description={item.productDescription}
                    quantity={item.quantity}
                    onQuantityChange={(newQuantity) => {
                      updateQuantity({
                        productName: item.productName,
                        productDescription: item.productDescription,
                        productId: item.productId,
                        variantId: item.variantId,
                        price: item.price,
                        color: item.color,
                        imageUrl: item.imageUrl,
                        quantity: newQuantity,
                        size: item.size,
                      });
                    }}
                  />
                );
              })}
              {cartItem.length === 0 && (
                <p className="text-center text-zinc-600 mt-10">
                  Your cart is currently empty.
                </p>
              )}
            </div>
          </BoxContainer>
          <RequireAuth>
            <ShippingAddress />
          </RequireAuth>
          <div className="row-start-3 xl:row-start-1 xl:col-start-10 xl:col-end-12">
            <TotalPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
