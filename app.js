import express from "express";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/api/auth-router.js";
import storesRouter from "./routes/api/stores-router.js";
import reviewsRouter from "./routes/api/reviews-router.js";
import productsRouter from "./routes/api/products-router.js";
import cartRouter from "./routes/api/cart-router.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/user", authRouter);
app.use("/api/stores", storesRouter);
app.use("/api/customer-reviews", reviewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
