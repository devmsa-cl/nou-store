import { useCartStore } from "../../../store/cartStore";
import { convertCentToUSD } from "../../../utils/helper";
import fetchAPI from "../../../utils/fetchAPI";
import Button from "../../../components/common/Button";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useUserStore } from "../../../store/useStore";
import { Link } from "@tanstack/react-router";
import { useAddressStore } from "../_useAddressStore";
export default function TotalPanel() {
  const { cartItem } = useCartStore();
  const { token } = useUserStore();
  const { addressID } = useAddressStore();
  const total = cartItem.reduce((acc, product) => {
    return (acc += product.price * product.quantity);
  }, 0);

  const saleTax = 0.08 * total;

  const requestPayment = async () => {
    try {
      const res = await fetchAPI.post(
        "/api/v1/payments/create-checkout-session",
        {
          cartItem: cartItem,
          shippingAddressID: addressID,
        },
      );
      if (res.status === 200) {
        window.open(res.data.url, "_blank");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.msg, { duration: 5000 });
      }
    }
  };

  return (
    <div className="pre-price self-end">
      <div className="subtotal flex flex-col gap-6 shadow-2xl shadow-zinc-700/30 bg-white p-8 w-84 rounded-xl">
        <ul className="w-full">
          <li className="flex justify-between">
            <p className="text-lg text-zinc-700">Subtotal :</p>
            <p className="text-lg text-zinc-700">{convertCentToUSD(total)}</p>
          </li>
          <li className="flex justify-between">
            <p className="text-lg text-zinc-700">Tax fee :</p>
            <p className="text-lg text-zinc-700">
              + {convertCentToUSD(saleTax)}
            </p>
          </li>
          <li className="flex justify-between last:border-t-2 last:mt-8 last:pt-4">
            <p className="text-xl">Total :</p>
            <p className="text-xl">{convertCentToUSD(saleTax + total)}</p>
          </li>
        </ul>
        {token ? (
          <>
            <Button onClick={requestPayment}>Checkout</Button>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className="btn py-2 px-4 bg-primary text-zinc-900  hover:text-white transition-all rounded-lg text-bold tracking-wider text-center cursor-pointer text-sm"
            >
              Sign in to checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
