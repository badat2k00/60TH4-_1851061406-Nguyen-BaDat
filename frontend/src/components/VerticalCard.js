import React, { useContext, useState,useEffect } from 'react'
import scrollTop from '../helpers/scrollTop'
import displayVNDCurrency from '../helpers/displayCurrency'
import Context from '../context'
import addToCart from '../helpers/addToCart'
import addToItemsOrder from '../helpers/addToItemsOrder'
import { Link } from 'react-router-dom'

import SummaryApi from '../common'
const VerticalCard = ({loading,data = []}) => {
    const loadingList = new Array(13).fill(null)
    const { fetchUserAddToCart } = useContext(Context)
    const [isOrder,setIsOrder]=useState(false)
    const [orderId,setOrderId]=useState("")    
    
    // const handleAddProductToOrder=async(e,id)=>{
    //     await addToItemsOrder
    // }
    const fetchLastestOrder = async () => {
      const dataResponse = await fetch(SummaryApi.getLastestOrder.url, {
        method: SummaryApi.getLastestOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const dataApi = await dataResponse.json();
      
      // Debugging: Log để xem dữ liệu trả về từ API
      console.log(dataApi);
    
      if (dataApi.success && dataApi.data && dataApi.data.items) {
        setIsOrder(true);
        setOrderId(dataApi.data?._id)
      } else {
        setIsOrder(false);
      }
      console.log(isOrder)
    };
    
      useEffect(()=>{
       
        fetchLastestOrder()
      },[isOrder])
    // const handleAddToCart = async(e,id)=>{
    //    await addToCart(e,id)
    //    fetchUserAddToCart()
    // }
    const handleAdd=async(e,id)=>{
      console.log(isOrder)
    if(isOrder===true){
        await addToItemsOrder(e,id,orderId)
        await fetchLastestOrder()
        // await addToCart(e,id,false)
        fetchUserAddToCart()
    }else{
       await addToCart(e,id,true)
       fetchUserAddToCart()
      }
    }
    
  return (
    <div className='flex flex-wrap md:justify-start gap-4  p-2'>
    {
         loading ? (
             loadingList.map((product,index)=>{
                 return(
                     <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow '>
                         <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                         </div>
                         <div className='p-4 grid gap-3'>
                             <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'>""</h2>
                             <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
                             <div className='flex gap-3'>
                                 <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                                 <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                             </div>
                             <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse'></button>
                         </div>
                     </div>
                 )
             })
         ) : (
             data.map((product,index)=>{
                 return(
                     <Link to={"/product/"+product?._id} className=' min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px]  bg-white rounded-sm shadow ' onClick={scrollTop}>
                         <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[300px] flex justify-center items-center'>
                             <img src={product?.productImage[0]} className='object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply' alt=''/>
                         </div>
                         <div className='p-4 grid gap-3'>
                             <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black'>{product?.productName}</h2>
                             {/* <p className=' text-slate-500'>{t(product?.category)}</p> */}
                             <div className='flex gap-3'>
                                 <p className='text-red-600 font-medium'>{ displayVNDCurrency(product?.sellingPrice) }</p>
                             </div>
                             <button className='text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full' onClick={(e)=>handleAdd(e,product?._id)}>{isOrder?"Thêm vào đơn hàng":"Thêm vào giỏ hàng"}</button>

                         </div>
                     </Link>
                 )
             })
         )
         
     }
    </div>
  )
}

export default VerticalCard