
const offerModel = require("../../models/offerModel");
const userModel = require("../../models/userModel");

async function addOfferToUser(req, res) {
    try {
        const currentUser = req.userId;
        const {offerId} = req.body;

        const user = await userModel.findOne({ _id: currentUser });
        if (!user) {
            return res.json({
                message: "Vui lòng đăng nhập để sử dụng tính năng này",
                error: true,
                success: false
            });
        }

        const existingOffer = user.offers.find(el => el._id.toString()=== offerId);
 
        if (!existingOffer) {
            user.offers.push({_id:offerId});
            await user.save()
            return res.json({
                message: "Thu thập ưu đãi thành công",
                data: user,
                error: false,
                success: true
            });
        }
        return res.json({
            message: "Người dùng đã sử dụng ưu đãi này ",
            error: true,
            success: false
        });
        

    } catch (error) {
        console.error(error);

    }
}

module.exports = addOfferToUser;