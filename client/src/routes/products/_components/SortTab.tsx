import { useQueryClient } from "@tanstack/react-query";
import { CiViewColumn, CiViewList } from "react-icons/ci";
import { useProductStore } from "../../../store/productStore";
import type { Product } from "../../../hooks/useProduct";

export default function SortTab() {
  const client = useQueryClient();
  const { values } = useProductStore();
  const data = client.getQueryData([
    "products",
    values.category,
    values.limit,
    values.pageNumber,
    values.priceRange,
  ]) as { data: Product[] };

  return (
    <div className="sort-tabs flex bg-white px-4 py-2 rounded-xl">
      <div className="view-tab basis-10 flex gap-1">
        <button className="cursor-pointer bg-black rounded-md p-1 border-[1px] border-zinc-700">
          <CiViewColumn size={20} className="text-white" />
        </button>
        <button className="cursor-pointer rounded-md p-1 border-[1px] border-zinc-700">
          <CiViewList size={20} />
        </button>
      </div>
      <div className="item-found flex-1 text-center text-xs lg:text-md font-serif text-zinc-600">
        <p>{data && data.data ? data.data.length : "0"} </p>
        <p>products found.</p>
      </div>
      <div className="filter flex items-center">
        <p className="text-zinc-700 font-semibold capitalize hidden md:inline">
          sort by:
        </p>
        <select name="sort" id="sort" className="text-zinc-700">
          <option value="price-lower">Price (lowest)</option>
          <option value="price-high">Price (highest)</option>
          <option value="a-z">Name (A-Z)</option>
          <option value="z-a">Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
}
