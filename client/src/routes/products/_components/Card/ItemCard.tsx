import { StarRating } from "../../../../components/common/rating/StarRating";
import { convertCentToUSD } from "../../../../utils/helper";
import AddToCartBtn from "../../../../components/common/AddToCartBtn";
import Size from "../../../../components/card/Size";
import { Color } from "../../../../components/card/Color";
import type { Variant } from "../../../../hooks/useProduct";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

type Props = {
  name: string;
  imagePath: string;
  colors: string[];
  rate: number;
  price: number;
  size: string[];
  variants: Variant[];
  id: string;
  onAddCart: (
    color: string,
    size: string,
    price: number,
    variantId: string,
  ) => void;
};
export default function ItemCard(p: Props) {
  const [size, setSize] = useState(p.size[0]);
  const [selectColor, setSelectColor] = useState("");
  const colors = p.variants.filter((v) => v.size === size).map((v) => v.color);
  let currentColor = selectColor;
  if (colors.findIndex((color) => color === selectColor) === -1) {
    currentColor = colors[0];
  }

  const priceByVariant = p.variants.find(
    (v) => v.color === currentColor && v.size === size,
  );

  return (
    <div className="bg-white flex flex-col p-2 rounded-2xl h-full w-full">
      <div className="top-portion basis-4/6 overflow-hidden">
        <img
          src={p.imagePath}
          className="w-full h-full object-cover rounded-2xl"
          alt=""
        />
      </div>
      <div className="bottom-portion basis-2/6 p-2 py-2 flex flex-col gap-2 relative">
        <Link
          to={`/products/$id`}
          params={{ id: p.id }}
          className="text-2xl uppercase text-zinc-700 tracking-wider font-bold hover:underline underline-offset-8"
        >
          {p.name.slice(0, 25) + (p.name.length > 25 ? "..." : "")}
        </Link>
        <div className="rating flex gap-1">
          <StarRating rate={5} />
        </div>
        <div className="price">
          <p className="text-3xl font-bold tracking-wider text-zinc-700">
            {convertCentToUSD(priceByVariant?.price || p.price)}
          </p>
        </div>

        <div className="colors absolute right-2 bottom-24 z-30">
          <div className="flex flex-col gap-2">
            <Size
              sizes={Array.from(new Set(p.size))}
              onSelect={(newSize) => {
                setSize(newSize);
              }}
              selectSize={size}
            />
          </div>
        </div>
        <div className="flex gap-4">
          {colors.map((c, index) => (
            <Color
              key={index}
              colorName={c}
              currentColor={currentColor}
              onUpdateColor={(val) => {
                setSelectColor(val);
              }}
            />
          ))}
        </div>

        <div className="self-end">
          <AddToCartBtn
            onClick={() => {
              if (!priceByVariant) return;
              p.onAddCart(
                currentColor,
                size,
                priceByVariant?.price || p.price,
                priceByVariant?._id,
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
