import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { HeadingText } from "../components/common/headingText/HeadingText";
import {
  FcAddCart,
  FcColor,
  FcImage,
  FcName,
  FcPrice,
  FcRating,
  FcSize,
  FeatureCard,
} from "../components/feature/FeatureCard";
import Hero from "../components/hero/Hero";
import { useFeatureProduct } from "../hooks/useFeatureProduct";
import type { Product, Variant } from "../hooks/useProduct";
import { useCartStore } from "../store/cartStore";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <section className="h-150">
        <Hero />
      </section>
      <FeatureComponent />
    </>
  );
}

function FeatureComponent() {
  const { data } = useFeatureProduct();
  const { addItem } = useCartStore();

  return (
    <section className="feature-section">
      <div className="text-center leading-48">
        <HeadingText>Features Products</HeadingText>
      </div>

      <div className="container mx-auto">
        <div className="feature-items grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 ">
          {data &&
            data.map((p) => {
              return (
                <RenderFeatureCard
                  key={p._id}
                  p={p}
                  onRequestAddToCart={(variant: Variant) => {
                    addItem({
                      imageUrl: p.images[0],
                      productId: p._id,
                      variantId: variant._id,
                      price: variant.price,
                      color: variant.color,
                      size: variant.size,
                      productName: p.name,
                      productDescription: p.description,
                      quantity: 1,
                    });
                    toast.success("Item added to cart");
                  }}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
}

type Props = {
  p: Product;
  onRequestAddToCart: (variant: Variant) => void;
};
function RenderFeatureCard({ p, onRequestAddToCart }: Props) {
  const [selectedVariant, setSelectedVariant] = useState("");

  const allColor = p.variants.map((v) => v.color);
  let uniqueColor = [...new Set(allColor)];

  if (selectedVariant) {
    uniqueColor = p.variants
      .filter((v) => v.size === selectedVariant)
      .map((v) => v.color);
  }

  const price = selectedVariant
    ? p.variants.find((v) => v.size === selectedVariant)?.price
    : p.variants[0].price;

  return (
    <FeatureCard
      key={p._id}
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData) as {
          size: string;
          color: string;
        };
        const variant = p.variants.find(
          (v) => v.size === data.size && v.color === data.color,
        );
        if (variant) {
          onRequestAddToCart(variant);
        }
      }}
    >
      <FcImage src={import.meta.env.VITE_S3_BUCKET_PUBLIC_URL + p.images[0]} />
      <FcName>
        <Link
          to="/products/$id"
          params={{ id: p._id }}
          className="border-b-2 mb-2 border-transparent hover:border-primary"
        >
          {p.name.substring(0, 20)}
        </Link>
      </FcName>

      <FcRating rate={4.5} size={18} />
      <FcPrice price={price || 0} />
      <FcSize
        onSelect={setSelectedVariant}
        sizes={[...new Set(p.variants.map((v) => v.size)).values()].slice(0, 6)}
      />
      <FcColor colors={uniqueColor} />
      <FcAddCart />
    </FeatureCard>
  );
}
