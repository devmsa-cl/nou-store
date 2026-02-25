import { Router } from "express";
import {
  getOrderByID,
  getOrderByOrderNumber,
  getOrdersByUser,
} from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/numbers/:orderNumber").get(getOrderByOrderNumber);
router.route("/:id").get(getOrderByID);
router.route("/").get(authMiddleware, getOrdersByUser);

export default router;
