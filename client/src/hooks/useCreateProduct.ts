import { useQuery } from "@tanstack/react-query";
import fetchAPI from "../utils/fetchAPI";

export type Product = {
  images: string[];
  name: string;
  isReadyForSale: boolean;
  description: string;
  categories: string[];
  updatedAt: string;
  createdAt: string;
  _id: string;
};

export const useCreateProduct = (productId: string) => {
  return useQuery<Product>({
    queryKey: ["products", "create", productId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/v1/products/${productId}`);
      return res.data;
    },
    enabled: !!productId,
    refetchOnWindowFocus: false,
  });
};
