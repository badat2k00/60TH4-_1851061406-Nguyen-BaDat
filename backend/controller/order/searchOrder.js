const orderModel = require("../../models/orderModel")

const searchOrder = async(req,res)=>{
    try{
        const query = req.query.q 

        const regex = new RegExp(query,'i','g')

        const product = await orderModel.find({
            "$or" : [
                {
                    _id : regex
                },
                {
                    orderName : regex
                }
            ]
        })
        const {startedDate,endedDate}=req.body

        const filterbyOrderDate = await order.find({
            
            orderDate: {
                $gte: new Date(startedDate),
                $lte: new Date(endedDate)
            }
        })

        res.json({
            data  : product ,
            message : "Search Product list",
            error : false,
            success : true
        })
    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = searchOrder