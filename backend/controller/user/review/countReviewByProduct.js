
const reviewModel=require("../../../models/reviewModel")
async function countReviewByProduct(req,res) {
    try {
        const {productId}=req.params;
        
        const countReview= await reviewModel.countDocuments({productId:productId})
        
        res.json({
            data:countReview
        })

    } catch (error) {
        
    }
}

module.exports=countReviewByProduct