import { Schema, model } from "mongoose";

export type IOrder = {
  customerId: Schema.Types.ObjectId;
  orderNumber: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  totalAmount: number;
};
export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

const productSchema = new Schema<IOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    subtotal: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    orderNumber: {
      type: String,
      required: true,
    },
    shippingAddress: {
      name: { type: String, required: true },
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
    },
  },

  {
    timestamps: true,
  },
);
export default model("Order", productSchema, "orders");
