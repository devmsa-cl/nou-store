import { useQuery } from "@tanstack/react-query";
import fetchAPI from "../utils/fetchAPI";
import type { Product } from "./useProduct";

export const useFeatureProduct = () => {
  return useQuery<Product[]>({
    queryKey: ["featureProduct"],
    queryFn: async () => {
      const r = await fetchAPI("/api/v1/products/features");

      return r.data;
    },
    refetchOnWindowFocus: false,
  });
};
