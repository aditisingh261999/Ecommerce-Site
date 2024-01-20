const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("not authorized token, please try again");
    }
  } else {
    throw new Error("Invalid token or no token provided");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const admin = await User.findOne({ email: email });

  if (admin.role !== "admin") {
    res.status(401).json({ message: "You are not admin" });
  } else {
    next();
  }
});
module.exports = { authMiddleware, isAdmin };
