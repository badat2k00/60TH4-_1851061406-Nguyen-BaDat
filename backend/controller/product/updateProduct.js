const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel')

async function updateProductController(req,res){
    try{

        if(!uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, ...resBody} = req.body
        console.log(_id)
        const updateProduct = await productModel.findByIdAndUpdate(_id,{...resBody,isActive:true},{new:true})
        console.log(resBody)
        res.json({
            message : "Vật tư được cập nhật thành công",
            data : updateProduct,
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


module.exports = updateProductController


/* 
const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');
const productUpdateModel = require('../../models/productUpdateModel'); // ✅ thêm dòng này

async function updateProductController(req, res) {
  try {
    if (!uploadProductPermission(req.userId)) {
      throw new Error("Permission denied");
    }

    const { _id, quantityToAdd, ...restData } = req.body;

    const existingProduct = await productModel.findById(_id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    const oldStock = existingProduct.stockQuantity;
    const quantityAdded = Number(quantityToAdd || 0);
    const newStock = oldStock + quantityAdded;

    // ✅ Cập nhật stockQuantity
    const updatedProduct = await productModel.findByIdAndUpdate(
      _id,
      { ...restData, stockQuantity: newStock },
      { new: true }
    );

    // ✅ Ghi vào lịch sử cập nhật
    await productUpdateModel.create({
      product_id: _id,
      quantity_added: quantityAdded,
      old_stock: oldStock,
      new_stock: newStock,
      updated_by: req.userId, // nếu có user
      note: restData.note || ""
    });

    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
      success: true,
      error: false
    });

  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = updateProductController;

*/