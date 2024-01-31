const ProdCategory = require("../models/prodCategoryModels");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ProdCategory.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId();
  try {
    const category = await ProdCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId();
  try {
    const deleteCategory = await ProdCategory.findByIdAndDelete(id);
    res.status(200).json(deleteCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId();
  try {
    const getCategory = await ProdCategory.findById(id);
    res.status(200).json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, res) => {
  try {
    const getAllCategory = await ProdCategory.find();
    res.status(200).json(getAllCategory);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
};
