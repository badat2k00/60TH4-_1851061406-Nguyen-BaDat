const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    productName: {
      type:String,
      required:true
    },
    brandName: String,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "category", 
      required: false,
    },
    productImage: [
     String
    ],
    description: {
      type: String,
      // required:true
     },
    stockQuantity:{
      type:Number,
      required:true
    },
    sellingPrice: {
     type: Number,
     required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;
