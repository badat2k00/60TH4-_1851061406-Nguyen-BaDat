const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const moment=require("moment")
const userModel=require("../../models/userModel")
const addToItemsOrder = async (req, res) => {
  try {
    const { productId, orderId } = req?.body;
    // const currentUser = req.userId;
    const currentUser=req.userId
    // Tìm đơn hàng đang "pending"
    const user=await userModel.findById(currentUser)
    const order = await orderModel.findById(orderId);
    console.log(order,"line 13")
    // console.log(orderId)
    const product = await productModel.findById(productId);
    // console.log(product)
    const orderTime = moment(order?.orderDate);
    const currentTime = moment();
    const timeDifference = currentTime.diff(orderTime, "minutes"); 
     if (timeDifference > 60 && user.role==="GENERAL"){
      return res.status(400).json({
        message: "Bạn chỉ có thể thêm vật tư vào đơn hàng này trong 1 giờ sau khi đặt hàng thành công",
        error: true,
        success:false,
      });
    }else{
    if (!product.isActive) {
      return res.status(404).json({
        message: "Vật tư hiện không sử dụng được . Vui lòng chọn Vật tư khác",
        success: false,
        error: true,
      });
    }

    // // Kiểm tra nếu Vật tưđã hết hàng
    if (product.stockQuantity <= 0) {
      return res.status(400).json({
        message: "Vật tư đã hết hàng.",
        success: false,
        error: true,
      });
    }

    const payload = {
      productId: productId,
      productName: product.productName,
      productImage: product.productImage[0],
      category: product.category,
      quantity: 1,
      sellingPrice: product.sellingPrice,
    };

    let existingItem = order.items.find(
      (item) => item.productId.toString() === productId
    );

    console.log(order,"line 57")
    if (existingItem && product.stockQuantity >= 0) {
      existingItem.quantity += 1;
      order.totalAmount += existingItem.sellingPrice;

      product.stockQuantity -= 1;
      await product.save();

      await order.save();
      // console.log(order)
      return res.json({
        data: order,
        success: true,
        error: false,
        message: "Vật tư đã được thêm vào đơn hàng",
      });
    } else {
      order.items.push(payload);
      order.totalAmount += product.sellingPrice;

      product.stockQuantity -= 1;
      await product.save();

      await order.save();
      // console.log(order)
      return res.json({
        data: order,
        success: true,
        error: false,
        message: "Vật tư đã được thêm vào đơn hàng",
      });
    }
  }
  } catch (err) {
    console.error(err);
    res.json({
      message: err?.message || err,

      error: true,
      success: false,
    });
  }
};

module.exports = addToItemsOrder;
