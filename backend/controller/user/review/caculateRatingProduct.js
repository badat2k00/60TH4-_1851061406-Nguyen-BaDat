
const reviewModel=require("../../../models/reviewModel")
async function caculateRatingProduct(req,res) {
    try {
        const {productId}=req.params;
        
        const countReview= await reviewModel.countDocuments({productId:productId})
        const allReviewByProductId=await reviewModel.find({productId:productId})
        
        let sumRating=0;
        let rateScore=0;
        for(review of allReviewByProductId){
            sumRating+=review["rating"]
            rateScore=Math.floor(sumRating/allReviewByProductId.length)
        }
        res.json({
            data:rateScore
        })

    } catch (error) {
        console.log(err)
    }
}

module.exports=caculateRatingProduct