const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");

const getCategoryByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    let product = await productModel
      .findOne({ _id: productId,isActive:true })
      .populate("categoryId", "categoryName");
    
    if(!product.categoryId){
        res.json({
        message: "category",
      data: "Khác",
      success: true,
      error: false,
        })
    }else{
    res.json({
      message: "category",
      data: product?.categoryId?.categoryName,
      success: true,
      error: false,
    });
    }
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = getCategoryByProduct;
