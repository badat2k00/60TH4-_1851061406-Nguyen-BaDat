const orderModel = require("../../models/orderModel");
const moment = require("moment");
async function getAllOrders(req, res) {
  try {
    const allOrders = await orderModel.find().sort({ orderDate: -1 });

    const now = moment();
    const expiredDays = 7;

    for (let order of allOrders) {
      const orderTime = moment(order.orderDate);
      const diffInDays = now.diff(orderTime, "days");

      if (order.status === "pending" && diffInDays >= expiredDays) {
        order.status = "canceled";
        await order.save();
      }
    }

    res.json({
      data: allOrders,
      message: "All Order ",
      error: false,
      success: true,
    });
  } catch (e) {
    res.json({
      message: e?.message || e,
      error: true,
      success: false,
    });
  }
}
module.exports = getAllOrders;
