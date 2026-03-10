const mongoose = require('mongoose')
const orderItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        ref: 'product',
        required: true
    },
    productName: String,
    productImage: [String],
    quantity: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    }
}, { _id: false }); // không tạo _id cho các document con

module.exports = orderItemSchema;