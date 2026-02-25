import { model, Schema } from "mongoose";

export type IPendingOrder = {
  _id: string;
  customerId: Schema.Types.ObjectId;
  data: PendingOrderItem[];
  createdAt: string;
  updatedAt: string;
};
export type PendingOrderItem = {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  size?: string;
  color?: string;
};

export const pendingOrderSchema = new Schema<IPendingOrder>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    data: [
      {
        productId: { type: String, required: true },
        variantId: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        size: String,
        color: String,
      },
    ],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

export default model("PendingOrder", pendingOrderSchema, "pending_orders");
