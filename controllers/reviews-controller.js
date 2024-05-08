import { ctrlWrapper } from "../decorators/index.js";
import Reviews from "../models/Reviews.js";

const getReviews = async (req, res) => {
  const { limit = 3 } = req.body;
  const result = await Reviews.find().limit(limit);

  res.json(result);
};

export default {
  getReviews: ctrlWrapper(getReviews),
};
