const offerModel=require("../../models/offerModel")
async function getAllOffers(req,res){
try {
    const allOffers=await offerModel.find()
    res.json({
       data:allOffers,
       success:true,
       error:false
    })
} catch (error) {
    
}
}
module.exports= getAllOffers