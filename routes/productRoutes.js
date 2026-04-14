const express = require("express");
const router = express.Router();

const { getSingleProduct } = require("../controllers/getSingleProduct");

router.get("/:id", getSingleProduct);

module.exports = router;