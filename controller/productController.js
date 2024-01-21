const Product = require("../models/productModels");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res, next) => {
  if (req.body.title) {
    const slug = await slugify(req.body.title, { lower: true });
    req.body.slug = slug;
  }
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getaProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne(id);
    res.json(product);
  } catch (error) {
    throw new Error(error.message);
  }
});

const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (error) {
    throw new Error(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.body.title) {
      req.body.slug = await slugify(req.body.title, { lower: true });
    }

    const updateproduct = await Product.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    res.json(updateproduct);
  } catch (error) {
    throw new Error(error.message);
  }
});

const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete(id);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = {
  getaProduct,
  updateProduct,
  createProduct,
  getAllProducts,
  deleteProduct,
};
