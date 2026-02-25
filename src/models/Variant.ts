import { Schema, model, Types } from "mongoose";

export interface IVariant extends Document {
  productId: Types.ObjectId; // Reference to Product
  color: string;
  size: string;
  price: number;
  images: string[];
  quantity: number;
  createdAt?: Date; // Timestamps added automatically
  updatedAt?: Date;
}

const variantSchema = new Schema<IVariant>(
  {
    productId: {
      type: Schema.ObjectId,
      ref: "Product",
    },
    images: {
      type: [String],
      default: [],
    },
    color: String,
    size: String,
    price: Number,
    quantity: Number,
  },
  {
    timestamps: true,
  }
);

export default model("Variant", variantSchema, "variants");
