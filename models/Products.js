import { Schema, model } from "mongoose";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const productsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    suppliers: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

productsSchema.post("save", handleSaveError);

productsSchema.pre("findOneAndUpdate", addUpdateSetting);

productsSchema.post("findOneAndUpdate", handleSaveError);

const Products = model("product", productsSchema);

export default Products;
