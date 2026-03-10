const orderModel = require("../../models/orderModel")

async function countProductsBuy(req,res){
    try{
        const items= await orderModel.find({status:"confirmed"})
        
        // let y = "2025-02-17T09:51:52.610Z";

        // // Chuyển đổi chuỗi y thành đối tượng Date
        // let date = new Date(y);
        
        // // Lấy ngày, tháng, năm từ đối tượng Date
        // let year = date.getUTCFullYear();
        // let month = date.getUTCMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
        // let day = date.getUTCDate();
        
        // console.log(`Năm: ${year}, Tháng: ${month}, Ngày: ${day}`);
        console.log(items)
        const totalCount = items.reduce((accumulator, group) => {
            return accumulator + group.items.reduce((innerAccumulator, item) => {
              return innerAccumulator + item.quantity;
            }, 0);
          }, 0);
         
        res.json({
            data : totalCount,
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

module.exports = countProductsBuy