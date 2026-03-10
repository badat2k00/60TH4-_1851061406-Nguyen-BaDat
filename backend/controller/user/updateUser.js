const userModel = require("../../models/userModel")

async function updateUser(req,res){
    try{
        const sessionUser = req.userId

        const { name,profilePic} = req.body
        console.log(profilePic)
        console.log(name)
        console.log(sessionUser)
        const payload = {
            name:name,
            profilePic : profilePic,
           
        }

        const user = await userModel.findById(sessionUser)

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


module.exports = updateUser