const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [productId]
      });
    } else {
      // Prevent duplicates
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
      }
    }

    await wishlist.populate("products");
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

    if (!wishlist) {
      return res.status(200).json({ user: userId, products: [] });
    }

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );
    await wishlist.save();
    await wishlist.populate("products");

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
