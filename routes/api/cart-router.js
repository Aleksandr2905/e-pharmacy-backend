import express from "express";
import cartController from "../../controllers/cart-controller.js";
import authenticate from "../../middlewares/authenticate.js";
import validateBody from "../../decorators/validateBody.js";
import {
  addToCartSchema,
  cartCheckoutSchema,
  decreaseQuantitySchema,
  updateCartSchema,
} from "../../models/Cart.js";

const cartRouter = express.Router();

cartRouter.get("/", authenticate, cartController.getCartItems);

cartRouter.put(
  "/update",
  authenticate,
  validateBody(updateCartSchema),
  cartController.updateCart
);

cartRouter.post(
  "/checkout",
  authenticate,
  validateBody(cartCheckoutSchema),
  cartController.cartCheckout
);

cartRouter.patch(
  "/add",
  authenticate,
  validateBody(addToCartSchema),
  cartController.addToCart
);

cartRouter.patch(
  "/decrease",
  authenticate,
  validateBody(decreaseQuantitySchema),
  cartController.decreaseQuantity
);

cartRouter.delete(
  "/remove/:productId",
  authenticate,
  cartController.deleteFromCart
);

export default cartRouter;
