const orderModel = require("../../models/orderModel")

async function countTotalAmount(req,res){
    try{
        const items= await orderModel.find({status:"confirmed"})
        // let sumTotalAmount= items.reduce(item=>,0)
        let TotalAmountArray=items.map(item=>item.totalAmount)
        let sumTotalAmount=TotalAmountArray.reduce((item,currentvalue)=>item+currentvalue)
        res.json({
            data : sumTotalAmount,
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

module.exports = countTotalAmount