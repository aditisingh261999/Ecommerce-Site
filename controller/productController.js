const Product = require("../models/productModels");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.json(newProduct);
});

module.exports = { createProduct };
