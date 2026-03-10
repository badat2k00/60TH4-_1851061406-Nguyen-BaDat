const userModel = require("../../models/userModel");
const offerModel= require("../../models/offerModel")
async function getOfferByUserId(req, res) {
    try {
        const currentUser = req.userId; 
        const user = await userModel.findById(currentUser);
        const offers = await offerModel.find({ _id: { $in: user.offers } });

        res.json({
            message: "Fetched user offers successfully",
            data: offers, // Trả về danh sách các bản ghi offer
            error: false,
            success: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error: true, success: false });
    }
}

module.exports = getOfferByUserId;

