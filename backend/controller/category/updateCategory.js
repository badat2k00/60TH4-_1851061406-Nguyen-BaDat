const categoryModel = require('../../models/categoryModel');

async function updateCategory(req, res) {
    try {
        const { categoryId, categoryName } = req.body;
        console.log(categoryName ,categoryId)
        const allCategories = await categoryModel.find()
        const regex=/^(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/
        const existingCategory = allCategories.find(category => {
            return category.categoryName === categoryName && category._id.toString() !== categoryId;
        })
        if (existingCategory) {
            return res.status(400).json({
                message: 'Tên danh mục đã tồn tại.',
                error: true,
                success: false,
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
        // 3. Nếu không tìm thấy trùng tên, tiến hành cập nhật
        const categoryUpdate = await categoryModel.findByIdAndUpdate(
            categoryId,
            { categoryName: categoryName },
            { new: true }
        );

         if (!categoryUpdate) {
            return res.status(404).json({
                message: 'Không tìm thấy danh mục.',
                error: true,
                success: false,
            });
        }

        res.json({
            message: 'Cập nhật danh mục thành công.',
            error: false,
            success: true,
            data: categoryUpdate,
        });

    } catch (e) {
        console.error("Lỗi cập nhật danh mục:", e);
        res.status(400).json({
            message: error.message||err,
            error: true,
            success: false,
        });
    }
}

module.exports = updateCategory;