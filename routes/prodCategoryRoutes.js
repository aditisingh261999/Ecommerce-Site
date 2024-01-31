const express = require("express");
const routes = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategory,
} = require("../controller/prodCategoryController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

routes.post("/update-category", createCategory);
routes.put("/create-category/:id", authMiddleware, isAdmin, updateCategory);
routes.delete("/delete-category/:id", authMiddleware, isAdmin, deleteCategory);
routes.get("/fetch-category/:id", authMiddleware, isAdmin, getCategory);
routes.get("/fetch-Allcategory/", getAllCategory);

module.exports = routes;
