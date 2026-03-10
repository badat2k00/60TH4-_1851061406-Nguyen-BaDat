const reviewModel= require("../../../models/reviewModel")
const userModel=require("../../../models/userModel")
async function createReview(req,res) {
    try {
        const currentUser=req.userId;
        if(!currentUser){
            res.json({
                message : "Bạn cần đăng nhập để thực hiện thao tác này",
                error : true
            })
        }
        const productId=req.params.productId;
        const user=await userModel.findById(currentUser)
        const {rating,comment}=req.body;
        if(comment==!""&& rating==0){
            return res.json({
                message:"Bạn chưa nhập đủ ",
                error:true,
                success:false
            })
        }
        const payload={...req.body,userId:currentUser,productId:productId,name:user.name,profilePic:user.profilePic,reviewdate:new Date()}
        const newReview= new reviewModel(payload)
        const saveReview = await newReview.save()
        res.status(201).json({
            message : "Created review successfully",
            error : false,
            success : true,
            data : saveReview
        })
    } catch (err) {
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports=createReview