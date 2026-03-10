const orderModel = require("../../models/orderModel");
async function getOrderById(req, res) {
  try {
     const {id} = req.params
    // const currenUser=req.userId
    //  const order = await orderModel.findById({_id:orderId,userId:currenUser})
    const order = await orderModel.findById({_id:id})
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
module.exports = getOrderById;
