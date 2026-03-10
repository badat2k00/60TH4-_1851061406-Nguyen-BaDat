const mongoose = require('mongoose')

const cart = mongoose.Schema({
   productId : {
        ref : 'product',
        type : String,
   },
   quantity : Number,
   userId : {
    type:String,
    required:true
    
}
},{
    timestamps : true
})


const cartModel = mongoose.model("cart",cart)

module.exports = cartModel