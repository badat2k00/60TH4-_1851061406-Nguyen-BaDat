const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")

async function UploadProductController(req,res){
    try{
        const sessionUserId = req.userId
        const { categoryId, productName, brandName, color, productImage, description,stockQuantity, price, sellingPrice } = req.body;
        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Permission denied")
        }
    
        const uploadProduct = new productModel({ categoryId:categoryId || null,stockQuantity, productName, brandName,productImage, description,sellingPrice })
        const product= await productModel.findOne({productName:productName})
        
        if(product){
            res.json({
                message:"Vật tư đã tồn tại .Vui lòng dùng tên khác",
                error:true,
                success:false
            })
        }
        else{
        const saveProduct = await uploadProduct.save()
        let AllProducts=await productModel.find({})
        res.status(201).json({
            message : "Thêm vật tư thành công",
            error : false,
            success : true,
            data : saveProduct,
            updateProducts:AllProducts
        })
    }
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            
            error : true,
            success : false
        })
    }
}

module.exports = UploadProductController