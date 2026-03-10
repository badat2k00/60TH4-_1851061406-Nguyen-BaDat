const orderModel = require("../../models/orderModel");
const deleteOrder = async(req, res) => {
  try{
    const  orderId  = req.body.orderId
    const order = await orderModel.findOneAndDelete({_id:orderId},{ new: true })
    const allorders= await orderModel.find()
    
    console.log(order)
    res.json({
        data : allorders,
        message : "Deleted Order Successfully ",
        success : true,
        error : false
    })
  
    
  }catch(err){
    res.json({
        message : err?.message  || err,
        error : true,
        success : false
    })
  }
};

module.exports = deleteOrder;