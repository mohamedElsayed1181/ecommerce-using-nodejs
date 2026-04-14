const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);
module.exports = mongoose.model("users", userSchema);
