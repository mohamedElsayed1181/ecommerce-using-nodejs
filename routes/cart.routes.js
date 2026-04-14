const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, cartController.addToCart);
router.get("/", protect, cartController.getCart);
router.delete("/:itemId", protect, cartController.removeFromCart);

module.exports = router;
