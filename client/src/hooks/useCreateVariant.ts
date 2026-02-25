import { useQuery } from "@tanstack/react-query";
import fetchAPI from "../utils/fetchAPI";

export type Variant = {
  _id: string;
  color: string;
  size: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  productId: string;
  quantity: number;
};

export const useCreateVariant = (productId: string) => {
  return useQuery<Variant[]>({
    queryKey: ["products", "variants", productId],
    queryFn: async () => {
      const res = await fetchAPI(`/api/v1/products/${productId}/variants`);
      return res.data;
    },
    enabled: !!productId,
    refetchOnWindowFocus: false,
  });
};
