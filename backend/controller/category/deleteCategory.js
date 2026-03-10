const categoryModel = require("../../models/categoryModel");
const productModel=require("../../models/productModel")
const deleteCategory = async(req, res) => {
    try{
      const categoryId  = req.body.categoryId
    
      const category = await categoryModel.deleteOne({_id:categoryId})
      
      console.log(category)
      res.json({
          data : category,
          message : "Xoá danh mục vật tư thành công  ",
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
  };
  
  module.exports = deleteCategory;