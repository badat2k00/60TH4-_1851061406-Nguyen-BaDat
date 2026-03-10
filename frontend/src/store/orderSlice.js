import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    ordersByUser : null,
    AllOrders:null
}
  
  export const orderSlice = createSlice({
    name: 'ordersByUser',
    initialState,
    reducers: {
      setOrders : (state,action)=>{
        state.ordersByUser = action.payload
      },
      setAllOrders:(state,action)=>{
        state.AllOrders=action.payload
      },
      updateOrderById:(state,action)=>{
        
      }
    },
  })

  export const { setOrders,setAllOrders } = orderSlice.actions
  
  export default orderSlice.reducer