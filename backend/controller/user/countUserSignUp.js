const userModel = require("../../models/userModel")

async function countUsers(req,res){
    try{
        // console.log("userid all Users",req.userId)

        const numberUser = await userModel.countDocuments()
        
        res.json({
            data : numberUser,
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

module.exports = countUsers