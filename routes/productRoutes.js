const express = require("express");
const { createProduct } = require("../controller/productController");
const routes = express.Router();

routes.post("/", createProduct);

module.exports = routes;
