import { useQuery } from "@tanstack/react-query";
import fetchAPI from "../utils/fetchAPI";
import type { Product } from "./useCreateProduct";

export const useAllProduct = () => {
  return useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/v1/products/all`);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};
