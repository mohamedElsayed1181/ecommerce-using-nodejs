const getSingleProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id)
    .populate("category");

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      data: product
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

module.exports = {getSingleProduct}