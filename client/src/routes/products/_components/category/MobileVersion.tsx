import { useState } from "react";
import useCategories from "../../../../hooks/useCategories";
import { useProductStore } from "../../../../store/productStore";
import cn from "../../../../utils/cn";

export default function MobileVersion() {
  const [showMenu, setShowMenu] = useState(false);
  const { data } = useCategories();
  const { onCategory, values } = useProductStore();
  return (
    <div className="category-mobile drowdown menu mb-4 text-center  rounded-lg">
      <div className="tab bg-zinc-400 text-white p-2 ">
        <button
          className="font-bold text-shadow-amber-950"
          onClick={() => setShowMenu(!showMenu)}
        >
          Category
        </button>
      </div>

      <ul
        className={
          "bg-white flex flex-col h-0 overflow-hidden transition-all duration-200" +
          (showMenu ? " h-auto py-4" : "")
        }
      >
        {data?.map((category) => (
          <li
            key={category}
            className="hover:bg-zinc-100 py-2"
            onClick={() => onCategory(category)}
          >
            <span
              className={cn(
                "cursor-pointer border-b-2 self-start",
                values.category === category
                  ? "border-primary font-bold"
                  : "border-transparent",
              )}
            >
              {category}
            </span>
          </li>
        ))}
        {/* <li className="hover:bg-zinc-100 py-2">
          <span className="cursor-pointer border-b-2  border-primary self-start">
            All
          </span>
        </li>
        <li className="hover:bg-zinc-100 py-2">
          <span className="cursor-pointer border-b-2 border-transparent self-start">
            Nike
          </span>
        </li>
        <li className="hover:bg-zinc-100 py-2">
          <span className="cursor-pointer border-b-2 border-transparent self-start">
            Reebok
          </span>
        </li>
        <li className="hover:bg-zinc-100 py-2">
          <span className="cursor-pointer border-b-2 border-transparent self-start">
            Adidas
          </span>
        </li>
        <li className="hover:bg-zinc-100 py-2">
          <span className="cursor-pointer border-b-2 border-transparent self-start">
            Puma
          </span>
        </li> */}
      </ul>
    </div>
  );
}
