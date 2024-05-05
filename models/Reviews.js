import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const reviewsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  testimonial: {
    type: String,
    required: true,
  },
});

reviewsSchema.post("save", handleSaveError);

reviewsSchema.pre("findOneAndUpdate", addUpdateSetting);

reviewsSchema.post("findOneAndUpdate", handleSaveError);

const Reviews = model("reviews", reviewsSchema);

export default Reviews;
