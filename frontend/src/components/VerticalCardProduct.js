import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayVNDCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import addToCart from "../helpers/addToCart";

import addToItemsOrder from "../helpers/addToItemsOrder";

import Context from "../context";
import { useTranslation } from "react-i18next";
import SummaryApi from "../common";

const VerticalCardProduct = ({ category, heading }) => {
  
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const { t } = useTranslation();
  const [scroll, setScroll] = useState(0);
  const [isOrder, setIsOrder] = useState(false);
    const [orderId,setOrderId]=useState("")    
  // toggleFavorite(product?_Id) => setFavorite(cũ + , productId :)
  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

 
  // const handleAddToCart = async (e, id) => {
  //   await addToCart(e, id);
  //   fetchUserAddToCart();
  // };

  const fetchData = async (category,productId) => {
    // console.log(typeof(category))
    // console.log(`${category}`);
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category,productId);
    setLoading(false);
    // console.log(categoryProduct.data);
    setData(categoryProduct?.data);
    
  };
  const fetchLastestOrder = async () => {
    const dataResponse = await fetch(SummaryApi.getLastestOrder.url, {
      method: SummaryApi.getLastestOrder.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const dataApi = await dataResponse.json();

    // console.log(dataApi.data);
    if (dataApi.success && dataApi?.data?.items) {
      setIsOrder(true);
      setOrderId(dataApi.data?._id)
    }else {
        setIsOrder(false);
      }
   
  };
  useEffect(() => {
    fetchLastestOrder();
  }, []);
  useEffect(() => {
    fetchData(category);
  }, [category]);
  const handleAdd = async (e, id) => {
    console.log(isOrder)
    if (isOrder===true) {
      await addToItemsOrder(e, id,orderId);
      await fetchLastestOrder();
      await addToCart(e, id,false);
      fetchUserAddToCart();
    } else {
      await addToCart(e, id,true);
      fetchUserAddToCart();
    }
  };

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };

  return (
    <div className="flex flex-col container mx-auto px-4 my-6 relative gap-3 ">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>
      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        
        <button
          className="bg-white shadow-md rounded-full p-1 absolute left-0 text-lg  md:block"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-white shadow-md rounded-full p-1 absolute right-0 text-lg  md:block"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>
      
        {loading
          ? loadingList.map((product, index) => {
              return (
                <div className="w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow ">
                  <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse"></div>
                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200"></h2>
                    <p className="capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2"></p>
                    <div className="flex gap-3">
                      <p className="text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2"></p>
                      <p className="text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2"></p>
                    </div>
                    <button className="text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse"></button>
                  </div>
                </div>
              );
            })
          : data.map((product, index) => {
              return (
                <div className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow relative">
                  <div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center relative">
                   

                    {/* (e) => { 
                            e.stopPropagation();
                            toggleFavorite(product?._id)
                        } */}
                    <Link
                      to={"product/" + product?._id}
                      className="w-full h-full absolute top-0 left-0 z-10"
                    ></Link>
                    <img
                      src={product?.productImage[0]}
                      className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
                      alt="img "
                    />
                  </div>
                  <div className="p-4 grid gap-3">
                    <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-slate-500">
                      {t(product?.category)}
                    </p>
                    <div className="flex gap-3">
                      {/* {console.log(JSON.stringify(typeof(category)))} */}
                      <p className="text-red-600 font-medium">
                        {displayVNDCurrency(product?.sellingPrice)}
                      </p>
                    
                    
                    </div>
                    <button
                      className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
                      onClick={(e) => handleAdd(e, product?._id)}
                    >
                      {isOrder?"Thêm vào đơn hàng":"Thêm vào giỏ hàng"}
                    </button>
                   
                  </div>
                </div>
              );
            })}
      </div>
      <div className="text-center">
        <Link to={"/product-category?category=" + category}>
          <button className="bg-red-800 h-[50px] w-[100px]">Xem tất cả</button>
        </Link>
      </div>
    </div>
  );
};

export default VerticalCardProduct;

{
  /* <Link
to={"product/" + product?._id}
className="w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow relative"
>
<div className="bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center relative">
  <MdOutlineFavorite
    className="absolute top-2 right-3 z-50 text-rose-500 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      console.log(favorite);
    }}
  />
  <img
    src={product.productImage[0]}
    className="object-scale-down h-full hover:scale-110 transition-all mix-blend-multiply"
  />
</div>
<div className="p-4 grid gap-3">
  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
    {product?.productName}
  </h2>
  <p className="capitalize text-slate-500">
    {t(product?.category)}
  </p>
  <div className="flex gap-3">
    <p className="text-red-600 font-medium">
      {displayVNDCurrency(product?.sellingPrice)}
    </p>
    <p className="text-slate-500 line-through">
      {displayVNDCurrency(product?.price)}
    </p>
  </div>
  <button
    className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
    onClick={(e) => handleAddToCart(e, product?._id)}
  >
    {t("addtocart")}
  </button>
</div>
</Link> */
}
