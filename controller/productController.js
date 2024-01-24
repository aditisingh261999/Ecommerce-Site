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
    // Filtering out products
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((ele) => delete queryObj[ele]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = await Product.find(JSON.parse(queryString));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    // Limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields().split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-_id -__v");
    }

    // Pagination
    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page, 10);
      const limit = parseInt(req.query.limit, 10);
      const skip = page * limit;
      query = query.skip(skip).limit(limit);
    }

    const product = await query;
    res.json(product);
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
