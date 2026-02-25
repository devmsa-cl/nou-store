import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { BoxContainer, BoxHeadingText } from "../../../components/BoxContainer";
import fetchAPI from "../../../utils/fetchAPI";
import { ProductComponent, type Order } from "..";
import { convertCentToUSD } from "../../../utils/helper";
export const Route = createFileRoute("/orders/$num/")({
  component: RouteComponent,
  loader: async ({ params }): Promise<{ data: Order }> => {
    return await fetchAPI("/api/v1/orders/numbers/" + params.num);
  },
});
const CountryCode: { [key: string]: string } = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  AU: "Australia",
  FR: "France",
  DE: "Germany",
  IN: "India",
  JP: "Japan",
  CN: "China",
};
function RouteComponent() {
  const { data } = useLoaderData({
    from: "/orders/$num/",
  });
  const totalItemCost = data.items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0,
  );
  return (
    <section id="order-product">
      <div className="container mx-auto p-10">
        <BoxContainer>
          <BoxHeadingText className="border-b-[1px] border-zinc-300 pb-4 mb-4">
            Order #3434232
          </BoxHeadingText>
          <div className="container">
            <div className="m-col flex flex-col gap-4 md:flex-row md:justify-between">
              <div className="flex-1">
                <p className="font-semibold">Shipping Address:</p>
                <p>{data.shippingAddress.name}</p>
                <p>{data.shippingAddress.line1}</p>
                <p>
                  <span>{data.shippingAddress.city}</span>{" "}
                  <span>{data.shippingAddress.state}</span>{" "}
                  <span>{data.shippingAddress.postal_code}</span>
                </p>
                <p>{CountryCode[data.shippingAddress.country]}</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Order Summary</p>
                <div className="flex-col gap-2">
                  <div className="flex flex-nowrap">
                    <p className="basis-96">Items(s):</p>
                    <p>{convertCentToUSD(totalItemCost)}</p>
                  </div>
                  <div className="flex flex-nowrap">
                    <p className="basis-96">Shipping costs:</p>
                    <p>{convertCentToUSD(499)}</p>
                  </div>
                  <div className="flex flex-nowrap">
                    <p className="basis-96">before taxes:</p>
                    <p>{convertCentToUSD(data.subtotal)}</p>
                  </div>
                  <div className="flex flex-nowrap">
                    <p className="basis-96">Total before taxes:</p>
                    <p>{convertCentToUSD(data.subtotal)}</p>{" "}
                  </div>
                  <div className="flex flex-nowrap">
                    <p className="basis-96">Total amount:</p>
                    <p>{convertCentToUSD(data.totalAmount)}</p>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
            <div className="items border-b-[1px] border-zinc-300 pb-4 mb-4 mt-12">
              <h2 className="font-semibold">Items:</h2>
              <ProductComponent data={data.items} />
            </div>
          </div>
        </BoxContainer>
      </div>
    </section>
  );
}
