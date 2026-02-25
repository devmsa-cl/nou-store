import { Link } from "@tanstack/react-router";
import { ColorStatic } from "../../../components/card/ColorStatic";
import { convertCentToUSD } from "../../../utils/helper";

type CartItemProps = {
  quantity: number;
  color: string;
  size: string;
  price: number;
  imageUrl: string;
  name: string;
  productId: string;
  description: string;
  onQuantityChange: (quantity: number) => void;
};
export const CartItem = ({
  color,
  quantity,
  size,
  price,
  imageUrl,
  name,
  productId,
  description,
  onQuantityChange,
}: CartItemProps) => {
  return (
    <div className="cart-item border-t-[1px] border-zinc-300 flex flex-col gap-10 md:flex-row pb-8">
      <div className="p-2 w-45 h-45">
        <img
          className="rounded-xl object-cover h-full w-full"
          src={import.meta.env.VITE_S3_BUCKET_PUBLIC_URL + imageUrl}
          alt="product image"
        />
      </div>
      <div className="product pt-4 flex flex-col md:flex-row flex-1 gap-10 ">
        <div className="product-detail basis-100">
          <Link
            to="/products/$id"
            params={{ id: productId }}
            className="text-xl capitalize font-bold text-zinc-800 tracking-wider hover:underline underline-offset-4"
          >
            {name}
          </Link>

          <p className="text-zinc-800">
            {description.substring(0, 140)}
            {description.length > 140 && "..."}
          </p>
          <div className="product-selection">
            <div className="color flex items-center gap-2">
              <p className="text-zinc-800 tracking-wider">color:</p>
              <ColorStatic colorName={color} />
              <p className="text-sm text-zinc-700">{color}</p>
            </div>
            <div className="size flex items-center gap-2">
              <p className="text-zinc-800 tracking-wider">size:</p>
              <p>{size}</p>
            </div>
            <div className="quantity flex gap-2 items-center">
              <p>Quantity</p>
              <div className="flex gap-2 bg-slate-100">
                <button
                  className="border-2 rounded-md w-7 h-7 grid place-items-center cursor-pointer"
                  onClick={() => onQuantityChange(quantity - 1)}
                >
                  -
                </button>
                <span className="mx-4">{quantity}</span>
                <button
                  className="border-2 rounded-md w-7 h-7 grid place-items-center cursor-pointer"
                  onClick={() => onQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="subtotal items-end flex-1 text-right">
            <p>
              {convertCentToUSD(price)} ({quantity}x)
            </p>
          </div>
        </div>
        <div className="subtotal  flex-1 text-right ">
          <h4 className="text-xl capitalize font-bold text-zinc-700 tracking-wider">
            Price
          </h4>
          <p className="text-lg tracking-wide">
            {convertCentToUSD(price * quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};
