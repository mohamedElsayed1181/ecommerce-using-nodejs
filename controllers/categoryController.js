const Category = require("../models/Category");

const getAllCategories = async (req, res) => {

  try {

    const categories = await Category.find();

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: categories
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = { getAllCategories };