const backendDomain = process.env.REACT_APP_BACKEND_URL

const SummaryApi = {
  signUP: {
    url: `${backendDomain}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomain}/api/user-details`,
    method: "get",
  },
  searchUser:{
    url: `${backendDomain}/api/search-user`,
    method: "post",
  },
  logout_user: {
    url: `${backendDomain}/api/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomain}/api/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomain}/api/update-user`,
    method: "post",
  },
  changeRole: {
    url: `${backendDomain}/api/change-role`,
    method: "post",
  },
  sendPassword: {
    url: `${backendDomain}/api/send-password`,
    method: "post",
  },

  // category
  getAllCategory: {
    url: `${backendDomain}/api/all-category`,
    method: "get",
  },
  deleteCategory: {
    url: `${backendDomain}/api/delete-category`,
    method: "post",
  },
  createCategory: {
    url: `${backendDomain}/api/create-category`,
    method: "post",
  },
  // product
  uploadProduct: {
    url: `${backendDomain}/api/upload-product`,
    method: "post",
  },
  deleteOneProduct: {
    url: `${backendDomain}/api/delete-one-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomain}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomain}/api/update-product`,
    method: "post",
  },
  getAllFavorite: {
    url: `${backendDomain}/api/getfavoriteproduct`,
    method: "get",
  },
  addToFavorite: {
    url: `${backendDomain}/api/addtofavorite`,
    method: "post",
  },
  deleteFavoriteProduct: {
    url: `${backendDomain}/api/deletefavoriteproduct`,
    method: "post",
  },
  getCategoryByProduct: {
    url: `${backendDomain}/api/category-by-product`,
    method: "get",
  },
  updateCategory: {
    url: `${backendDomain}/api/update-category`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomain}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomain}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomain}/api/product-details`,
    method: "post",
  },
  addToCartProduct: {
    url: `${backendDomain}/api/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomain}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomain}/api/view-card-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomain}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomain}/api/delete-cart-product`,
    method: "post",
  },
  deleteAllProductInCart: {
    url: `${backendDomain}/api/deleteallproductincart`,
    method: "delete",
  },
  searchProductByType: {
    url: `${backendDomain}/api/search`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomain}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomain}/api/filter-product`,
    method: "post",
  },
  //order
  createOrder: {
    url: `${backendDomain}/api/create-order`,
    method: "post",
  },
  deleteOrder: {
    url: `${backendDomain}/api/delete-order`,
    method: `delete`,
  },
  cancelOrder: {
    url: `${backendDomain}/api/cancel-order`,
    method: "post",
  },
  updateOrder: {
    url: `${backendDomain}/api/updateorder`,
    method: "post",
  },
  countOrdersPaid: {
    url: `${backendDomain}/api/countOrdersPaid`,
    method: "get",
  },
  addToItemsOrder: {
    url: `${backendDomain}/api/add-product-to-order`,
    method: "post",
  },
  updateQuantityProductOrder: {
    url: `${backendDomain}/api/update-quantity-product-order`,
    method: "post",
  },
  getOrderById: {
    url: `${backendDomain}/api/orderbyid`,
    method: "get",
  },
  getOrderDetailById: {
    url: `${backendDomain}/api/orderdetail`,
    method: "post",
  },
  getLastestOrder: {
    url: `${backendDomain}/api/getlastestorder`,
    method: "get",
  },
  getOrdersbyUser: {
    url: `${backendDomain}/api/getorders`,
    method: "get",
  },
  getOrderByPhone: {
    url: `${backendDomain}/api/get-order-by-phone`,
    method: "post",
  },
  getAllOrders: {
    url: `${backendDomain}/api/allorders`,
    method: "get",
  },
  deleteProductInOrder: {
    url: `${backendDomain}/api/delete-product-order`,
    method: "post",
  },
  createPaymentUrl: {
    url: `${backendDomain}/api/createPaymentUrl`,
    method: "post",
  },
  countUsers: {
    url: `${backendDomain}/api/countusers`,
    method: "get",
  },
  returnUrl: {
    url: `${backendDomain}/api/returnUrl`,
    method: "GET",
  },
  createReview: {
    url: `${backendDomain}/api/create-review`,
    method: "POST",
  },
  getReviewByProduct: {
    url: `${backendDomain}/api/get-review-by-product`,
    method: "GET",
  },
  // offer
  getAllOffers: {
    url: `${backendDomain}/api/all-offers`,
    method: "GET",
  },
  getOfferByUser: {
    url: `${backendDomain}/api/get-offer-by-user`,
    method: "GET",
  },
  addOfferToUser: {
    url: `${backendDomain}/api/add-offer`,
    method: "POST",
  },
  updateOffer: {
    url: `${backendDomain}/api/update-offer`,
    method: "POST",
  },
  createOffer: {
    url: `${backendDomain}/api/create-offer`,
    method: "POST",
  },
  deleteOffer: {
    url: `${backendDomain}/api/delete-offer`,
    method: "POST",
  },
  sendOrderDetail: {
    url: `${backendDomain}/api/send-order-detail`,
    method: "POST",
  },
  countProductsBuy: {
    url: `${backendDomain}/api/count-buy-product`,
    method: "get",
  },
  getTotalAmount: {
    url: `${backendDomain}/api/getTotalAmount`,
    method: "get",
  },
  changePassword: {
    url: `${backendDomain}/api/change-password`,
    method: "post",
  },
};

export default SummaryApi;
