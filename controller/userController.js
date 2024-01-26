const { generateToken } = require("../config/accessToken");
const User = require("../models/userModels");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailController");
const crypto = require("crypto");

// register user
const register = asyncHandler(async (req, res, next) => {
  const email = req.body.email;
  const existingUser = await User.findOne({ email: email });

  if (existingUser) {
    throw new Error("User already exists!");
  } else {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: "Error creating user", error: error });
    }
  }
});

// login functionality  for users
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (user && (await user.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(user?._id);
      const updatedUser = await User.updateAndUpdate(
        user.id,
        { refreshToken: refreshToken },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 72 * 1000,
      });
      res.status(200).json({
        _id: user?._id,
        firstname: user?.firstname,
        lastname: user?.lastname,
        email: user?.email,
        mobile: user?.mobile,
        token: generateToken(user?._id),
      });
    } else {
      throw new Error("Email or password is incorrect!");
    }
  } catch (error) {
    console.error("Error logging in user:", error);

    res.status(400).json({
      message: "Error logging in user",
      error: error.message, // Return the error message for debugging
    });

    // Make sure to call next to pass the error to the error handler middleware
    next(error);
  }
});

// handle Refresh token
const handleRefreshToken = asyncHandler(async (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    return res.status(401).json({
      message: "No refresh token provided",
    });
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) {
    throw new Error("No refresh token present in the database or not matched");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.user.id) {
      throw new Error("Invalid refresh token");
    }
    const acessToken = generateToken(user?._id);
    res.json(acessToken);
  });
});

// logout functionality
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    return res.status(401).json({
      message: "No refresh token provided",
    });
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.status(204);
  }
  await User.findByIdAndUpdate(refreshToken, {
    refreshToken: null,
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(204);
});

// Get all users
const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Error getting users", error: error });
  }
});

// get a single user
const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId();
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error getting user", error: error });
  }
});

// delete a user
const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongoDbId();
  try {
    const user = await User.findByIdAndDelete(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Error deleting a user",
      error: error,
    });
  }
});

// update a user
const updateUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId();
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      {
        new: true,
      }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Error updating a user",
      error: error,
    });
  }
});

// block a user
const blockUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId();
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "User blocked successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error blocking a user",
      error: error,
    });
  }
});

// unblock a user
const unblockUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId();
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      message: "User unblocked successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Error unblocking a user",
      error: error,
    });
  }
});

// update password for a user
const updatePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const { password } = req.body;
  try {
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.status(200).json(updatedPassword);
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "Error updating a user",
      error: error,
    });
  }
});

// forget password token
const forgetPasswordToken = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    } else {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetUrl = `Hi, please follow this link to reset your password. <a href='http://localhost:4000/api/v1/users/reset-password/${token}'>Click</a>`;
      const data = {
        to: email,
        text: "Your password",
        subject: "Password Reset",
        html: resetUrl,
      };
      sendEmail(data);
      res.status(200).json(token);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// reset password
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { token } = req.params;
  try {
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400).json({
        message: "Password reset token is invalid or has expired",
      });
    } else {
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      const updatedPassword = await user.save();
      res.status(200).json(updatedPassword);
    }
  } catch (error) {
    res.status(400).json("UNable to reset password");
  }
});

module.exports = {
  register,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgetPasswordToken,
  resetPassword,
};
