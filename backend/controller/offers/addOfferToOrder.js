
const offerModel = require("../../models/offerModel");
const orderModel=require("../../models/orderModel")
const userModel = require("../../models/userModel");

async function addOfferToOrder(req, res) {
    try {
        const currentUser = req.userId;
        const {offerId,orderId} = req.body;
        const user = await userModel.findOne({ _id: currentUser });
        const order =await orderModel.findOne({_id:orderId})
       

        // const existingOffer = user.offers.find(el => el._id.toString()=== offerId);
        // const existingOffer = user.offers.find(el => el._id.toString()=== offerId);
        // const existingOffer = user.offers.some(
        //     (offer) => offer.offerId === offerId
        // );
        const offer = await offerModel.findOne({_id:offerId})
        order.offerId=offerId;
        order.totalAmount-=offer.discountValue
         await order.save()
            return res.json({
                message: "Offer added to order successfully",
                data: order,
                data1:offer.discountValue,
                error: false,
                success: true
            });
            
            
           
    
        // return res.json({
        //     message: "User has already received this offer",
            
        //     error: true,
        //     success: false
        // });
        

    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "Internal server error", error: true, success: false });
    }
}

module.exports = addOfferToOrder;
