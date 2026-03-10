import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../store/productSlice";
import PaginatedItems from "../components/PaginatedItems";
const AllProducts = () => {
  const [searchProduct,setSearchProduct]=useState("");
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const dispatch = useDispatch();
  // const products = useSelector((state) => state.products.products);
  const [allProduct,setAllProduct] = useState([])

  const { t } = useTranslation();
  const [currentItems, setCurrentItems] = useState(0);
  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();

    if (dataResponse?.data) {
      dispatch(getAllProducts(dataResponse?.data));
      setAllProduct(dataResponse?.data)
    }
    // setAllProduct(dataResponse?.data || [])
  };
  const handleSearch = (e) => {
    const { value } = e.target;
    // setTimeout(() => {
       setSearchProduct(value);
    // }, 5000);
   
  };
   const fetchProduct = async () => {
      const response = await fetch(SummaryApi.searchProductByType.url, {
        method: SummaryApi.searchProductByType.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ query: searchProduct }),
      });
      const dataResponse = await response.json();
      // setLoading(false)
      setTimeout(() => {
        setAllProduct(dataResponse.data);
      }, 1000);
    }
  useEffect(() => {
    if(searchProduct!==""){
      fetchProduct()
    }else{
    fetchAllProduct();
    }
    // console.log(products);
  }, [searchProduct]);

  return (
    <div className="w-full min-h-screen  pb-3 flex flex-col ">
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">{t("AllProduct")}</h2>
        <input
              type="text"
              placeholder="Tìm vật tư"
              className="p-2  bg-slate-100"
              onChange={handleSearch}
              value={searchProduct}
            />
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
          onClick={() => setOpenUploadProduct(true)}
        >
          {t("UploadProduct")}
        </button>
      </div>

      {/**all product */}
      <div className="flex justify-start flex-wrap gap-5 p-4 w-full h-full">
        {
          // allProduct.map((product,index)=>{
          //   return(
          //     <AdminProductCard data={product} key={index+"allProduct"} fetchdata={fetchAllProduct}/>

          //   )
          // })
          
          currentItems.length>0? currentItems.map((product, index) => {
            return (
              <AdminProductCard data={product} key={index + "allProduct"} fetchdata={fetchAllProduct}/>
            );
          }):"Không có vật tư cần tìm"
        }
        
        
      </div>
        <PaginatedItems 
          itemsPerPage={10}
          setCurrentItems={setCurrentItems}
          items={allProduct}
        />
      {/**upload product component */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
