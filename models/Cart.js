import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSetting } from "./hooks.js";

const emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
const phoneRegexp = /^\+380\d{2}\d{3}\d{2}\d{2}$/;

const cartSchema = new Schema(
  {
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    //   required: true,
    // },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    isOrdered: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: String,
      enum: ["cash", "bank"],
    },
    username: {
      type: String,
      ref: "user",
    },
    email: {
      type: String,
      ref: "user",
      match: emailRegexp,
    },
    phone: {
      type: String,
      ref: "user",
      match: phoneRegexp,
    },
    address: {
      type: String,
      ref: "user",
    },
    total: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

cartSchema.post("save", handleSaveError);

cartSchema.pre("findOneAndUpdate", addUpdateSetting);

cartSchema.post("findOneAndUpdate", handleSaveError);

export const updateCartSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required("Products are required"),
});

export const cartCheckoutSchema = Joi.object({
  username: Joi.string().required("Name is required"),
  email: Joi.string().pattern(emailRegexp).required("Email is required"),
  phone: Joi.string().pattern(phoneRegexp).required("Phone number is required"),
  address: Joi.string().required("Address is required"),
  payment: Joi.string()
    .valid("cash", "bank")
    .required("Payment method is required"),
});

export const addToCartSchema = Joi.object({
  productId: Joi.string().required("Product id is required"),
  quantity: Joi.number().integer().required("Product quantity is required"),
});

export const decreaseQuantitySchema = Joi.object({
  productId: Joi.string().required("Product id is required"),
  quantity: Joi.number().integer().required("Product quantity is required"),
});

const Cart = model("cart", cartSchema);

export default Cart;
