import z from "zod";
import { CATEGORY } from "../config/constant";

export const baseVariantSchema = z.object({
  price: z.coerce
    .number({ error: "Price is required" })
    .min(100, { error: "Price must be greater than 100" }),
  quantity: z.coerce.number(),
});
export const variantSchema = baseVariantSchema.extend({
  color: z.string().min(2),
  size: z.union([
    z.enum(["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "6XL"]),
    z.string().regex(/^\d+(\.\d+)?$/),
    z.string().regex(/^\d+[Xx]\d+$/), // Jeans sizes like "33X32" or "33x32"
  ]),
});

export const categoriesSchema = z.array(
  z.enum([...CATEGORY], { error: "Invalid category selected" }),
);

export const productSchema = z.object({
  name: z.string({ error: "Product name is required" }).min(3),
  isReadyForSale: z.boolean().optional(),
  description: z.string().optional(),
  categories: categoriesSchema.optional(),
});

export const checkoutSessionProductSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().min(1),
  color: z.string(),
  size: z.string(),
  price: z.number(),
  productName: z.string(),
  productDescription: z.string(),
});
export const checkoutItemsSchema = z.array(checkoutSessionProductSchema);
