import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const storesNearestSchema = new Schema(
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
  },
  { versionKey: false, timestamps: true }
);

storesNearestSchema.post("save", handleSaveError);

storesNearestSchema.pre("findOneAndUpdate", addUpdateSetting);

storesNearestSchema.post("findOneAndUpdate", handleSaveError);

const StoresNearest = model("nearest_pharmacies", storesNearestSchema);

export default StoresNearest;
