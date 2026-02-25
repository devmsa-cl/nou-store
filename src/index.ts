import express from "express";
import cors from "cors";
const app = express();

app.use(cors());

app.use(express.static(path.join(process.cwd(), "views")));

// connection datatbase
mongoose
  .connect(process.env.DB || "")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

import errorMiddleware from "./errors/errorMiddleware";
import mongoose from "mongoose";
import productRoute from "./routes/productRoute";
import paymentRoute from "./routes/paymentRoute";
import uploadRoute from "./routes/uploadRoute";
import webhookRoute from "./routes/webhookRoute";
import orderRouter from "./routes/orderRoute";
import authRoute from "./routes/authRoute";
import adminRoute from "./routes/adminRoute";
import { authMiddleware } from "./middlewares/authMiddleware";
import { adminMiddleware } from "./middlewares/adminMiddleware";
import path from "node:path";
app.use("/api/v1/products", express.json(), productRoute);
app.use("/api/v1/payments", express.json(), paymentRoute);
app.use("/api/v1/uploads", express.json(), uploadRoute);
app.use("/api/v1/orders", express.json(), orderRouter);
app.use("/api/v1/auth", express.json(), authRoute);
app.use(
  "/api/v1/admin",
  express.json(),
  authMiddleware,
  adminMiddleware,
  adminRoute,
);
app.use("/webhook", webhookRoute);
const VIEWS_PATH = path.join(process.cwd(), "views");
app.get("/*splat", (req, res) => {
  res.sendFile("index.html", { root: VIEWS_PATH });
});

app.use(errorMiddleware);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port " + (process.env.PORT || 5000));
});
