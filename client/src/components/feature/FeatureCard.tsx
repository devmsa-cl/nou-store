"use client";
import { useEffect, useState } from "react";
import cn from "../../utils/cn";
import { Color } from "../card/Color";
import { StarRating } from "../common/rating/StarRating";
import { convertCentToUSD } from "../../utils/helper";
type Props = {
  children: React.ReactNode[];
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};
export const FeatureCard = ({ children, onSubmit }: Props) => {
  const [image, name, rating, price, sizes, colors, addCart] = children;
  return (
    <>
      <div
        className="w-full bg-white shadow-2xl shadow-zinc-600/30 rounded-2xl
        flex flex-col gap-2
      "
      >
        <div className="fc-image h-84 p-2">{image}</div>
        <div className="fc-content px-4 pb-6 flex flex-col gap-4">
          <form onSubmit={onSubmit}>
            {name}
            {rating}
            {price}
            {sizes}
            {colors}
            {addCart}
          </form>
        </div>
      </div>
    </>
  );
};
export const FcImage = ({ src }: { src: string }) => {
  return (
    <img
      src={src}
      alt="hero image"
      className="w-full h-full rounded-xl object-cover"
    />
  );
};
export const FcName = ({ children }: { children: React.ReactNode }) => {
  return (
    <h3 className="text-3xl font-semibold text-zinc-800 uppercase tracking-tight">
      {children}
    </h3>
  );
};

export const FcRating = ({ rate, size }: { rate: number; size?: number }) => {
  return <div className="flex">{<StarRating rate={rate} size={size} />}</div>;
};
export const FcSize = ({
  onSelect,
  sizes,
}: {
  onSelect: (size: string) => void;
  sizes: string[];
  defaultSize?: string;
}) => {
  const [selectSize, SetSelectSize] = useState<string | null>(null);
  return (
    <div className="size flex flex-col">
      <p className="uppercase text-xs text-zinc-500">size:</p>
      <div className="flex gap-2 pt-2 items-center flex-wrap">
        {sizes.map((s, i) => {
          return (
            <span
              key={s + i}
              className={cn(
                `bg-zinc-100 min-w-14 text-center rounded-md cursor-pointer p-1 hover:bg-zinc-300 text-zinc-700 border-2`,
                selectSize === s
                  ? " border-zinc-800 font-bold"
                  : "border-transparent",
              )}
              onClick={() => {
                SetSelectSize(s);
                onSelect(s);
              }}
            >
              {s}
            </span>
          );
        })}
      </div>
      <input
        type="text"
        className="hidden"
        name="size"
        defaultValue={selectSize || ""}
      />
    </div>
  );
};
export const FcAddCart = () => {
  return (
    <button
      className="mt-4 bg-zinc-800 text-white py-3 rounded-lg w-full hover:bg-zinc-900
    transition-colors duration-300 font-semibold cursor-pointer"
      type="submit"
    >
      Add to Cart
    </button>
  );
};
export const FcPrice = ({ price }: { price: number }) => {
  return (
    <p className="text-2xl font-semibold text-zinc-800 tracking-wider leading-16">
      {convertCentToUSD(price)}
    </p>
  );
};
export const FcColor = ({ colors }: { colors: string[] }) => {
  const [selectColor, setSelectColor] = useState<string | null>(null);
  useEffect(() => {
    (() => {
      setSelectColor(colors[0]);
    })();
  }, [colors]);
  return (
    <div className="flex items-center gap-5 py-4">
      <p className="uppercase text-xs text-zinc-500">Color: </p>
      <div className="flex gap-2">
        {colors.map((cl, index) => {
          return (
            <Color
              key={index}
              colorName={cl}
              currentColor={selectColor}
              onUpdateColor={(newColor) => {
                setSelectColor(newColor);
              }}
            />
          );
        })}
      </div>
      <input
        type="text"
        name="color"
        value={selectColor || ""}
        className="hidden"
      />
    </div>
  );
};
