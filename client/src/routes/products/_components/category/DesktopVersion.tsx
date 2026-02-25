import { useState } from "react";
import useCategories from "../../../../hooks/useCategories";
import { useProductStore } from "../../../../store/productStore";
import cn from "../../../../utils/cn";
import { SideBox, SideHeadingText } from "../sidepanel/SideComponent";
import { convertCentToUSD } from "../../../../utils/helper";

export default function DesktopVersion() {
  const { data } = useCategories();
  const { onCategory, values, onPriceRange } = useProductStore();
  const [currentPriceRange, setCurrentPriceRange] = useState(
    values.priceRange * 100,
  );
  return (
    <div className="side-panel col-span-3 flex flex-col gap-4">
      <div className="side-context flex flex-col gap-4">
        <SideBox>
          <div className="categories">
            <SideHeadingText>Category</SideHeadingText>
            <ul className="pt-2 text-zinc-600 flex flex-col">
              {data?.map((category) => (
                <li
                  key={category}
                  onClick={() => onCategory(category)}
                  className={cn(
                    "cursor-pointer border-b-2 border-transparent self-start capitalize",
                    values.category === category
                      ? "border-primary font-bold"
                      : "",
                  )}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </SideBox>
        <SideBox>
          <div className="categories">
            <SideHeadingText>Price</SideHeadingText>
            <p className="text-xl tracking-wider">
              {convertCentToUSD(currentPriceRange)}
            </p>
            <input
              type="range"
              name="price_range"
              id="price_range"
              min={0}
              max={500}
              step={10}
              defaultValue={values.priceRange}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCurrentPriceRange(Number(e.target.value) * 100);
              }}
              onMouseUp={(
                e: React.MouseEvent<HTMLInputElement, MouseEvent>,
              ) => {
                const el = e.target as HTMLInputElement;
                onPriceRange(Number(el.value));
              }}
            />
          </div>
        </SideBox>
      </div>
    </div>
  );
}
