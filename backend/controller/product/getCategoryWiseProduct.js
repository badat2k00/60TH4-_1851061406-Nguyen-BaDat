const productModel = require("../../models/productModel")
// Tìm sản phẩm theo loại 
const categoryModel=require("../../models/categoryModel")
const getCategoryWiseProduct = async(req,res)=>{
    try{
        const  category  = req.body.category || req.query.category
        
        const productId=req.body.productId
        // const product = await productModel.find({ category })

        const categoryId=await categoryModel.findOne({categoryName:category})

        const product = await productModel.find({ categoryId ,isActive:true})
        
        if(category=="Khác"){
            const product= await productModel.find({categoryId:null,isActive:true})

            const product2= product.filter(p=>p._id.toString()!==productId)
            // console.log(product2)
            return res.json({
                data : product2,
                message : "Product",
                success : true,
                error : false
            })
        }else{
        // 
        if(productId){
            const product2= product.filter(p=>p._id.toString()!==productId)
            console.log(product2)
            return res.json({
                data : product2,
                message : "Product",
                success : true,
                error : false
            })
        }
        else{
           return  res.json({
                data : product,
                message : "Product",
                success : true,
                error : false
            })
        }
    }
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = getCategoryWiseProduct