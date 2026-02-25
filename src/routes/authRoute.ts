import { Router } from "express";
import {
  registerUser,
  loginUser,
  addNewAddress,
  userAddresses,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").post(registerUser);
router
  .route("/addresses")
  .post(authMiddleware, addNewAddress)
  .get(authMiddleware, userAddresses);
router.route("/login").post(loginUser);
export default router;
