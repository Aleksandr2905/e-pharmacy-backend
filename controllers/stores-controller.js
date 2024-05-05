import { ctrlWrapper } from "../decorators/index.js";
import Stores from "../models/Stores.js";
import StoresNearest from "../models/StoresNearest.js";

const getStores = async (req, res) => {
  const result = await Stores.find();

  res.json(result);
};

const getStoresNearest = async (req, res) => {
  const { limit = 6 } = req.body;

  const result = await StoresNearest.aggregate([{ $sample: { size: limit } }]);

  res.json(result);
};

export default {
  getStores: ctrlWrapper(getStores),
  getStoresNearest: ctrlWrapper(getStoresNearest),
};
