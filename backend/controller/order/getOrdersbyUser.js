const orderModel = require("../../models/orderModel");
async function getOrdersbyUser(req, res) {
  try {
    const currentUser = req.userId;
    const userOrder = await orderModel.find({ userId: currentUser,
      // $or: [
      //   { isPaid: true, paymentMethod: { $in: ['VNPAY', 'COD'] } },
      //   { isPaid: false, paymentMethod: 'COD' }
      // ]
     }).sort({ orderDate: -1 });
    
    res.json({
      data: userOrder,
      message: "Fetch Order Complete",
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
module.exports = getOrdersbyUser;
