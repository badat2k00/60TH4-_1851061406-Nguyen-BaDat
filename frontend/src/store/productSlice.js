import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    products : []
}
  
  export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {                       
      getAllProducts : (state,action)=>{
        state.products = action.payload
      },
      addNewProduct: (state,action)=>{
        const productData=action.payload
        const findProduct=state.products.some(product=>product.productName===productData.productName)
        if (!findProduct) {
        state.products.push(productData);
        }
        // return state.products
      },
      deleteProduct:(state,action)=>{
        const productId=action.payload
        state.products=state.products.filter(product=>product._id!==productId)
      },  
      editProduct:(state,action)=>{
        const {_id,productData}=action.payload
        state.products=state.products.map(product=>product._id===_id?{...productData,isActive:true}:product);
      },
      updateQuantityProduct:(state,action)=>{
        const {_id,quantity}=action.payload
        state.products=state.products.map(product =>
          product._id === _id
              ? { ...product, quantity: quantity }
              : product
      );
      }
    },
  })

  export const { getAllProducts,addNewProduct,deleteProduct,editProduct } = productSlice.actions
  
  export default productSlice.reducer

