import { ctrlWrapper } from "../decorators/index.js";
import Reviews from "../models/Reviews.js";

const getReviews = async (req, res) => {
  const result = await Reviews.find();

  res.json(result);
};

export default {
  getReviews: ctrlWrapper(getReviews),
};
