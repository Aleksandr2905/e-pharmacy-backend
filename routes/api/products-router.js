import express from "express";
import productsController from "../../controllers/products-controller.js";

const productsRouter = express.Router();

productsRouter.get("/", productsController.getAllProducts);

productsRouter.get("/:id", productsController.getProductsById);

export default productsRouter;
