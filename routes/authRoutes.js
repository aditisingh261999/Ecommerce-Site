const express = require("express");
const {
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
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const routes = express.Router();

routes.post("/register", register);
routes.post("/login", loginUser);
routes.get("/logout", logoutUser);
routes.get("/all-users", getAllUsers);
routes.get("/:id", authMiddleware, isAdmin, getUser);
routes.delete("/:id", deleteUser);
routes.get("/refresh", handleRefreshToken);
routes.put("/edit-user", authMiddleware, updateUser);
routes.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
routes.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);

module.exports = routes;
