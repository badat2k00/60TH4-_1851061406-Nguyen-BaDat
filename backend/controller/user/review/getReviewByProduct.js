const reviewModel= require("../../../models/reviewModel")
const userModel=require("../../../models/userModel")
async function getReviewByProduct(req,res) {
    try {
        let productId=req.params.productId;
         const reviews=await reviewModel.find({productId: productId})

         const ratingArray=reviews.map(review=>review.rating);
         const SumOneRating=ratingArray.filter(rate=>rate==1).length
         const SumTwoRating=ratingArray.filter(rate=>rate==2).length
         const SumThreeRating=ratingArray.filter(rate=>rate==3).length
         const SumFourRating=ratingArray.filter(rate=>rate==4).length
         const SumFiveRating=ratingArray.filter(rate=>rate==5).length
         const percentageOneRating=SumOneRating/ratingArray.length*100
         const percentageTwoRating=SumTwoRating/ratingArray.length*100
         const percentageThreeRating=SumThreeRating/ratingArray.length*100
         const percentageFourRating=SumFourRating/ratingArray.length*100
         const percentageFiveRating=SumFiveRating/ratingArray.length*100
    res.status(201).json({
        data:reviews,
        data1:{SumOneRating,SumTwoRating,SumThreeRating,SumFourRating,SumFiveRating},
        data2:{percentageOneRating,percentageTwoRating,percentageThreeRating,percentageFourRating,percentageFiveRating},
        message:"Fetch Review Successfully",
        success:true,
        error:false})
    } catch (error) {
        console.log(error)
    }
}
module.exports=getReviewByProduct