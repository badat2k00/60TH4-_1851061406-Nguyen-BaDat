const productModel = require("../../models/productModel")
const categoryModel= require("../../models/categoryModel")

const getCategoryProduct = async(req,res)=>{
    try{
        const productCategory = await productModel.distinct("categoryId")
        // const category= await categoryModel.find()
    const productByCategory = []

        for(const categoryId of productCategory){
            // console.log(categoryId)
            let product = await productModel.findOne({categoryId:categoryId }).populate('categoryId', 'categoryName');
            
            if(product){
                // let category= await categoryModel.findOne(categoryId,'categoryName')
                // product.category = category?.categoryName
                productByCategory.push({
                    productName:product.productName,
                    _id:product._id,
                    productImage:product?.productImage[0],
                    description:product.description,
                    sellingPrice:product.sellingPrice,
                    category:product.categoryId?.categoryName||"Khác"
                })
                
            }
        }

        
    
    res.json({  
            message : "category product",
            data : productByCategory,
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

module.exports = getCategoryProduct