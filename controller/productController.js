const Product = require("../models/productModels");
const User = require("../models/userModels");
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

// add to wishlist
const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    //check if user already exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    //check if profuct is already added to whishlist or not
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            wishlist: prodId,
          },
          $inc: {
            "wishlist.length": -1,
          },
        },
        {
          new: true,
        }
      );
    } else {
      let user = await User.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            wishlist: prodId,
          },
          $inc: {
            "wishlist.length": 1,
          },
        },
        {
          new: true,
        }
      );
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const rating = asyncHandler(async (req, res, next) => {
  const { _id } = req.params;
  const { star, prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    const alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString() === _id.toString()
    );
    if (!alreadyRated) {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            rating: {
              star: star,
              postedBy: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    } else {
      const updateRating = await Product.findOne(
        {
          rating: { $elemMatch: alreadyRated },
        },
        {
          $set: { "rating.$.star": star },
        },
        {
          new: true,
        }
      );
    }
    // this will count the avg ratings a product gets by individual users
    // will take all the stars and divide it by users
    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.rating.length;
    let ratingSum = getAllProducts.rating
      .map((items) => items.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRatings: actualRating,
      },
      {
        new: true,
      }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getaProduct,
  updateProduct,
  createProduct,
  getAllProducts,
  deleteProduct,
  addToWishList,
  rating,
};
