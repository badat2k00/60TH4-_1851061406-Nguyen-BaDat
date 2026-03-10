import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import orderReducer from './orderSlice'
import productReducer from './productSlice'
import categoryReducer from './categorySlice'
export const store = configureStore({
  reducer: {
    user : userReducer,
    order:orderReducer,
    products:productReducer,
    categories:categoryReducer
  },
})