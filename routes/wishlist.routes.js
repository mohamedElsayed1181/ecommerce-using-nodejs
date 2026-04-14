const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, wishlistController.addToWishlist);
router.get("/", protect, wishlistController.getWishlist);
router.delete("/:productId", protect, wishlistController.removeFromWishlist);

module.exports = router;
