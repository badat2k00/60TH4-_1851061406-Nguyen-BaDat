const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const cartModel=require("../../models/cartModel")
const cancelOrder = async(req, res) => {
  try{
    const orderId  = req.body.orderId
    const order = await orderModel.findOneAndUpdate({_id:orderId},{status:"canceled"},{ new: true })
    for(i=0;i<order.items.length;i++){
        await productModel.findOneAndUpdate({_id:order.items[i].productId},{$inc:{stockQuantity:order.items[i].quantity}},{new:true})
    }
    await cartModel.deleteMany({ userId: order.userId });
    res.json({
        data : order,
        message : "Huỷ đơn hàng thành công",
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

module.exports = cancelOrder;