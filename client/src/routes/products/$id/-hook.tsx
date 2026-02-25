import { useMemo } from "react";
import type { Variant } from "../../../hooks/useProduct";

export const useAvailableSizes = (variants: Variant[]) => {
  return useMemo(() => {
    const sizes = variants.map((v) => v.size);
    return Array.from(new Set(sizes)).sort();
  }, [variants]);
};
export const useAvailableColors = (variants: Variant[], size: string) => {
  return useMemo(() => {
    const setColor = {} as Record<string, true>;
    const colors = [];

    for (const v of variants) {
      if (v.size === size && !setColor[v.color]) {
        setColor[v.color] = true;
        colors.push(v.color);
      }
    }
    return colors;
  }, [variants, size]);
};

export const useSelectedVariant = (
  variants: Variant[],
  size: string,
  color: string
) => {
  return useMemo(() => {
    return variants.find((v) => v.size === size && v.color === color) ?? null;
  }, [variants, size, color]);
};
