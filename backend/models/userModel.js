const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name : String,
    email : {
        type : String,
        unique : true,
        required : true
    },
    isGoogleLink:{
        type:Boolean,
        default:false
    },
    password : String,
    originpassword:String,
    profilePic : String,
    role : String,
    
    offers: [
        {
            offerId: { type: mongoose.Schema.Types.ObjectId,ref:'offer'},                        
        }
    ],
},{
    timestamps : true
})


const userModel =  mongoose.model("user",userSchema)


module.exports = userModel