import { Router } from "express";
import cache from "../libs/cache";
import OrderItem from "../models/OrderItem";

const router = Router();

router.route("/orders").get(async (req, res) => {
  const limit = req.query.limit;
  const skip = req.query.skip;

  if (cache.has(`admin_orders_${skip || 0}_${limit || 20}`)) {
    return res.json(cache.get(`admin_orders_${skip || 0}_${limit || 20}`));
  }

  const orders = await OrderItem.aggregate([
    {
      $match: {},
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: skip ? parseInt(skip as string) : 0,
    },
    {
      $limit: limit ? parseInt(limit as string) : 20,
    },
    {
      $lookup: {
        from: "users",
        let: {
          customerId: "$customerId",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$_id", "$$customerId"],
              },
            },
          },
          {
            $project: {
              password: 0,
            },
          },
        ],
        as: "customer",
      },
    },
    {
      $addFields: {
        customer: {
          $arrayElemAt: ["$customer", 0],
        },
      },
    },
  ]);

  const total = await OrderItem.countDocuments();

  cache.set(
    `admin_orders_${skip || 0}_${limit || 20}`,
    {
      limit: limit ? parseInt(limit as string) : 20,
      skip: skip ? parseInt(skip as string) : 0,
      total,
      data: orders,
    },
    30, // cache for 30 seconds
  );

  res.json({
    limit: limit ? parseInt(limit as string) : 20,
    skip: skip ? parseInt(skip as string) : 0,
    total,
    data: orders,
  });
});
router.route("/orders/:orderId/delivery-status").put(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const orderItem = await OrderItem.findById(orderId);
  if (!orderItem) {
    return res.status(404).json({ message: "Order item not found" });
  }

  orderItem.deliveryStatus = status;
  await orderItem.save();

  res.json({ message: "Order item updated successfully" });
});
export default router;
