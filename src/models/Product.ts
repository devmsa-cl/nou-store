import { Schema, model } from "mongoose";

type IProduct = {
  name: string;
  description: string;
  images: string[];
  categories: string[];
  isReadyForSale: boolean;
};
const productSchema = new Schema<IProduct>(
  {
    name: String,
    description: String,
    images: {
      type: [String],
      default: [],
    },
    categories: {
      type: [String],
      default: [],
    },
    isReadyForSale: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export default model("Product", productSchema, "products");
