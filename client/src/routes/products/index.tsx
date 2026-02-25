import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumb } from "../../components/common/breadcrumb/Breadcrumb";
import SortTab from "./_components/SortTab";
import MobileVersion from "./_components/category/MobileVersion";
import { useEffect, useState } from "react";
import DesktopVersion from "./_components/category/DesktopVersion";
import { useCartStore, type Item } from "../../store/cartStore";
import { useProduct } from "../../hooks/useProduct";
import ItemCard from "./_components/Card/ItemCard";
import { useProductStore } from "../../store/productStore";
import toast from "react-hot-toast";
import ItemCardPlaceHolder from "./_components/Card/ItemCardPlaceHolder";
import Pagination from "../../components/Pagination";

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { addItem } = useCartStore();
  const { values, onSetPageNumber } = useProductStore();
  const { isLoading, data } = useProduct(
    values.limit,
    values.pageNumber,
    values.category,
    values.priceRange,
  );

  return (
    <section id="product-age">
      <Breadcrumb
        title="Products"
        sub="Where fashion meets function, every step tells a story."
      />
      <div className="product-container container mx-auto p-8  md:grid md:grid-cols-12 md:grid-rows-auto grid-flow-row md:gap-2">
        <div className="py-6 md:col-start-4 md:col-span-7 md:row-end-1">
          <SortTab />
        </div>
        <div className="md:col-span-3 md:row-start-1 md:pr-4">
          <Category />
        </div>
        <div className="sm:col-start-4 sm:row-col-2 sm:row-col-11 sm:col-span-9">
          <div className="product-items flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {isLoading ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div className="w-72 h-105" key={index}>
                    <ItemCardPlaceHolder />
                  </div>
                ))}
              </>
            ) : (
              <>
                {data?.data.map((p) => {
                  return (
                    <div className="sm:w-72 h-105 w-full" key={p._id}>
                      <ItemCard
                        imagePath={
                          p.images[0]
                            ? import.meta.env.VITE_S3_BUCKET_PUBLIC_URL +
                              p.images[0]
                            : "./shoes/maksim-larin-NOpsC3nWTzY-unsplash.jpg"
                        }
                        name={p.name}
                        price={p.price}
                        size={p.size}
                        rate={4.5}
                        colors={p.color}
                        variants={p.variants}
                        id={p._id}
                        onAddCart={(color, size, price, variantId) => {
                          const newItem: Item = {
                            productId: p._id,
                            variantId: variantId,
                            price: price,
                            color: color,
                            size: size,
                            imageUrl: p.images[0],
                            quantity: 1,
                            productName: p.name,
                            productDescription: p.description,
                          };
                          addItem(newItem);
                          toast.success("Item added to cart");
                        }}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <Pagination
            setPage={(newPage: number) => onSetPageNumber(newPage)}
            page={values.pageNumber}
            totalPages={data?.total ? Math.ceil(data.total / values.limit) : 0}
          />
        </div>
      </div>
    </section>
  );
}
function Category() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const screenResize = () => {
      const mobileSize = "(max-width: 768px)";
      const match = window.matchMedia(mobileSize);
      setIsMobile(match.matches);
    };

    window.addEventListener("resize", screenResize);

    return () => {
      window.removeEventListener("resize", screenResize);
    };
  }, []);
  if (isMobile) {
    return <MobileVersion />;
  }

  return <DesktopVersion />;
}
