const mongoose = require('mongoose')
let moment =require("moment-timezone")


moment.tz.setDefault("Asia/Ho_Chi_Minh");


const orderItemSchema =require('./orderItemsModel')
const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'user',
    },
    offerId:{
        type: String,
        ref: 'offer',
    },
    customerName:String,
    orderDate: {
        type: Date,
        default: moment().tz("Asia/Ho_Chi_Minh").toDate()
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending','confirmed','canceled']
    },
    isPaid:{
        type:Boolean,
        default:false
    },
    paymentMethod:{
        type:String,
        default:"",
        enum:['VNPAY','COD',""]
    },
    detail:{
        type:String
    },
    items: [orderItemSchema]
},{
    timestamps : true
})


const orderModel =  mongoose.model("order",orderSchema)


module.exports = orderModel