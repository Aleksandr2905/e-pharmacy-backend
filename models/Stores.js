import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const storesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

storesSchema.post("save", handleSaveError);

storesSchema.pre("findOneAndUpdate", addUpdateSetting);

storesSchema.post("findOneAndUpdate", handleSaveError);

const Stores = model("pharmacies", storesSchema);

export default Stores;
