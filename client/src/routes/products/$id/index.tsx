import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { BoxContainer, BoxHeadingText } from "../../../components/BoxContainer";
import { StarRating } from "../../../components/common/rating/StarRating";
import { Color } from "../../../components/card/Color";
import { convertCentToUSD } from "../../../utils/helper";
import { Avatar } from "../../../components/common/Avatar";
import AddToCartBtn from "../../../components/common/AddToCartBtn";
import { useState } from "react";
import fetchAPI from "../../../utils/fetchAPI";
import type { ProductOriginal, Variant } from "../../../hooks/useProduct";
import {
  useAvailableColors,
  useAvailableSizes,
  useSelectedVariant,
} from "./-hook";
import { useCartStore, type Item } from "../../../store/cartStore";
import toast from "react-hot-toast";
export const Route = createFileRoute("/products/$id/")({
  component: RouteComponent,
  loader: async ({ params: { id } }) => {
    const res = await fetchAPI("/api/v1/products/lists/" + id);

    return res.data as ProductOriginal;
  },
});

function RouteComponent() {
  return (
    <>
      <MainProduct />
      <CustomerReviews />
    </>
  );
}

function MainProduct() {
  const data = useLoaderData({ from: "/products/$id/" });
  const { addItem } = useCartStore();
  // Dynamic initial states (better than hardcoded "9")
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const availableSizes = useAvailableSizes(data.variants);

  const selectSize = size || availableSizes[0];
  const availableColors = useAvailableColors(data.variants, selectSize);
  const selectColor = color || availableColors[0];

  const selectedVariant = useSelectedVariant(
    data.variants,
    selectSize,
    selectColor,
  );

  function handleAddToCart() {
    if (!selectedVariant) return;
    // TODO: Add to cart
    const newItem: Item = {
      productId: data._id,
      variantId: selectedVariant?._id,
      price: selectedVariant.price,
      color: selectedVariant.color,
      size: selectedVariant.size,
      imageUrl: data.images[0],
      quantity: 1,
      productName: data.name,
      productDescription: data.description,
    };

    addItem(newItem);
    toast.success("Item added to cart");
  }
  return (
    <>
      <section id="product">
        <div className="container mx-auto p-10 grid grid-cols-12 gap-4">
          <BoxContainer className="col-span-12 lg:col-span-12">
            <h2 className="text-2xl">{data?.name}</h2>
            <div className="product-info cart-item mt-4 border-t-[1px] border-zinc-300 flex flex-col md:flex-row gap-8 pt-4">
              <div className="left basis-96">
                <GalleryGrid images={data.images} />
              </div>

              <div className="right flex-2 flex flex-col gap-2">
                <h1 className="text-4xl leading-relaxed">{data?.name}</h1>
                <div className="rating-detail">
                  <div className="rating flex gap-1 ">
                    <StarRating rate={4.6} />
                    <span className="text-xs">(200)</span>
                  </div>
                </div>
                <p className="pt-4">{data?.description}</p>
                <div className="selection flex flex-col gap-4">
                  <div className="pick-color flex items-center">
                    <p className="text-zinc-800 tracking-wider">color:</p>
                    <div className="flex gap-2 pl-4 items-center">
                      {availableColors.map((color) => (
                        <Color
                          key={color}
                          colorName={color}
                          currentColor={selectColor}
                          onUpdateColor={(newColor) => {
                            setColor(newColor);
                          }}
                        />
                      ))}
                      <p className="capitalize">( {selectColor} )</p>
                    </div>
                  </div>

                  <div className="size flex items-center">
                    <p className="text-zinc-800 tracking-wider">size:</p>
                    <div className="flex gap-2 pl-4 items-center">
                      <select
                        name="size"
                        id="size"
                        className="p-2 px-4 border-2 rounded-xl"
                        defaultValue={selectSize}
                        onChange={(e) => {
                          setSize(e.target.value);
                        }}
                      >
                        {availableSizes &&
                          availableSizes.map((s) => (
                            <option key={s} defaultValue={s}>
                              {s}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                <PriceComponent variant={selectedVariant} />
                <div className="flex items-center">
                  <AddToCartBtn
                    onClick={handleAddToCart}
                    disabled={selectedVariant?.quantity === 0}
                  />
                  {selectedVariant?.quantity === 0 && (
                    <p className="text-rose-500 pl-4 font-semibold">
                      Out of stock
                    </p>
                  )}
                </div>
              </div>
            </div>
          </BoxContainer>
        </div>
      </section>
    </>
  );
}
function CustomerReviews() {
  return (
    <section>
      <div className="container mx-auto p-10 grid grid-cols-12">
        <div className="col-span-12 lg:col-span-9">
          <BoxHeadingText>Customer Reviews</BoxHeadingText>

          <div className="comments  pt-4 flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <BoxContainer key={index}>
                <div className="user flex items-center gap-2">
                  <Avatar variant="ghost" />
                  <p className="text-lg">John Doe</p>
                  <p className="verify-buyer text-emerald-600 text-xs font-bold">
                    | Verified Buyer
                  </p>
                </div>
                <div className="comment-title flex gap-1 pt-4 items-center py-2">
                  <div className="flex gap-1 scale-75">
                    <StarRating rate={4.6} />
                  </div>
                  <h3 className="text-lg">Best Product Ever !</h3>
                  <p className="text-sm text-zinc-400 pl-6"> | 2 days ago</p>
                </div>
                <p className="comment-text">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Impedit, facilis pariatur quae iusto aliquid nostrum iure
                  quisquam quos consequatur assumenda eligendi nisi quia. Natus
                  amet, animi expedita labore impedit cupiditate quaerat
                  delectus eius! Quo veniam laborum maiores asperiores tenetur
                  sit perferendis voluptatibus enim sed, laboriosam ullam magni
                  dignissimos facere expedita pariatur in maxime aperiam
                  placeat? Vitae quaerat sunt aspernatur quia.
                </p>
              </BoxContainer>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type GalleryGridProps = {
  images: string[];
};

function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  return (
    <div className="image-gallery flex flex-col items-left">
      <div
        className={`image-main  h-96 w-full rounded-2xl overflow-hidden transition-all duration-700 `}
      >
        <img
          src={
            import.meta.env.VITE_S3_BUCKET_PUBLIC_URL + images[selectedImage]
          }
          className={`h-full w-full object-cover cursor-pointer`}
          alt="product image"
        />
      </div>

      <div className="thumbnails pt-4 flex flex-wrap gap-2 w-full">
        {images.map((img, i) => (
          <div
            onClick={() => setSelectedImage(i)}
            key={i}
            className="thumbnail w-16 h-16 overflow-hidden rounded-2xl cursor-pointer"
          >
            <img
              src={import.meta.env.VITE_S3_BUCKET_PUBLIC_URL + img}
              className="h-full w-full object-cover"
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceComponent({ variant }: { variant: Variant | null }) {
  return (
    <div className="list-price py-4">
      <div className="current-price">
        <h2 className="font-bold text-4xl text-zinc-800">
          {convertCentToUSD(variant?.price || 0)}
        </h2>
      </div>
      <div className="original-price flex items-center py-2 gap-4">
        <h2 className="font-bold text-lg text-rose-800 pl-12">
          {convertCentToUSD(2199)}
        </h2>
        <p>original price</p>
      </div>
    </div>
  );
}
