import { createFileRoute, Link, useLoaderData } from "@tanstack/react-router";
import { BoxContainer, BoxHeadingText } from "../../components/BoxContainer";
import { convertCentToUSD } from "../../utils/helper";
import fetchAPI from "../../utils/fetchAPI";
import cn from "../../utils/cn";

type ShippingAddress = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};
type Product = {
  _id: string;
  name: string;
  description: string;
  images: string[];
  categories: string[];
  isReadyForSale: boolean;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type OrderItem = {
  _id: number;
  productId: string;
  customerId: string;
  size?: string;
  color?: string;
  unitPrice: number;
  quantity: number;
  orderNumber: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
  deliveryStatus: string;
};

export type Order = {
  _id: string;
  orderNumber: string;
  customerId: string;
  subtotal: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export const Route = createFileRoute("/orders/")({
  component: RouteComponent,

  loader: async (): Promise<{ data: Order[] }> => {
    return await fetchAPI("/api/v1/orders");
  },
});

function RouteComponent() {
  const { data } = useLoaderData({
    from: "/orders/",
  });
  return (
    <section id="orders-page">
      <div className="container mx-auto p-10 flex flex-col gap-6">
        {data.map((order) => {
          const allDeliveryStatus = order.items.every(
            (item) => item.deliveryStatus === "delivered",
          );
          return (
            <BoxContainer key={order._id}>
              <BoxHeadingText className=" border-b-[1px] border-zinc-300 pb-4 mb-4">
                Order #
                <Link
                  className="underline-offset-4 hover:underline hover:decoration-2"
                  to="/orders/$num"
                  params={{ num: order.orderNumber }}
                >
                  {order.orderNumber}
                </Link>
              </BoxHeadingText>

              <div
                className={`${cn("orders border-l-4 px-4 py-2", !allDeliveryStatus ? "border-l-blue-500" : "border-l-zinc-200")}`}
              >
                {order.items.map((item) => {
                  return <ProductComponent key={item._id} data={[item]} />;
                })}
              </div>
            </BoxContainer>
          );
        })}
      </div>
    </section>
  );
}

export function ProductComponent({ data }: { data: OrderItem[] }) {
  return data.map((item) => {
    return (
      <div
        key={item._id}
        className="product flex gap-4 not-first:border-t-[1px] border-zinc-300 py-2"
      >
        <div className="product-img h-20 w-20 rounded-2xl overflow-hidden">
          <img
            src={`https://r8n1.c16.e2-4.dev/nou-store/${item.product.images[0]}`}
            className="w-full h-full object-cover"
            alt=""
          />
        </div>

        <div className="flex-1 info flex gap-4 justify-between">
          <div className="basis-48">
            <p className="text-zinc-700 font-semibold">
              <Link
                to="/products/$id"
                params={{ id: item.productId }}
                className="underline-offset-4 hover:underline hover:decoration-2"
              >
                {item.product.name}
              </Link>{" "}
              <span className="text-xs font-extralight">
                ({item.quantity}x)
              </span>
            </p>
            <p className="text-sm">Size: {item?.size}</p>
            <p className="text-sm">Color: {item?.color}</p>
          </div>
          <div className="basis-32">
            <p className="text-zinc-700 font-semibold uppercase text-sm">
              Pay amount
            </p>
            <p>{convertCentToUSD(item.unitPrice)}</p>
          </div>
          <div className="basis-40">
            <p className="text-zinc-700 font-semibold uppercase text-sm">
              Delivery Expect
            </p>
            <p>3 days</p>
          </div>
          <div className="basis-30">
            <p className="text-zinc-700 font-semibold uppercase text-sm">
              Status
            </p>
            <p>{item.deliveryStatus}</p>
          </div>
          <div className="basis-12">
            <Link
              to="/orders/$num"
              params={{ num: "1" }}
              className="pt-2"
              disabled
            >
              <button className="cursor-pointer border-2 border-rose-300 text-zinc-700 px-4 py-1 rounded-lg text-sm hover:bg-rose-300 hover:text-white transition-all">
                Detail
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  });
}
