const orderModel = require("../../models/orderModel");
async function getOrderDetailById(req, res) {
  try {
     const  orderId  = req.body.orderId
    // const currenUser=req.userId
    //  const order = await orderModel.findById({_id:orderId,userId:currenUser})
    const order = await orderModel.findById({_id:orderId})
     res.json({
        data : order,
        message : "Ok",
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
  
}
module.exports = getOrderDetailById;
