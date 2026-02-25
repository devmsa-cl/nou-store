import { useQuery } from "@tanstack/react-query";
import fetchAPI from "../utils/fetchAPI";
export default function useCategories() {
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetchAPI(`/api/v1/products/categories`);
      // add "all" category
      const data = ["all", ...res.data];
      return data;
    },
  });
}
