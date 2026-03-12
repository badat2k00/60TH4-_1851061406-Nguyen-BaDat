const express = require('express')

const router = express.Router()

const countUsers=require("../controller/user/countUserSignUp")
const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const deleteOneProductController =require('../controller/product/deleteProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addProductToCart = require('../controller/user/addProductToCart')
const countAddToCartProduct = require('../controller/user/countCartQuantity')
const addToCartViewProduct  = require('../controller/user/getCartByUser')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const deleteAllAddToCartProductByUser=require('../controller/user/deleteAllAddToCartByUser')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const createOrder =require("../controller/order/createOrder")
const getOrdersbyUser=require("../controller/order/getOrdersbyUser");
const getLastestOrder=require("../controller/order/getLastestOrder")
const getAllOrders = require('../controller/order/getAllOrders')
const createPaymentUrl = require('../controller/payment/createPaymentUrl')
const returnUrl = require('../controller/payment/returnUrl')
const caculatepermonth = require('../controller/statistic/caculatepermonth')
// const refreshTokenController =require('../controller/user/refreshToken')
const getOrderDetailById = require('../controller/order/getOrderDetailById')
const updateOrder = require('../controller/order/updateOrder')
const deleteOrder = require('../controller/order/deleteOrder')
const createReview = require('../controller/user/review/createReview')
const countReviewByProduct = require('../controller/user/review/countReviewByProduct')
const caculateRatingProduct = require('../controller/user/review/caculateRatingProduct')
const getReviewByProduct = require('../controller/user/review/getReviewByProduct')
const createOffer = require('../controller/offers/createOffer')
const getAllOffers = require('../controller/offers/getAllOffers')

const addOfferToUser = require('../controller/offers/addOfferToUser')
const getOfferByUserId = require('../controller/offers/getOfferByUserId')

const addToItemsOrder = require('../controller/order/addToItemsOrder')
const deleteProductInOrder = require('../controller/order/deleteProductInOrder')
const updateQuantityProduct = require('../controller/order/updateQuantityProductOrder')
const deleteOffer = require('../controller/offers/deleteOffer')
const countOrdersPaid = require('../controller/order/countOrdersPaid')
const addOfferToOrder = require('../controller/offers/addOfferToOrder')
const getOrderById = require('../controller/order/getOrderById')
const getAllCategory = require('../controller/category/getAllCategory')
const deleteCategory = require('../controller/category/deleteCategory')
const createCategory = require('../controller/category/createCategory')
const getCategoryByProduct = require('../controller/product/getCategoryByProduct')
const getCartByUser = require('../controller/user/getCartByUser')
const countProductsBuy = require('../controller/statistic/countProductsBuy')
const countTotalAmount = require('../controller/statistic/countTotalAmount')
const getOrderByPhone = require('../controller/order/getOrderByPhoneNumber')
const updateCategory = require('../controller/category/updateCategory')
const editOffer = require('../controller/offers/editOffer')
const changePassword = require('../controller/user/changePassword')
const sendPassword = require('../controller/user/sendMail/sendPassword')
const changeRole = require('../controller/user/changeRole')
const receiveEmail = require('../controller/user/receiveEmail')
const cancelOrder = require('../controller/order/cancelOrder')
const searchUser = require('../controller/user/searchUser')
// user
router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
// router.post('/refresh-token',refreshTokenController);
router.get("/user-details",authToken,userDetailsController)
router.post("/search-user",authToken,searchUser)
router.get("/countusers",authToken,countUsers)
router.get("/userLogout",userLogout)
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.post("/change-role",authToken,changeRole)
router.post("/change-password",authToken,changePassword)
router.post("/send-password",sendPassword)
// category
router.get("/all-category",getAllCategory)
router.post("/delete-category",deleteCategory)
router.post("/create-category",createCategory)
router.post("/update-category",updateCategory)
//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.post("/delete-one-product",authToken,deleteOneProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.get("/count-buy-product",countProductsBuy)
// lấy tất cả sản phẩm dựa theo category
router.post("/category-product",getCategoryWiseProduct)
// Lấy category theo productId
router.get("/category-by-product/:productId",getCategoryByProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/search",searchProduct)
router.post("/filter-product",filterProductController)

//user add to cart
router.post("/addtocart",authToken,addProductToCart)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,getCartByUser)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)
router.delete("/deleteallproductincart",authToken,deleteAllAddToCartProductByUser)

// order
router.post("/create-order",authToken,createOrder);
router.delete("/delete-order",authToken,deleteOrder);
router.post("/cancel-order",authToken,cancelOrder)
router.get("/getlastestorder",authToken,getLastestOrder);
router.get("/getorders",authToken,getOrdersbyUser);
router.get("/countorderspaid",authToken,countOrdersPaid)
router.get("/allorders",authToken,getAllOrders);
router.post("/orderdetail",getOrderDetailById);
router.get("/orderById/:id",getOrderById)
router.post("/updateorder",authToken,updateOrder)
// router.get("/update-items-order",authToken,updateItemsOrder)
router.post("/update-quantity-product-order",authToken,updateQuantityProduct)
router.post("/add-product-to-order",authToken,addToItemsOrder)
router.post("/delete-product-order",authToken,deleteProductInOrder)
router.post("/get-order-by-phone",getOrderByPhone)
// offerq
router.post("/create-offer",createOffer)
router.get("/all-offers",getAllOffers)
router.post("/add-offer",authToken,addOfferToUser)
router.post("/add-offer-to-order",authToken,addOfferToOrder)
router.get("/get-offer-by-user",authToken,getOfferByUserId)
// router.post("/publish-offer",publishOffer)
router.post("/delete-offer",deleteOffer)
router.post("/update-offer",editOffer)
// tắt email
// router.get("/r-mail",receiveEmail)

// review
router.post("/create-review/:productId",authToken,createReview);
router.get("/count-review-by-product/:productId",countReviewByProduct);
router.get("/caculate-rating-product/:productId",caculateRatingProduct)
router.get("/get-review-by-product/:productId",getReviewByProduct)

// test payment 
router.get('/returnUrl',authToken,returnUrl);
router.post('/createPaymentUrl',authToken,createPaymentUrl)
// router.get('/create-payment-url',authToken,createPaymentUrl)

// test statistic

router.get('/caculatepermonth',authToken,caculatepermonth)

// test signin by google 
router.get('/getTotalAmount',countTotalAmount)


// router.get('/provinces',async(req,res)=>{
//     try {
//         const response = await fetch('https://vapi.vnappmob.com/api/v2/province');
//         const data = await response.json();
//         res.json(data);
//       } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch provinces' });
//       }
// })
// router.get('/districtbyprovince/:provinceId',async(req,res)=>{
//     const url = 'https://vapi.vnappmob.com/api/v2/province/district';
    
    
//     let provinceId=req.params.provinceId
//     let response=await fetch(`${url}/${provinceId}`)
//     const text = await response.json();
//     if (!text || !text.results) {
//         return res.status(500).json({ error: 'Invalid response from third-party API' });
//     }
//     let districts = [];
//     text.results.forEach((district) => {
//       const { district_id, district_name } = district;
//       let payload = { district_id, district_name };

//       districts.push(payload);
//     });
//     res.json({data:districts})
// })
// router.get('/wardbydistrict/:districtId',async (req,res) => {
//     const url = 'https://vapi.vnappmob.com/api/v2/province/ward';
//     let districtId=req.params.districtId
//     let response=await fetch(`${url}/${districtId}`)
//     const text = await response.json();
//     if (!text || !text.results) {
//         return res.status(500).json({ error: 'Invalid response from third-party API' });
//     }
//     let wards = [];
//     text.results.forEach((ward) => {
//       const { ward_id, ward_name } = ward;
//       let payload = { ward_id, ward_name };
//       // console.log(payload);
//       wards.push(payload);
//     });
//     res.json({data:wards})
// })

module.exports = router