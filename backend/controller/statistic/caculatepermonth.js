const convertTime= require("../../helpers/convertTime");
const orderModel=require("../../models/orderModel")
async function caculatepermonth(req,res) {
    try {
        const month=req.body.month;
        const numOrder =orderModel.countDocuments({orderDate:convertTime(month),isPaid:true})
        let totalAmount=0;
        totalAmount +=(orderDate);
       res.status(200).json({
        data:totalAmount
       })
    
    } catch (error) {
        console.error(error)
    }
}
module.exports=caculatepermonth