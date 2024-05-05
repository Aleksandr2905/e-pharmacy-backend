import express from "express";
import storesController from "../../controllers/stores-controller.js";

const storesRouter = express.Router();

storesRouter.get("/", storesController.getStores);

storesRouter.get("/nearest", storesController.getStoresNearest);

export default storesRouter;
