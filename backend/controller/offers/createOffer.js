
const offerModel = require('../../models/offerModel');
async function createOffer(req, res) {
    try { 
        const { code,detail,discountValue,discountType,maxDiscountMoney,minTotalAmount,offerDate} = req.body;
        // const { code,detail,discountValue} = req.body;
         const payload={...req.body,isActive:false}
        // const payload={...req.body} 
        const existingOffer = await offerModel.findOne({ code });

        if (existingOffer) {
            return res.json({
                message: "Offer already exists",
                error: true,
                success: false
            });
        }

        const newOffer= new offerModel(payload);
        const saveOffer = await newOffer.save();
       
        res.json({
            message: "Create Offer Successfully",
            data: saveOffer,
            error: false,
            success: true
        });
    } catch (e) {
        res.json({  
            message: e?.message || e,
            error: true,
            success: false,
        });
    }
}

module.exports = createOffer;

/* 




*/