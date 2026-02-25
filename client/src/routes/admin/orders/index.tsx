import { createFileRoute } from "@tanstack/react-router";
import {
  BoxContainer,
  BoxHeadingText,
  BoxSubText,
} from "../../../components/BoxContainer";
import { useMutation, useQuery } from "@tanstack/react-query";
import fetchAPI from "../../../utils/fetchAPI";
import { useState, type ChangeEvent } from "react";
import { convertCentToUSD } from "../../../utils/helper";
import toast from "react-hot-toast";
import Pagination from "../../../components/Pagination";
export const Route = createFileRoute("/admin/orders/")({
  component: RouteComponent,
});
type Order = {
  _id: string;
  color: string;
  size: string;
  quantity: number;
  orderNumber: string;
  unitPrice: number;
  createdAt: Date;
  customer: {
    name: string;
  };
  deliveryStatus: string;
};
type OrdersResponse = {
  limit: number;
  skip: number;
  total: number;
  data: Order[];
};
const fetchOrders = async (
  page: number,
  limit: number,
): Promise<OrdersResponse> => {
  const r = await fetchAPI(
    `/api/v1/admin/orders?limit=${limit}&skip=${(page - 1) * limit}`,
  );
  return r.data;
};
const perPage = 7;
function RouteComponent() {
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["admin-orders", page],
    queryFn: () => fetchOrders(page, perPage),
  });

  const { mutate: updateDeliveryStatus } = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: string;
    }) => {
      await fetchAPI(`/api/v1/admin/orders/${orderId}/delivery-status`, {
        method: "PUT",
        data: {
          status,
        },
      });
    },
    onSuccess: () => {
      toast.success("Order updated successfully");
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / perPage || 1);

  return (
    <BoxContainer>
      <BoxHeadingText>Orders</BoxHeadingText>
      <BoxSubText>Here you can manage all the orders.</BoxSubText>

      <div className="w-full text-left border-collapse py-2">
        <div className="header flex justify-between items-center bg-zinc-600 py-2 rounded-sm text-white uppercase text-xs font-medium">
          <div className="cell basis-24 px-2">Order ID</div>
          <div className="cell flex-1">Customer</div>
          <div className="cell basis-16 text-left">qty</div>
          <div className="cell flex-1">Total</div>
          <div className="cell flex-1">Order at</div>
          <div className="cell flex-1">Status</div>
          <div className="cell basis-32"></div>
        </div>
        <div className="body  h-150  mt-0 rounded-sm overflow-y-auto">
          {data &&
            data.data.map((order: Order) => {
              return (
                <div
                  key={order._id}
                  className="row flex justify-between items-center border-b border-zinc-300 py-6 even:bg-zinc-50"
                >
                  <div className="cell basis-24 px-2">{order.orderNumber}</div>
                  <div className="cell flex-1">{order.customer.name}</div>
                  <div className="cell basis-16 text-left">
                    {order.quantity}
                  </div>
                  <div className="cell flex-1">
                    {convertCentToUSD(order.unitPrice)}{" "}
                    <span className="text-xs"> per unit</span>
                  </div>
                  <div className="cell flex-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="cell flex-1">
                    <select
                      name="status"
                      id="status"
                      className="bg-zinc-400 text-white py-1 px-4 rounded-full appearance-none text-center text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 cursor-pointer"
                      onChange={(ev: ChangeEvent<HTMLSelectElement>) => {
                        const newStatus = ev.currentTarget.value;
                        updateDeliveryStatus({
                          orderId: order._id,
                          status: newStatus,
                        });
                      }}
                      defaultValue={order.deliveryStatus}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              );
            })}
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>
    </BoxContainer>
  );
}
