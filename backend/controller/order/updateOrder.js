const orderModel = require("../../models/orderModel");
const fetchOrderByUser = require("./getOrdersbyUser");
const userModel = require("../../models/userModel")
let  moment =require("moment")
async function updateOrder(req, res, next) {
   
  const currentUser = req.userId;
  
  const { shippingAddress, phoneNumber, customerName, detail, orderId,items,offerId,totalAmount } =
    req?.body;

    console.log(req?.body.offerId)
  try {
    const findUser=await userModel.findById(currentUser)
    const order = await orderModel.findOne({ _id: orderId, status: "pending" });
    if (!order) {
      return res.status(404).json({
        message: "Đơn hàng hiện tại đang",
        error: true,
      });
    }

    const orderTime = moment(order.orderDate);
    const currentTime = moment();

    // Tính sự khác biệt giữa thời gian hiện tại và thời gian đơn hàng
    const timeDifference = currentTime.diff(orderTime, 'minutes'); // Đo thời gian theo phút

    // console.log("Time difference in minutes:", timeDifference);
    if (timeDifference > 60&& findUser.role==="GENERAL") {

      return res.status(400).json({
        message: "Bạn chỉ có thể sửa đơn hàng trong 1 giờ sau khi đặt hàng thành công",
        error: true,
        success:false,
      });
    }
   
    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: orderId, status: "pending" },
      {
        offerId:offerId,
        shippingAddress,
        phoneNumber,
        customerName,
        userId:currentUser,
        detail,
        status:"pending",
        totalAmount:totalAmount
      },
      {new:"true"}
    );
    // console.log(updatedOrder)

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

   
    res.json({
      data: updatedOrder,
      message: "Đơn hàng đã được cập nhật thành công",
      error: false,
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

module.exports = updateOrder;
