const cartModel = require("../../models/cartModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const moment = require("moment");
const userModel = require("../../models/userModel");
const deleteProductInOrder = async (req, res) => {
  try {
    const currentUser = req.userId;
    const productId = req.body.productId;
    const orderId = req.body.orderId;
    const user = await userModel.findById(currentUser);
    const currentTime = moment();
     const order = await orderModel.findOne({
        _id: orderId,
      });

    const timeDifference = currentTime.diff(order.orderDate, "minutes");
    
    if (timeDifference > 60 && user.role === "GENERAL") {
      return res.status(400).json({
        message:
          "Bạn chỉ có xoá vật tư trong  đơn hàng này trong 1 giờ sau khi đặt hàng thành công",
        error: true,
        success: false,
      });
    } else {
     
      // const updateItems = await order.deleteOne({ _id: addToCartProductId });
      let product = await productModel.findById(productId);
      
      let deleteProduct = order.items.find(
        (item) => item.productId == productId 
      );
//       if (!deleteProduct) {
//        return res.status(400).json({
//       message: "Vật tư không tồn tại trong đơn hàng.",
//       error: true,
//       success: false,
//        });
// }


      let newItems = order.items.filter((item) => item.productId !== productId);
      // let newTotalAmount=order.totalAmount -deleteProduct.sellingPrice * deleteProduct.quantity;
      
      // const lastestCart = await cartModel.find({ userId: currentUser });
      await cartModel.deleteOne({ productId: productId, userId: currentUser });
      if (newItems.length > 0) {
        // let updateOrder= await orderModel.findByIdAndUpdate({_id:order._id},{items:newItems,totalAmount:newTotalAmount})
        order.items = newItems;
        await productModel.findByIdAndUpdate(
        productId,
        {$inc: { stockQuantity: deleteProduct.quantity }},
        { new: true }
      );
        

        order.totalAmount = newItems.reduce(
        (acc, item) => acc + item.sellingPrice * item.quantity,
        0
      );
        await order.save();
        // await cartModel.deleteOne({ productId: productId, userId: currentUser });
        console.log(order);
        return res.json({
          message: "vật tư được xoá khỏi đơn hàng",
          data: order,
          error: false,
          success: true,
        });
      } else {
        // await orderModel.deleteOne({ _id: order._id });
        return res.json({
          message: "Đơn hàng cần ít nhất 1 vật tư .Bạn nên thêm vật tư khác trước khi xoá vật tư này.",
          data: null,
          error: true,
          success: false,
        });
      }
      // cập nhật lại cái order sau khi xóa sp
    }
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = deleteProductInOrder;

/* 



let tonghang=100
function tinhslton(slmua,slban){
    let slton=tonghang-slban;
    if(slmua<slban){
        slban=slban-slmua
        
        return slban
    }
    if(slmua==slban){
  
    return slton
    }
    if (slmua>=tonghang){
        console.log("Het hang")
    }
    if(slmua>slban && slmua<tonghang){
        slton=tonghang-slmua;
        return slton
    }
}

console.log(tinhslton(100,80))

*/
