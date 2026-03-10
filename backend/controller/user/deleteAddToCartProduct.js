const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");

const deletecart = async (req, res) => {
  try {
    const currentUser = req.userId; 
    const cartId = req.body._id;

    // Lấy thông tin giỏ hàng và sản phẩm
    const cartProduct = await cartModel.findOne({
      _id: cartId,
      userId: currentUser,
    });
 
    // Lấy thông tin Vật tư
    const product = await productModel.findById(cartProduct.productId);
   
if (!product.isActive) {
  // Vẫn cho phép xóa khỏi giỏ, nhưng không update kho vì Vật tưkhông còn
  await cartModel.deleteOne({ _id: cartId, userId: currentUser });
  return res.status(200).json({
    message: "Vật tư hiện ngừng kinh doanh và xoá khỏi giỏ hàng của bạn ",
    success: true,
    error: false,
  });
}

    // Xóa Vật tưkhỏi giỏ hàng
    
    await cartModel.deleteOne({ _id: cartId, userId: currentUser });
    await productModel.findByIdAndUpdate(cartProduct.productId,{stockQuantity:product.stockQuantity+cartProduct.quantity},{new:true})
    // console.log(productModel)
    
   return res.json({
      message: "Vật tư đã xóa khỏi giỏ hàng",
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err?.message || "Đã xảy ra lỗi khi xóa sản phẩm.",
      error: true,
      success: false,
    });
  }
};

module.exports = deletecart;
