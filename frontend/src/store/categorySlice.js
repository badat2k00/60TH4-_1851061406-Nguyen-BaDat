import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    categories : []
}
  
  export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {                       
      setAllCategories : (state,action)=>{
        state.categories = action.payload
      },

      deleteCategory:(state,action)=>{
        const categoryId=action.payload
        state.categories=state.categories.filter(category=>category._id!==categoryId)
      },  
      updateCategory: (state,action)=>{
        const {_id,categoryName}=action.payload
        state.categories=state.categories.filter(category=>category._id===_id?category.categoryName=categoryName:category);
      }
    },
  })
  export const { setAllCategories,deleteCategory,updateCategory} = categorySlice.actions
  
  export default categorySlice.reducer

