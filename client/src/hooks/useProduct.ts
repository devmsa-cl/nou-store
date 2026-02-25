import { useQuery } from "@tanstack/react-query";
import fetchAPI from "../utils/fetchAPI";

export type Product = {
  images: string[];
  name: string;
  color: string[];
  price: number;
  size: string[];
  categories: string[];
  description: string;
  updatedAt: string;
  createdAt: string;
  _id: string;
  variants: Variant[];
};
export type ProductOriginal = {
  images: string[];
  name: string;
  description: string;
  updatedAt: string;
  createdAt: string;
  _id: string;
  variants: Variant[];
};
export type Variant = {
  color: string;
  size: string;
  price: number;
  quantity: number;
  itemId: string;
  _id: string;
};
type ProductResponse = {
  data: Product[];
  limit: number;
  total: number;
};
export const useProduct = (
  limit: number,
  page: number,
  category: string,
  priceRange: number,
) => {
  return useQuery<ProductResponse>({
    queryKey: ["products", category, limit, page, priceRange],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const res = await fetchAPI(
        `/api/v1/products?skip=${(page - 1) * limit}&limit=${limit}&page=${page}&category=${category}&price=${priceRange}`,
      );
      // delay the fetching for testing loading state

      const productModify = res.data.data.map(
        (item: ProductOriginal): Product => {
          const color = item.variants.map((v) => v.color);
          const size = item.variants.map((v) => v.size).sort();
          const price = item.variants.map((v) => v.price);
          return {
            color: color,
            size: size,
            price: price[0],
            ...item,
          } as Product;
        },
      );

      return {
        ...res.data,
        data: productModify,
      };
    },
    enabled: !!category,
    refetchOnWindowFocus: false,
  });
};
