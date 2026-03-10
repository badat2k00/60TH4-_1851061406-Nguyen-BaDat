
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from './store/userSlice';
import { LanguageProvider } from "./context/LanguageContext";
import { setAllOrders,setOrders } from './store/orderSlice';
function App() {
  const dispatch = useDispatch()
  const currentUser= useSelector(state => state?.user?.user);
  // const [userid,setUserId]=useState()
  // const ordersByUser=useSelector((state)=>state?.ordersByUser?.ordersByUser)
  const [cartProductCount,setCartProductCount] = useState(0)
  const resetCartProduct=()=>{
      setCartProductCount(0);
      
  }
  
  const fetchUserDetails = async()=>{
      const dataResponse = await fetch(SummaryApi.current_user.url,{
        method : SummaryApi.current_user.method,
        credentials : 'include'
      })
      
      const dataApi = await dataResponse.json()
      
      if(dataApi.success){
        dispatch(setUserDetails(dataApi.data))
      
      }
      return dataApi?.data
  }


  const fetchUserAddToCart = async()=>{
    const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
      method : SummaryApi.addToCartProductCount.method,
      credentials : 'include'
    })

    const dataApi = await dataResponse.json()
    
    setCartProductCount(dataApi?.data?.count)
    return dataApi.data
  }
  
  
  useEffect(()=>{
    
    /**user Details */
    fetchUserDetails()
    /**user Details cart product */
    fetchUserAddToCart()
    
  },[])

  useEffect(() => {
    // Khi người dùng thay đổi, reset giỏ hàng
    if (currentUser!=="ADMIN") {
      fetchUserAddToCart();
      // fetchOrdersByUser()

    } else {
      resetCartProduct(); // Reset giỏ hàng nếu không có người dùng
    }
  }, [currentUser]);
  return (
    <>
    <LanguageProvider>
      <Context.Provider value={{
          fetchUserDetails, // user detail fetch 
          cartProductCount, // current user add to cart product count,
          fetchUserAddToCart,
          resetCartProduct,
     
      }}>
        <ToastContainer 
          position='top-center'
        />
        <div className='flex flex-col min-h-screen'> 
      

      {(currentUser?.role==="ADMIN"||currentUser?.role==="EMPLOYEE")||<Header/>}
        <main className='flex-grow pt-12 md:pt-0'>
          <Outlet/> 
        </main>
        
        {(currentUser?.role==="ADMIN"||currentUser?.role==="EMPLOYEE")||<Footer/>}
        </div>
      </Context.Provider>
      </LanguageProvider>
    </>
  );
}

export default App;
