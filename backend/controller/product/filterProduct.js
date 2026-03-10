
const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");

const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];  
    if (typeof categoryList === 'string') {
      categoryList = [categoryList];
    }
    const categories = await categoryModel.find({
      categoryName: { "$in": categoryList },
    });

    const categoryIds = categories.map(category => category._id);

    const filterConditions = {isActive:true};
    if (categoryIds.length > 0) {
      filterConditions.categoryId = { "$in": categoryIds };
    }

    const product = await productModel.find(filterConditions);

    res.json({
      data: product,
      message: "Products fetched successfully",
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = filterProductController;
