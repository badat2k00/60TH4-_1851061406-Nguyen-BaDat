const categoryModel=require('../../models/categoryModel')
async function createCategory(req,res){
try {
    const {categoryName} = req.body;
     const payload={...req.body,status:true}
    const existingCategory = await categoryModel.findOne({ categoryName });
        const regex=/^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/
    if (existingCategory) {
        return res.json({
            message: "Tên danh mục đã tồn tại.",
            error: true,
            success: false
        });
    }
    if(regex.test(categoryName)){
            return res.status(400).json({
                message:"Tên danh mục không chứa số và các ký tự đặc biệt",
            message: error.message||err,
            error: true,
            success: false,
        });
        }
    const newCategory= new categoryModel(payload);
    const saveCategory = await newCategory.save();
   
    res.json({
        message: "Tạo danh mục thành công ",
        data: saveCategory,
        error: false,
        success: true
    });

} catch (error) {
    res.json({
        message: error?.message || e,
        error: true,
        success: false,
    });
}

}
module.exports=createCategory