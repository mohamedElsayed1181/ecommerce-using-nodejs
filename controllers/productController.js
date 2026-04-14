const Product = require("../models/Product");

const getProductsByCategory = async (req, res) => {

  try {

    const products = await Product.find({
      category: req.params.id
    });

    res.status(200).json({
      results: products.length,
      data: products
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = { getProductsByCategory };