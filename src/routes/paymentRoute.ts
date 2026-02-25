import { Router } from "express";
import mongoose from "mongoose";
import Stripe from "stripe";
import z from "zod";
import { stripe } from "../libs/stripe";
import { authMiddleware } from "../middlewares/authMiddleware";
import PendingOrders, { type PendingOrderItem } from "../models/PendingOrders";
import Product from "../models/Product";
import type { IVariant } from "../models/Variant";
import {
  checkoutItemsSchema,
  checkoutSessionProductSchema,
} from "../schema/variantSchema";
import type { AuthRequest } from "../types/AppRequest";
import User from "../models/User";
const router = Router();

type CheckoutVariant = z.infer<typeof checkoutSessionProductSchema>;

router
  .route("/create-checkout-session")
  .post(authMiddleware, async (req: AuthRequest, res) => {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    const shippingAddressID = req.body.shippingAddressID;

    if (!shippingAddressID) {
      throw new Error("Shipping address is required");
    }

    // check if should Address exits
    const user = await User.findById(req.user.userId).select("shippingAddress");

    if (!user) {
      throw new Error("User not found");
    }

    if (
      !user.shippingAddress.find((a) => a._id.toString() === shippingAddressID)
    ) {
      throw new Error("Shipping address not found");
    }

    const cartItems = checkoutItemsSchema.safeParse(req.body?.cartItem);
    if (!cartItems.success) {
      throw cartItems.error;
    }

    // does not have any cart item
    if (cartItems.data.length === 0) {
      throw new Error("Cart is empty");
    }

    const productId = new Set();
    const cartVariant = new Map<string, CheckoutVariant>();

    cartItems.data.forEach((item) => {
      productId.add(item.productId);
      cartVariant.set(item.variantId, item);
    });

    const productIds = Array.from(productId).map(
      (id) => new mongoose.Types.ObjectId(id as string),
    );

    // fetch product and variant information from database
    const dbProducts = await Product.aggregate([
      {
        $match: {
          _id: {
            $in: productIds,
          },
        },
      },
      {
        $lookup: {
          from: "variants",
          localField: "_id",
          foreignField: "productId",
          as: "variants",
        },
      },
    ]);

    const databaseVariant = new Map<string, IVariant>();

    dbProducts.forEach((p) => {
      p.variants.forEach((variant: any) => {
        databaseVariant.set(variant._id.toString(), variant);
      });
    });

    const error = validateVariantAvailability(cartVariant, databaseVariant);

    if (error.length > 0) {
      throw new Error(...error);
    }

    const productionInformation = new Map<string, { images: string[] }>();

    dbProducts.forEach((item) => {
      productionInformation.set(item._id.toString(), {
        images: [
          ...item.images.map(
            (image: any) => process.env.S3_BUCKET_PUBLIC_URL + image,
          ),
        ],
      });
    });

    // create line items for stripe checkout session
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    cartVariant.forEach((item) => {
      lineItems.push({
        price_data: {
          product_data: {
            name: item.productName,
            description: item.productDescription,
            images: productionInformation.get(item.productId)?.images || [],
          },
          tax_behavior: "exclusive",
          unit_amount: item.price,
          currency: "usd",
        },
        quantity: item.quantity,
      });
    });

    const metadata = Array.from(
      cartVariant.values().map((item) => {
        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.price,
          color: item?.color,
          size: item?.size,
        };
      }),
    );

    // create pending order
    const pending = await PendingOrders.insertOne({
      customerId: req.user.userId as any,
      data: metadata as PendingOrderItem[],
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      automatic_tax: {
        enabled: true,
      },
      client_reference_id: req.user.userId as string,
      metadata: {
        pendingOrder: pending._id.toString(),
        shippingAddressID: shippingAddressID,
      },
      currency: "usd",
      mode: "payment",
      success_url: `http://localhost:5173/checkout/success`,
      cancel_url: `http://localhost:5173/checkout/cancel`,
    });

    res.json({
      url: session.url,
    });
  });

export default router;

/**
 * Validate variant availability before creating a checkout session
 * Variant could be checkout if the quantity is enough in stock
 */
function validateVariantAvailability(
  cartVariants: Map<string, CheckoutVariant>,
  databaseVariant: Map<string, IVariant>,
) {
  const errorMessage = [];
  for (const [variantId, cartVariant] of cartVariants) {
    const dbVariant = databaseVariant.get(variantId);
    if (!dbVariant) {
      errorMessage.push(`variant ${variantId} is not found`);
      break;
    }
    if (dbVariant.quantity < cartVariant.quantity) {
      errorMessage.push(
        `${cartVariant.productName} (size:${cartVariant.size}, color:${cartVariant.color}) is out of stock`,
      );
    }
  }

  return errorMessage;
}
