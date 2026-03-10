const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");

const addProductToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;

    // Kiểm tra nếu Vật tưđã tồn tại trong giỏ hàng
    const isProductAvailable = await cartModel.findOne({
      productId,
      userId: currentUser,
    });
    const product = await productModel.findById(productId);

    if (!product.isActive) {
      return res.status(404).json({
        message: "Vật tư hiện ngừng kinh doanh",
        success: false,
        error: true,
      });
    }
    if (isProductAvailable) {
      return res.status(404).json({
        message: "Vật tư đã có trong giỏ hàng",
        success: false,
        error: true,
      });
    }

    
    if (product.stockQuantity < 1) {
      return res.status(400).json({
        message: "Vật tư đã hết hàng.",
        success: false,
        error: true,
      });
    }
    
    let updateProductQuantity = product.stockQuantity - 1;
    const updateProduct = await productModel.findByIdAndUpdate(
      productId,
      { stockQuantity: updateProductQuantity },
      { new: true }
    );
    console.log(updateProductQuantity)
    const payload = {
      productId,
      quantity: 1,
      userId: currentUser,
    };
    const newAddToCart = new cartModel(payload);
    const saveProduct = await newAddToCart.save();

    return res.status(200).json({
      data: saveProduct,
      data2: updateProduct,
      message: "Vật tư đã được thêm vào giỏ hàng.",
      success: true,
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Đã xảy ra lỗi.",
      error: true,
      success: false,
    });
  }
};

module.exports = addProductToCart;
