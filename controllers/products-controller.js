import { ctrlWrapper } from "../decorators/index.js";
import HttpError from "../helpers/HttpError.js";
import Products from "../models/Products.js";

const getAllProducts = async (req, res) => {
  const { category, name, page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  let filter = {};

  if (category) {
    filter.category = category;
  }
  if (name) {
    filter.name = { $regex: new RegExp(name, "i") };
  }

  const totalProducts = await Products.countDocuments(filter);
  const totalPages = Math.ceil(totalProducts / limit);

  const result = await Products.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    currentPage: Number(page),
    totalPages: totalPages,
    totalProducts: totalProducts,
    products: result,
  });
};

const getProductsById = async (req, res) => {
  const { id } = req.params;

  const result = await Products.findById(id);
  if (!result) {
    throw HttpError(404, "Not Found");
  }

  res.json(result);
};

export default {
  getAllProducts: ctrlWrapper(getAllProducts),
  getProductsById: ctrlWrapper(getProductsById),
};
