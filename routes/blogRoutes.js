const express = require("express");
const {
  createBlog,
  updateBlog,
  getBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
} = require("../controller/blogController");

const routes = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

routes.post("/create-blog", authMiddleware, isAdmin, createBlog);
routes.get("/blog/:id", authMiddleware, getBlog);
routes.put("/update-blog/:id", authMiddleware, isAdmin, updateBlog);
routes.get("/all-blogs", getAllBlogs);
routes.delete("/delete-blog/:id", authMiddleware, isAdmin, deleteBlog);
routes.put("/likes", authMiddleware, isAdmin, likeBlog);
routes.put("/dislikes", authMiddleware, isAdmin, dislikeBlog);

module.exports = routes;
