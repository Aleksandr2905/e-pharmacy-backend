import express from "express";
import reviewsController from "../../controllers/reviews-controller.js";

const reviewsRouter = express.Router();

reviewsRouter.get("/", reviewsController.getReviews);

export default reviewsRouter;
