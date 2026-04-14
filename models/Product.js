const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String },
      category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);


