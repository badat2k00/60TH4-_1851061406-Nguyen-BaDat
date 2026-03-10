let querystring = require("qs");
let config = require("config");
require("dotenv").config();

const orderModel = require("../../models/orderModel");
const cartModel = require("../../models/cartModel");
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

async function returnUrl(req, res) {
  
  let currentUser = req.userId;
  let vnp_Params = req.query;
  
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  
  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");

  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
  let responseCode = vnp_Params["vnp_ResponseCode"]; // Default to failure
  if (secureHash === signed) {
    // Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
   
    if (responseCode == "00") {
      await orderModel.findOneAndUpdate(
        { userId: currentUser, isPaid: false, paymentMethod: "VNPAY",status:"pending" },
        { $set: { isPaid: true ,status:"confirmed"} },
        { new: true }
      );
      // mới chỉ xóa khi chưa có đơn hàng chưa thanh toán từ trước .trường hợp này chỉ phù hợp khi khách hàng thanh toán trực tiếp (nhanh tức thì )
      await cartModel.deleteMany({ userId: currentUser});
      res.json({ code: responseCode,success:true });
    } else {
      await orderModel.findOneAndUpdate({ userId: currentUser, isPaid: false, paymentMethod: "VNPAY",status:"pending" },
        { $set: { status: "canceled" } })
      
      res.json({ code: responseCode,success:false });
    }
  }
}
module.exports = returnUrl;
