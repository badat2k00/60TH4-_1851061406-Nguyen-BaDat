const orderModel = require("../../models/orderModel");

async function getOrderByPhone(req, res) {
  try {
    const { phoneNumber } = req.body;


    const order = await orderModel.findOne({
      phoneNumber: phoneNumber,
      status: { $in: ["confirmed", "pending"] },
    });

    if (!order) { 
      res.json({
        message: "Không tìm thấy đơn hàng của bạn",
        success:false,
        error: true,
      });
    } else {
      res.json({
        data: order,
        message: "Tìm thành công",
        success: true,
        error: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
}

module.exports = getOrderByPhone;