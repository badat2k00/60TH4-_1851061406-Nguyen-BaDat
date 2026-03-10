const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");

const updateAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const addToCartProductId = req.body?._id;
    const newQuantity = req.body.quantity;

    if (!addToCartProductId || !newQuantity || newQuantity < 1) {
      return res.status(400).json({
        message: "Số lượng không hợp lệ.",
        error: true,
        success: false,
      });
    }

    const cartProduct = await cartModel.findOne({
      _id: addToCartProductId,
      userId: currentUserId,
    });

    // if (cartProduct.productId) {
    //   return res.status(404).json({
    //     message: "Không tìm thấy vật tư trong giỏ hàng.",
    //     error: true,
    //     success: false,
    //   });
    // }

    const product = await productModel.findById(cartProduct.productId);
    if (!product.isActive) {
      return res.status(404).json({
        message: "Vật tư hiện tại đã ngừng kinh doanh . Bạn không thể thay đổi số lượng vật tư  ",
        error: true,
        success: false,
      });
    }

    const oldQuantity = cartProduct.quantity;

    if (newQuantity > oldQuantity) {
      if (product.stockQuantity <=0) {
        return res.status(400).json({
          message: `Không thể tăng số lượng. Số lượng tồn kho hiện tại: ${product.stockQuantity}.`,
          error: true,
          success: false,
        });
      }

      const updateProduct = await productModel.findByIdAndUpdate(
        product._id,
        { $inc: { stockQuantity: -1 } }, // Giảm 1 đơn vị tồn kho
        { new: true }
      );

      cartProduct.quantity = newQuantity;
      await cartProduct.save();

      return res.status(200).json({
        message: "Tăng số lượng thành công.",
        data: cartProduct,
        data2: updateProduct.stockQuantity,
        error: false,
        success: true,
      });
    }

    if (newQuantity < oldQuantity) {
      const updateProduct = await productModel.findByIdAndUpdate(
        product._id,
        { $inc: { stockQuantity: 1 } }, 
        { new: true }
      );

      cartProduct.quantity = newQuantity;
      await cartProduct.save();

      return res.status(200).json({
        message: "Giảm số lượng thành công.",
        data: cartProduct,
        data2: updateProduct.stockQuantity,
        error: false,
        success: true,
      });
    }

    // Nếu không thay đổi số lượng
    return res.status(200).json({
      message: "Không có thay đổi số lượng.",
      data: cartProduct,
      error: false,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err?.message || "Đã xảy ra lỗi trong quá trình cập nhật.",
      error: true,
      success: false,
    });
  }
};

module.exports = updateAddToCartProduct;
