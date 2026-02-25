import express, { Router } from "express";
import { Types } from "mongoose";
import type Stripe from "stripe";
import { stripe } from "../libs/stripe";
import Order, { type ShippingAddress } from "../models/Order";
import OrderItem, { type IOrderItem } from "../models/OrderItem";
import PendingOrders from "../models/PendingOrders";
import User from "../models/User";
import Variant from "../models/Variant";
import { genOrderNumber } from "../utils/helper";
const router = Router();

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

type UserDetail = {
  name: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

router
  .route("/stripe")
  .post(
    express.raw({ type: "application/json" }),
    async (request, response) => {
      let event = request.body;
      // Only verify the event if you have an endpoint secret defined.
      // Otherwise use the basic event deserialized with JSON.parse
      if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = request.headers["stripe-signature"];
        try {
          event = await stripe.webhooks.constructEventAsync(
            request.body,
            signature as string,
            endpointSecret,
          );
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed.`, err);
          return response.sendStatus(400);
        }
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.started":
          break;
        case "checkout.session.completed": {
          console.log("Checkout session completed:");

          const data = event.data.object as Stripe.Checkout.Session;

          const details = data.customer_details;

          // billingAddress
          // const shippingAddress: ShippingAddress = {
          //   name: details?.name!,
          //   line1: details?.address?.line1!,
          //   line2: details?.address?.line2!,
          //   city: details?.address?.city!,
          //   state: details?.address?.state!,
          //   postal_code: details?.address?.postal_code!,
          //   country: details?.address?.country!,
          // };

          // get pending order id from metadata
          const pendingOrderId = event.data.object.metadata.pendingOrder;

          // get pending order
          const pendingOrder = await PendingOrders.findById(pendingOrderId);

          if (!pendingOrder) {
            return response.status(400).json({
              message: "Pending order not found",
            });
          }

          // shipping address id
          const shippingAddressID =
            event.data.object.metadata.shippingAddressID;

          const users = await User.findById(pendingOrder.customerId).select(
            "shippingAddress",
          );

          if (!users) {
            return response.status(400).json({
              message: "User not found",
            });
          }

          const address = users.shippingAddress.find(
            (address) => address._id.toString() === shippingAddressID,
          );

          // should use the billing address instead
          if (!address) {
            return response.status(400).json({
              message: "Shipping address not found",
            });
          }

          const shippingAddress: ShippingAddress = {
            name: `${address.firstName} ${address.lastName}`,
            line1: address.line1,
            city: address.city,
            state: address.state,
            postal_code: address.postalCode,
            country: address.country,
          };

          if (pendingOrder) {
            // create an order from pending order
            const order = await Order.insertOne({
              customerId: pendingOrder.customerId,
              orderNumber: genOrderNumber(),
              shippingAddress: shippingAddress,
              subtotal: data?.amount_subtotal ?? 0,
              totalAmount: data?.amount_total ?? 0,
            });
            // create order item

            if (order) {
              const orderItem: IOrderItem[] = pendingOrder.data.map((item) => ({
                customerId: pendingOrder.customerId,
                productId: item.productId as any,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                orderNumber: order.orderNumber,
                deliveryStatus: "Pending",
              }));
              await OrderItem.insertMany(orderItem);

              // delete pending order
              await PendingOrders.findByIdAndDelete(pendingOrderId);

              // update the variant stock
              await Variant.bulkWrite(
                pendingOrder.data.map((item) => ({
                  updateOne: {
                    filter: { _id: new Types.ObjectId(item.variantId) },
                    update: { $inc: { quantity: -item.quantity } },
                  },
                })),
              );
            }
          }

          break;
        }
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.amount} was successful!`,
          );

          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        case "payment_method.attached":
          const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    },
  );

export default router;
