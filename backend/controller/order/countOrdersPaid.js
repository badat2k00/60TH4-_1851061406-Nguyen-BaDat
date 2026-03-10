const orderModel = require("../../models/orderModel")

async function countOrdersPaid(req,res){
    try{
        const numberOrders = await orderModel.countDocuments({status:"confirmed"})
        
        res.json({
            data : numberOrders,
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = countOrdersPaid