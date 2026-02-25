import { Schema, model } from "mongoose";

export type IOrderItem = {
  customerId: Schema.Types.ObjectId;
  productId: Schema.Types.ObjectId;
  unitPrice: number;
  quantity: number;
  size?: string;
  color?: string;
  orderNumber: string;
  deliveryStatus: string;
};

const productSchema = new Schema<IOrderItem>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    size: String,
    color: String,
    unitPrice: Number,
    quantity: Number,
    orderNumber: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      default: "Pending",
    },
  },

  {
    timestamps: true,
  },
);
export default model("OrderItem", productSchema, "order_items");
