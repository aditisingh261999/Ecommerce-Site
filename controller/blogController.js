const Blog = require("../models/blogModels");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { loginUser } = require("./userController");

// create a new blog
const createBlog = asyncHandler(async (req, res, next) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

// fetch a blog and also need to update the numberOfViews
const getBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findById(id);
    const updatedViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numberOfViews: 1 },
      },
      {
        new: true,
      }
    );
    res.status(200).json(blog, updatedViews);
  } catch (error) {
    throw new Error(error);
  }
});

// update blog
const updateBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// get all blogs
const getAllBlogs = asyncHandler(async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

// delete a blog
const deleteBlog = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const blog = await Blog.findByIdAndDelete(id);
    res.status(200).json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

// like a blog
const likeBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  try {
    // find the blog whcih you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user id
    const loginUserId = req?.user?._id;
    // check if the user has already liked the blog
    if (blog.likes.includes(loginUser)) {
      // if the user has already liked the blog
      // then remove the user from the likes array
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
        },
        { new: true }
      );
      res.status(200).json(updatedBlog);
    } else {
      // if the user has not liked the blog
      // then add the user to the likes array
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $addToSet: { likes: loginUserId },
        },
        { new: true }
      );
      res.status(200).json(updatedBlog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// dislike a blog
const dislikeBlog = asyncHandler(async (req, res, next) => {
  const { blogId } = req.body;
  validateMongoDbId(blogId);
  try {
    // find the blog whcih you want to be disliked
    const blog = await Blog.findById(blogId);
    // find the login user id
    const loginUserId = req?.user?._id;
    // check if the user has already disliked the blog
    if (blog.dislikes.includes(loginUser)) {
      // if the user has already disliked the blog
      // then remove the user from the dislikes array
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
        },
        { new: true }
      );
      res.status(200).json(updatedBlog);
    } else {
      // if the user has not disliked the blog
      // then add the user to the dislikes array
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $addToSet: { dislikes: loginUserId },
        },
        { new: true }
      );
      res.status(200).json(updatedBlog);
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBlog,
  getBlog,
  updateBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
};
