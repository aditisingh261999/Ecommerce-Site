const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const routes = express.Router();

routes.post("/create-product", authMiddleware, isAdmin, createProduct);
routes.get("/:id", getaProduct);
routes.put("/wishlist", authMiddleware, addToWishList);
routes.put("/:id", authMiddleware, isAdmin, updateProduct);
routes.delete("/:id", authMiddleware, isAdmin, deleteProduct);
routes.get("/allProducts", getAllProducts);

module.exports = routes;
