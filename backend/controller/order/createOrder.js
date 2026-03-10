const orderModel = require("../../models/orderModel");
const orderItemSchema = require("../../models/orderItemsModel");
const productModel = require("../../models/productModel");
const addToCartModel = require("../../models/cartModel");
const userModel = require("../../models/userModel");
async function createOrder(req, res, next) {
  try {
    const currentUser = req.userId;
    const {
      customerName,
      shippingAddress,
      phoneNumber,
      paymentMethod,
      detail,
      items,
      totalAmount,
      offerId,
    } = req?.body;

    /* nhập tên khách, địa chỉ ,số đt ,pttt,mô tả,danh sách vật tư,tổng số tiền ,mã ưu đãi */
    const findUser = await userModel.findById(currentUser);
    /* tìm kiếm user có userId  */
    if (!findUser) {
      return res.json({
        message: "Bạn phải đăng nhập ",
        error: true,
        success: false,
      });
    }
    if (findUser.role === "GENERAL") {
      const cartItems = await addToCartModel.find({ userId: currentUser });

      if (!cartItems || cartItems.length === 0) {
        return res.json({
          message: "Cart is empty.",
          error: true,
          success: false,
        });
      }

      // Khởi tạo tổng số tiền
      let totalAmount = 0;
      let processedItems = [];
      for (const cartItem of cartItems) {
        const { productId, quantity } = cartItem;

        const product = await productModel.findById(productId);
        if (!product) {
          return res.status(404).json({
            message: `Product with ID ${productId} does not exist.`,
            error: true,
            success: false,
          });
        }

        const { sellingPrice, productName, productImage } = product;

        totalAmount += sellingPrice * quantity;

        processedItems.push({
          productId,
          productName,
          productImage,
          quantity,
          sellingPrice,
        });
      }

      let isPaid = false;

      const payload = {
        customerName: customerName,
        orderDate: new Date(),
        shippingAddress: shippingAddress,
        phoneNumber: phoneNumber,
        status: "pending",
        isPaid: isPaid,
        paymentMethod: paymentMethod,
        userId: currentUser,
        items: processedItems,
        totalAmount: totalAmount,
        detail: detail,
        offerId: offerId,
      };

      const newOrder = new orderModel(payload);
      const saveOrder = await newOrder.save();

      res.json({
        message: "Tạo đơn hàng thành công",
        data: saveOrder,
        id: saveOrder._id,
        data2: addToCartModel,
        error: false,
        success: true,
      });
    } else {
      let isPaid = false;

      let newItems = [];
      for (let item of items) {
        const { _id, productName, productImage, quantity, sellingPrice } = item;
        let updateItem = {
          productId: _id,
          productName,
          productImage,
          quantity,
          sellingPrice,
        };
        newItems.push(updateItem);
      }
      const payload = {
        offerId:offerId,
        customerName: customerName,
        orderDate: new Date(),
        shippingAddress: shippingAddress,
        phoneNumber: phoneNumber,
        status: "pending",
        isPaid: isPaid,
        paymentMethod: paymentMethod,
        userId: currentUser,
        items: newItems,
        totalAmount: totalAmount,
        detail: detail,
      };
      console.log(items);
      const newOrder = new orderModel(payload);
      const saveOrder = await newOrder.save();

      res.json({
        message: "Create Order Successfully",
        data: saveOrder,
        id: saveOrder._id,
        error: false,
        success: true,
      });
    }
  } catch (e) {
    // Phản hồi với thông điệp lỗi
    res.json({
      message: e?.message || e,
      error: true,
      success: false,
    });
  }
}

module.exports = createOrder;

/* 




*/
