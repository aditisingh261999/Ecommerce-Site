const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uplaodImages,
} = require("../controller/productController");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { is } = require("express/lib/request");
const { uploadFile, photoImgResize } = require("../middlewares/uploadImages");
const routes = express.Router();

routes.post("/create-product", authMiddleware, isAdmin, createProduct);
routes.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadFile.array("images", 10),
  photoImgResize,
  uplaodImages
);
routes.get("/:id", getaProduct);
routes.put("/wishlist", authMiddleware, addToWishList);
routes.put("/:id", authMiddleware, isAdmin, updateProduct);
routes.delete("/:id", authMiddleware, isAdmin, deleteProduct);
routes.delete("/ratings/:id", authMiddleware, rating);
routes.get("/allProducts", getAllProducts);

module.exports = routes;
