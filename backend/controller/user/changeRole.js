const userModel = require("../../models/userModel")

async function changeRole(req,res){
    try{
        const { userId,role} = req.body
        
        const user = await userModel.findById(userId)

        const payload={
            role:role
        }
        console.log("user.role",user.role)



        const updateUser = await userModel.findByIdAndUpdate(user._id,payload,{new:true})

        
        res.json({
            data : updateUser,
            message : "User Updated",
            success : true,
            error : false
        })
    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = changeRole