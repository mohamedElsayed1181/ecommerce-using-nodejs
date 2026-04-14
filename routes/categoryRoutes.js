const express = require("express");
const router = express.Router();

const { getAllCategories } = require("../controllers/categoryController");
const { getProductsByCategory } = require("../controllers/productController");

router.get("/", getAllCategories);

router.get("/:id/products", getProductsByCategory);

module.exports = router;