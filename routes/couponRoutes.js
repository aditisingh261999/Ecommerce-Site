const express = require("express");
const routes = express.Router();

const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

routes.post("/create-coupon", authMiddleware, isAdmin, createCoupon);
routes.post("/coupons", authMiddleware, isAdmin, getAllCoupons);
routes.post("/update-coupons/:id", authMiddleware, isAdmin, updateCoupon);
routes.post("/delete-coupons/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = routes;
