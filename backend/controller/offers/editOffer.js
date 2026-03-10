const offerModel = require("../../models/offerModel");
const convertTime = require("../../helpers/convertTime");
async function editOffer(req, res) {
  try {
    const { _id, ...data } = req.body;

    const offer = await offerModel.findById(_id);
    // if (offer.code) {
    //   return res.json({
    //     message: " Ưu đãi đã tồn tại",
    //     data: offer,
    //     error: false,
    //     success: true,
    //   });
    // }
    const updatedOffer = await offerModel.findByIdAndUpdate(
      _id,
      {
        ...data,
        expireDate: convertTime(data.expireDate),
      },
      { new: true }
    );
    return res.json({
      message: " Cập nhật ưu đãi thành công",
      data: updatedOffer,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = editOffer;
