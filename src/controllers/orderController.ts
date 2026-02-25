import type { Request, Response } from "express";
import Order from "../models/Order";
import type { AuthRequest } from "../types/AppRequest";
import mongoose from "mongoose";

/**
 * Get all orders by user
 */
export const getOrdersByUser = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.aggregate([
    {
      $match: { customerId: new mongoose.Types.ObjectId(req?.user?.userId) },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "order_items",
        let: { orderNumber: "$orderNumber" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$orderNumber", "$$orderNumber"] },
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId", // Use "productID" if that's the exact field name in order_items
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $addFields: {
              product: { $arrayElemAt: ["$product", 0] }, // Take first (and only) product; removes the array wrapper
            },
          },
        ],
        as: "items",
      },
    },
  ]);

  return res.json(orders);
};

export const getOrderByOrderNumber = async (req: Request, res: Response) => {
  const { orderNumber } = req.params;

  const orders = await Order.aggregate([
    {
      $match: { orderNumber: orderNumber },
    },
    {
      $lookup: {
        from: "order_items",
        let: { orderNumber: "$orderNumber" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$orderNumber", "$$orderNumber"] },
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productId", // Use "productID" if that's the exact field name in order_items
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $addFields: {
              product: { $arrayElemAt: ["$product", 0] }, // Take first (and only) product; removes the array wrapper
            },
          },
        ],
        as: "items",
      },
    },
  ]);

  if (orders.length === 0) {
    return res.status(404).json({ message: "Order not found" });
  }

  return res.status(200).json(orders[0]);
};

export const getOrderByID = async (req: Request, res: Response) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("productID");

  return res.status(200).json(order);
};
