const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");
let moment = require("moment");
const updateQuantityProduct = async (req, res) => {
  try {
    const currentUser = req.userId;
    const user = await userModel.findById(currentUser);

    const { quantity, productId, orderId } = req.body;

    const order = await orderModel.findById(
      // status: "pending",
      // userId: currentUser,
      orderId
    );
    // console.log(order)
    const orderTime = moment(order?.orderDate);
    const currentTime = moment();
    const timeDifference = currentTime.diff(orderTime, "minutes"); // Đo thời gian theo phút

    // console.log("Time difference in minutes:", timeDifference);

    if (quantity <= 0) {
      return res.json({
        error: true,
        success: false,
      });
    }
    if (timeDifference > 60 && user.role === "GENERAL") {
      return res.status(400).json({
        message:
          "Bạn chỉ có thể cập nhật trong 1 giờ sau khi đặt hàng thành công",
        error: true,
        success: false,
      });
    } else {
      let updateProduct = order?.items.find(
        (item) => item.productId.toString() === productId.toString()
      );
      order.totalAmount =
        order.totalAmount +
        (quantity - updateProduct.quantity) * updateProduct.sellingPrice;
      const product = await productModel.findById(updateProduct.productId);

      if (!product || product.isActive === false) {
        return res.status(400).json({
          message: "Vật tư này không còn hoạt động",
          error: true,
          success: false,
        });
      }
      const oldQuantity = updateProduct.quantity;
      if (quantity > oldQuantity) {
        if (product.stockQuantity <= 0) {
          return res.json({
            message: "Vật tư đã hết hàng ",
            error: true,
            success: false,
          });
        } else {
          let productUpdate = await productModel.findByIdAndUpdate(
            { _id: productId },
            { $inc: { stockQuantity: -1 } },
            { new: true }
          );
          updateProduct.quantity = quantity;
          console.log(productUpdate.stockQuantity);
          await order.save();
          return res.json({
            message: "Cập nhật số lượng vật tư thành công",
            data: order,
            data2: productUpdate.stockQuantity,
            error: false,
            success: true,
          });
        }
      }
      if (quantity < oldQuantity) {
        const productUpdate = await productModel.findByIdAndUpdate(
          { _id: productId },
          { $inc: { stockQuantity: 1 } },
          { new: true }
        );
        updateProduct.quantity = quantity;
        await order.save();
        console.log(productUpdate.stockQuantity);
        return res.json({
          message: "Cập nhật số lượng vật tư thành công",
          data: order,
          data2: productUpdate.stockQuantity,
          error: false,
          success: true,
        });
      }
    }
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = updateQuantityProduct;
