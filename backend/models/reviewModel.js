const mongoose = require('mongoose')
let moment =require("moment-timezone")


moment.tz.setDefault("Asia/Ho_Chi_Minh");
const reviewSchema = mongoose.Schema({
    userId:{
        type:String,
        ref:'user'
    },
    productId:{
        type:String,
        ref:'product'
    },
    name:{
        type:String
    },
    profilePic:{
        type: String
    },
    rating:Number,
    comment:String, 
    reviewdate: {
        type: Date,
        default: moment().tz("Asia/Ho_Chi_Minh").toDate()
    },  
    
},{
    timestamps : true
})


const reviewModel = mongoose.model("review",reviewSchema)

module.exports = reviewModel