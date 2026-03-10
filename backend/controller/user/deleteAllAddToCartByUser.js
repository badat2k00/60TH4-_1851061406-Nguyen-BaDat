const cartModel = require("../../models/cartModel")

const deleteAllAddToCartProductByUser = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        const deleteProduct = await cartModel.deleteMany({userId:currentUserId})

        res.json({
            currentUserId:currentUserId,
            message : "Tất cả vật tư đã được xoá ",
            error : false,
            success : true,
            data : deleteProduct
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = deleteAllAddToCartProductByUser