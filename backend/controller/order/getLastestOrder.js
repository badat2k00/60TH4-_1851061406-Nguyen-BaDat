const orderModel = require("../../models/orderModel");
async function getLastestOrder(req, res) {
  try {
    const currentUser = req.userId;
    const lastestorder = await orderModel.findOne({ userId: currentUser,status:"pending"
     }).sort({ createdAt: -1 });


     
     if(lastestorder){
      res.json({
        data: lastestorder,
        message: "Fetch Lastest Order Complete! You can't create order.Please pay or vercation you latest order",
        error: false,
        success: true,
      });
    }
    else{
      res.json({
        message: "No latest Order or you haven't ordered ",
        data:[],
        error: false,
        success: true,
      })
    }
  } catch (e) {
    res.json({
      message: e?.message || e,
      error: true,
      success: false,
    });
  }
  
}
module.exports = getLastestOrder;
