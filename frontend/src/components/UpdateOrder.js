import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SummaryApi from "../common";
import splitAddress from "../helpers/splitAddress";
import getAllProvince from "../helpers/getAllProvince";
import getDistrictByProvince from "../helpers/getDistrictByProvince";
import getWardByDistrict from "../helpers/getWardByDistrict";
import displayVNDCurrency from "../helpers/displayCurrency";
import addToItemsOrder from "../helpers/addToItemsOrder";
import { CgClose } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import discountByOffer from "../helpers/discountByOffer";
import moment from "moment";
const UpdateOrder = ({ order, onClose, onUpdated }) => {
   const currentTime= moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DDTHH:mm");
  const [disabled, setDisabled] = useState(true);
  const [offers, setOffers] = useState([]);
   const [offer, setOffer] = useState({
      code: "",
      discountValue: "",
      discountType: "",
      maxDiscountMoney: "",
      expireDate: "",
      detail:"",
      _id:""
    });
   const [usedOffer, setUsedOffer] = useState({
      code: "",
      discountValue: "",
      discountType: "",
      maxDiscountMoney: "",
      expireDate: "",
      detail:"",
      _id:""
    });
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [data, setData] = useState({
    customerName: order?.customerName,
    homeAddress: order?.shippingAddress
      ? splitAddress(order.shippingAddress)[0]
      : "",
    phoneNumber: order?.phoneNumber,
    paymentMethod: order?.paymentMethod,
    _id: order?._id,
    offerId:order?.offerId,
    detail: order?.detail,
    items: order?.items,
    totalAmount: order?.totalAmount,
  });
   
  const [province, setProvince] = useState({
    province_id: "",
    province_name: "",
  });
  const [ward, setWard] = useState({
    ward_id: "",
    ward_name: "",
  });
  const [district, setDistrict] = useState({
    district_id: "",
    district_name: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const handleChangeProvince = async (e) => {
    const newProvinceId = e.target.value;
    console.log(newProvinceId);
    const selectedProvince = provinces.find(
      (province) => province.province_id === newProvinceId
    );

    if (selectedProvince?.province_name !== null) {
      setProvince({
        province_name: selectedProvince?.province_name,
        province_id: newProvinceId,
      });
      let data = await getDistrictByProvince(newProvinceId);
      setDistricts(data);
      setDistrict({ district_id: "", district_name: "" });
      setWard({ ward_id: "", ward_name: "" });
    } else {
      alert("Bạn chưa điền Tỉnh ");
    }
  };
  const handleChangeDistrict = async (e) => {
    const newDistrictId = e.target.value;
    console.log(newDistrictId);
    const selectedDistrict = districts.find(
      (district) => district.district_id === newDistrictId
    );
    if (
      newDistrictId === "" ||
      newDistrictId === null ||
      newDistrictId === undefined
    ) {
      setWard({ ward_id: "" });
    }
    setDistrict({
      district_name: selectedDistrict?.district_name,
      district_id: selectedDistrict?.district_id,
    });
    const data = await getWardByDistrict(newDistrictId);
    // setWard({ ward_id: "", ward_name: "" });
    setWards(data);
  };
  const handleChangeWard = async (e) => {
    const newWardId = e.target.value;
    const selectedWard = wards.find((ward) => ward.ward_id === newWardId);

    if (newWardId === "" || newWardId === null || newWardId === undefined) {
      setWard({ ward_id: "" });
    }
    setWard({ ward_name: selectedWard?.ward_name, ward_id: newWardId });
    if (selectedWard) {
      setData((data) => ({
        ...data,
        shippingAddress:
          selectedWard.ward_name +
          "," +
          district.district_name +
          "," +
          province.province_name,
      }));

      console.log(data);
    }
  };
  const handleSearch = (e) => {
    const { value } = e.target;
    // setTimeout(() => {
       setSearchProduct(value);
    // }, 5000);
   
  };
  const handleAddtoItemsOrder = async (e, product) => {
    const response = await addToItemsOrder(e, product, order?._id);

    if (response.success) {
      setData((prevData) => ({ ...prevData, ...response.data }));
    }
    onUpdated(response.data);
  };


  const increaseQty = async (id) => {
    let findProduct = data.items.find((product) => product.productId.toString() === id);
    const updateProduct = {
      ...findProduct,
      quantity: findProduct.quantity + 1,
    };
    const newItems = data.items.map((product) =>
      product.productId === id ? updateProduct : product
    );
    const updateTotalAmount =
      data.totalAmount +
      (updateProduct.quantity - findProduct.quantity) *
        findProduct.sellingPrice;
    setData({ ...data, items: newItems, totalAmount: updateTotalAmount });
    onUpdated({ ...data, items: newItems, totalAmount: updateTotalAmount });
    console.log(data?.orderId)
    try {
      const response = await fetch(SummaryApi.updateQuantityProductOrder.url, {
        method: SummaryApi.updateQuantityProductOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: findProduct.quantity + 1,
          orderId: data?._id,
        }),
      });

      const responseData = await response.json();

      if (responseData?.success) {
        console.log(responseData?.data);
        setData(prevData=>({...prevData,...responseData?.data}));

        onUpdated(responseData.data);
        // setData(prevData=>({...prevData,...response.data}))
        // openModal("1")
        // onUpdated({...data, items: newItems, totalAmount: updateTotalAmount })
        toast.success(responseData?.message);
      } else {
        console.log(responseData?.message);
        setLoading(true);
        toast.error(responseData?.message)
      }
    } catch (error) {}
  };
  // const debouncedIncreaseQty = useCallback(debounce((id) => {
  //     increaseQty(id);
  //   }, 5000),[]);

  const decreaseQty = async (id) => {
    let findProduct = data.items.find((product) => product.productId === id);
    if (findProduct.quantity > 1) {
      const updateProduct = {
        ...findProduct,
        quantity: findProduct.quantity - 1,
      };
      const newItems = data.items.map((product) =>
        product.productId === id ? updateProduct : product
      );
      const updateTotalAmount =
        data.totalAmount +
        (updateProduct.quantity - findProduct.quantity) *
          findProduct.sellingPrice;
      setData({ ...data, items: newItems, totalAmount: updateTotalAmount });
      // console.log(data)
      onUpdated({...data, items: newItems, totalAmount: updateTotalAmount })
    }

    try {
      const response = await fetch(SummaryApi.updateQuantityProductOrder.url, {
        method: SummaryApi.updateQuantityProductOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: findProduct.quantity - 1,
          orderId: data?._id,
        }),
      });
      const responseData = await response.json();
      if (responseData.success) {
        // setData({...responseData.data})
        console.log(data);
        // setData({ ...responseData.data });
         setData(prevData=>({...prevData,...responseData?.data}));
        // onUpdated(responseData.data);
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const deleteProductInOrder = async (id) => {
    const filtered = data.items.filter((item) => item.productId !== id);
    const newTotalAmount = filtered.reduce(
      (acc, item) => acc + item.sellingPrice * item.quantity,
      0
    );
  // setData({ ...data, items: filtered, totalAmount: newTotalAmount });
  
    // onUpdated({ ...data, items: filtered, totalAmount: newTotalAmount });
    try {
      const response = await fetch(SummaryApi.deleteProductInOrder.url, {
        method: SummaryApi.deleteProductInOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          orderId: data?._id,
        }),
      });

      let responseData= await response.json()
      if (responseData.success) {
          // setData({ ...data, items: filtered, totalAmount: newTotalAmount });
           onUpdated({ ...data, items: filtered, totalAmount: newTotalAmount });
          setData(responseData.data);
          toast.success(responseData.message)
        //  onUpdated(response.data);
      }
      if(responseData.error){
        toast.error(responseData.message)
        // setData(data.items)
        onUpdated({...data,items:data.items,totalAmount:data.totalAmount});
      }
    } catch (error) {

    }

    // const filtered = data.items.filter((item) => item.productId !== id);
    // const updateTotalAmount = filtered.reduce(
    //   (preve, curr) => preve + curr.quantity * curr?.sellingPrice,
    //   0
    // );
    // setData({ ...data, items: filtered, totalAmount: updateTotalAmount });
  };
  const fetchAllOffers = async () => {
      const response = await fetch(SummaryApi.getAllOffers.url);
      const dataResponse = await response.json();
  
      console.log("product data", dataResponse);
      // console.log(dataResponse.data);
      let filterOffers= dataResponse.data.filter(offer=>offer._id!==data.offerId)
      // setOffers(dataResponse?.data || []);
      let findUsedOffer=dataResponse.data.find(offer=>offer._id===data.offerId)
      setUsedOffer(findUsedOffer||{})
      // console.log(usedOffer)
      setOffers(filterOffers)
      // if(data.offerId){
      //   setOffer(prevOffer=>({...prevOffer,...findUsedOffer}))
      // }
      return dataResponse.data
    };
  useEffect(() => {
    getAllProvince().then((provinces) => setProvinces(provinces));
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
        setProducts(dataResponse.data);
      }, 1000);
      
    };
    fetchProduct();
  }, [searchProduct]);
useEffect(() => {
  fetchAllOffers()
}, [])
useEffect(() => {
  if (data.offerId && usedOffer._id && offer._id !== usedOffer._id) {
    setOffer(usedOffer); // chỉ set nếu chưa trùng
  }
}, [data.offerId, usedOffer._id]);

/* 
nếu order đã có offerId => setOffer changeOffer kiểm tra có trùng với offerId không => nếu có => ko giảm giá giữ nguyên 
nếu order chưa có offerId=> setOffer , setDataTotalAmount  
nếu order 
*/
// useEffect(() => {
//   let oldTotalAmount=data.items.reduce((prev,item)=>prev+item.quantity*item.sellingPrice,0)
//  console.log(offer._id===data.offerId)

//   if (offer._id===data.offerId) {
//    const newDiscount = discountByOffer(
//       oldTotalAmount,
//       offer.discountType,
//       offer.discountValue,
//       offer.maxDiscountMoney
//     );
//     console.log("3")
//      setData(prevData => ({
//       ...prevData,
//       totalAmount: oldTotalAmount-newDiscount
//     }));
   
//   } 
//   console.log(offer._id)
//   if(data.offerId!==undefined&&offer._id!==data.offerId){
//   fetchAllOffers().then(data=>console.log(data))
//   // .then(res=>{
//     // setOffers(res)
//     // let findUsedOffer=res.find(offer=>offer._id===data.offerId)
//     // setUsedOffer(prev=>({...prev,...findUsedOffer}

//     // ))
//   // })
//     // offer đã tồn tại , totalAmount đã giảm 
//      const newDiscount = discountByOffer(
//       oldTotalAmount,
//       offer.discountType,
//       offer.discountValue,
//       offer.maxDiscountMoney
//     );
//    console.log(newDiscount)
//      setData(prevData => ({
//       ...prevData,
//       totalAmount: oldTotalAmount - newDiscount
//     }));
//   }
//   // console.log(data?.offerId)
//   // console.log(data)
//   if(data.offerId===undefined ||null){

//       const newDiscount = discountByOffer(
//       oldTotalAmount,
//       offer.discountType,
//       offer.discountValue,
//       offer.maxDiscountMoney
//     );
//     // ví dụ là 7000 nếu set offerId (có offer change Offer => data sẽ thay đổi =>tổng tiền sẽ là mới nhất )
//     // console.log(oldTotalAmount)
//     console.log("1")
//     setData(data => {
//       let a= {
//       ...data,
//       totalAmount: oldTotalAmount- newDiscount
    
//     }
//       return a
//      }
//   );
    
//   }
// }, [offer._id,offer.discountValue, offer.discountType, offer.maxDiscountMoney]);

useEffect(() => {
    if (data.offerId && usedOffer._id && offer._id !== usedOffer._id) {
      setOffer(usedOffer); // chỉ set nếu chưa trùng
    }
  }, [data.offerId, usedOffer._id]);
useEffect(() => {
  const oldTotalAmount = data.items.reduce(
    (prev, item) => prev + item.quantity * item.sellingPrice,
    0
  );

  const discount = discountByOffer(
    oldTotalAmount,
    offer.discountType,
    offer.discountValue,
    offer.maxDiscountMoney
  );

  setData(prev => ({
    ...prev,
    totalAmount: oldTotalAmount - discount,
  }));
}, [offer._id, offer.discountValue, offer.discountType, offer.maxDiscountMoney]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    //   // setIsUpdated(true)
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    updateOrder();
  };

  const updateOrder = async () => {
    // handleChange(e)
    
    try {
      const fetchResponse = await fetch(SummaryApi.updateOrder.url, {
        method: SummaryApi.updateOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ ...data,shippingAddress:data.homeAddress.concat(",",ward?.ward_name+','+district?.district_name+','+province?.province_name), orderId: order?._id,offerId:offer._id,totalAmount:data.totalAmount  }),
      });
      // console.log(data)
      console.log(offer._id)
      const responseData = await fetchResponse.json();
      console.log(responseData.data);
      if (responseData.error) {
       toast.error(responseData.message)
      }
      if (responseData.success) {
        setData(responseData.data);
        // console.log(responseData.data2);
        toast.success(responseData.message)
        console.log(responseData.message);
        if (responseData.data.paymentMethod === "VNPAY") {
         onClose()
          // setIsDisable(true)
        } else {
          // AllowCOD();
          // setIsDisable(true)
        }
      }
    } catch (err) {}
  };
  // let totalPrice;
  // totalPrice = data.items.reduce(
  //   (preve, curr) => preve + curr.quantity * curr?.sellingPrice,
  //   0
  // );
  const handleResetAddress = () => {
    setDisabled(!disabled);
  };
  const handleChangeOffer = (e) => {
  const selectedOfferId = e.target.value;
  const selectedOffer = offers.find((offer) => offer._id === selectedOfferId);

  if (selectedOffer) {
    let checkOfferExpired = moment
          .tz(selectedOffer.expireDate, "YYYY-MM-DDTHH:mm", "Asia/Ho_Chi_Minh")
          .isBefore(currentTime);
    if(!checkOfferExpired){
    setOffer((prev)=>({...prev,...selectedOffer}));
    }else{
      setOffer((prev)=>({...prev, discountValue:0}));
    }
  } else if (selectedOfferId === usedOffer._id) {
    setOffer((prev)=>({...prev,...usedOffer}));
  } else {
    setOffer((prev)=>({...prev, discountValue:0}));
  }
};

  return (
    <div className="fixed w-full h-full  bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-6xl h-full max-h-[70%]">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Sửa đơn hàng</h2>
          {/* {JSON.stringify(offer)} */}
          {/* {console.log(itemsOrder)} */}
          {/* {offers} */}
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>
        <div className="flex h-full">
          <div className="max-w-xl w-full  h-full max-h-[80%] border-r border-r-black flex flex-col">
            <h1 className="text-center">Thông tin giao hàng </h1>
            <form onSubmit={handleSubmit}>
              {/* <div className={`flex  ${isDisable===true?"flex-row ":"flex-col bg-red-200" } h-5`}> */}
              <div className={`flex  bg-red-200" } h-5`}>
                {/* <label className={`w-full ${isDisable&&"w-[100px]"} `}>Họ và Tên {isDisable&&":"} </label> */}
                <label className={`w-full  `}>Họ và Tên </label>
                <input
                  type="text"
                  name="customerName"
                  value={data.customerName}
                  onChange={handleChange}
                  // required
                  // className={`w-full px-2  ${
                  //   isDisable && "bg-transparent w-[80%]"
                  // }`}
                  className={`w-full px-2 
                 w-[80%]"
                }`}
                  // disabled={isDisable}
                />
              </div>
              <br />
              <label>Số nhà,Tên đường:</label>
              <br />
              <input
                type="text"
                name="homeAddress"
                value={data.homeAddress}
                onChange={handleChange}
                // required
                className="w-full px-2"
                // disabled={isDisable}
              />
              <br />
              <div className="flex justify-around ">
                <label htmlFor="">Tỉnh/thành</label>
                <label htmlFor="">Quận/huyện</label>
                <label htmlFor="">Xã/phường</label>
              </div>
              <div className="flex justify-between gap-2 ">
                <select
                  name=""
                  id=""
                  value={province.province_id}
                  disabled={disabled}
                  className="w-[33.33%] overflow-x-scroll"
                  onChange={handleChangeProvince}
                >
                  {/* <option value="">{splitAddress(order.shippingAddress)[3]}</option>
                      {provinces.map((province) => (
                      <option
                        key={province.province_id}
                        value={province.province_id}
                      >
                        {province.province_name}
                      </option>
                    ))} */}
                  {disabled ? (
                    <option value={""} key="">
                      {splitAddress(order.shippingAddress)[3]}
                    </option>
                  ) : (
                    <>
                      <option value="" key="">
                        Chọn Tỉnh/thành
                      </option>
                      {provinces.map((province) => (
                        <option
                          key={province.province_id}
                          value={province.province_id}
                        >
                          {province.province_name}
                        </option>
                      ))}{" "}
                    </>
                  )}
                </select>
                <select
                  name=""
                  id=""
                  className="w-[33.33%] overflow-y-scroll"
                  onChange={handleChangeDistrict}
                  disabled={disabled}
                >
                  {/* <option value="" key="">{splitAddress(order?.shippingAddress)[2]}</option>
                  {districts.map((district) => (
                      <option
                        key={district.district_id}
                        value={district.district_id}
                      >
                        {district.district_name}
                      </option>
                    ))} */}
                  {disabled ? (
                    <option value="" key="">
                      {splitAddress(order.shippingAddress)[2]}
                    </option>
                  ) : (
                    <>
                      <option value="" key="">
                        Chọn Quận/Huyện
                      </option>{" "}
                      {districts.map((district) => (
                        <option
                          key={district.district_id}
                          value={district.district_id}
                        >
                          {district.district_name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                <select
                  name=""
                  id=""
                  className="w-[33.33%] overflow-y-scroll"
                  onChange={handleChangeWard}
                  disabled={disabled}
                  value={ward.ward_id}
                >
                  {/* <option value="">{splitAddress(order?.shippingAddress)[1]}</option>
                  {wards.map((ward) => (
                      <option key={ward.ward_id} value={ward.ward_id}>
                        {ward.ward_name}
                      </option>
                    ))} */}

                  {disabled ? (
                    <option value="" key="">
                      {splitAddress(order.shippingAddress)[1]}
                    </option>
                  ) : (
                    <option value="null" key="null">
                      Chọn Xã/Phường
                    </option>
                  )}
                  {wards.map((ward) => (
                    <option key={ward.ward_id} value={ward.ward_id}>
                      {ward.ward_name}
                    </option>
                  ))}
                </select>
              </div>
              {disabled && <button onClick={handleResetAddress}>Sửa</button>}
              <br/>
              <label>Số điện thoại </label>
              <br />
              {/* {order.shippingAddress} */}
              <input
                type="text"
                name="phoneNumber"
                value={data.phoneNumber}
                onChange={handleChange}
                // required
                className="w-full px-2"
                // disabled={isDisable}
              />

              <h3>Phương thức thanh toán : {data.paymentMethod==="COD"?'Thanh toán khi nhận hàng':"VNPAY"}</h3>
              {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

              {/* <div className="controls mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={data.paymentMethod === "COD"}
                    onChange={handleChange}
                    // disabled={isDisable}
                  />

                  <span className="ml-2">Thanh toán khi nhận hàng </span>
                </label>
              </div> */}

              {/* <div className="controls mb-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPAY"
                    checked={data.paymentMethod === "VNPAY"}
                    onChange={handleChange}
                    // disabled={isDisable}
                    // className={`${isDisable?"hidden":"block"}`}
                  />
                  {/* <span className={`${isDisable?"hidden":"block"} ml-2`}>Thanh toán bằng VNPAY</span> */}
                  {/* <span className={`ml-2`}>Thanh toán bằng VNPAY</span> */}
                {/* </label> */}
              {/* </div>  */}

              <label>Ghi chú</label>
              <br />
              <textarea
                type="text"
                name="detail"
                value={data.detail}
                onChange={handleChange}
                className="w-full px-2"
              />
              <div className="flex justify-between">
                   <button>
                {" "}
                <Link to={"/user/all-orders"}>Quay lại </Link>
              </button>
              <button
                type="submit"
                // className={`${
                //   isDisable ? "bg-slate-500" : "bg-blue-500"
                // } p-2 rounded-md`}
              >
                {/* {isDisable
                  ? "Sửa thông tin đơn hàng"
                  : "Lưu thông tin giao hàng"} */}
                Cập nhật đơn hàng
              </button>
              </div>
           
            </form>
          </div>
          <div className="flex flex-col max-w-full w-full relative">
            <input
              type="text"
              placeholder="Tìm vật tư"
              className="p-2 w-full bg-slate-100"
              onChange={handleSearch}
              value={searchProduct}
            />
            {products && searchProduct && (
              <div className="absolute top-7 overflow-y-scroll h-32 bg-slate-400 z-10 w-full">
                {products.map((product) => (
                  <div className="flex" key={product?._id}>
                    <h1 className="hover:bg-black hover:text-white">
                      {product.productName}
                    </h1>
                    <button
                      onClick={(e) => handleAddtoItemsOrder(e, product?._id)}
                      className="bg-red-400 text-white"
                    >
                      Thêm vào đơn hàng
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="  w-[50%] md:w-full p-4 h-auto ">
              <div className="flex flex-col md:justify-center   lg:justify-between ">
                {/***view product */}
                <div className="w-full  md:max-w-screen-md overflow-y-scroll max-h-44">
                  {/* {isOrder &&cart.map((product, index) =>  */}
                  {data.items.length > 0 &&
                    data.items.map((product, index) => (
                      <div
                        // key={product?._id}
                        className="w-full bg-white lg:h-20  my-2 border rounded flex flex-row items-center px-2"
                      >
                        <div className="w-16 h-14 bg-slate-200">
                          <img
                            src={
                              product?.productImage?.[0] || ""
                              // ""
                            }
                            className="w-full h-full object-scale-down mix-blend-multiply bg-slate-50 "
                            alt={"product-img" || ""}
                          />
                        </div>
                        <div className="px-4 py-2  w-full flex justify-between  items-center flex-col md:flex-row">
                          {/**delete product */}

                          <div className="text-sm w-[100%] lg:w-[50%]  break-all">
                            {product?.productName}
                          </div>
                          <div className="flex items-center justify-center w-[10%]  bg-white ">
                            <span>x</span>
                          </div>
                          <div className="w-[10%] text-center bg-white flex  items-center justify-center gap-1">
                            <button
                              className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center  rounded "
                              onClick={() => {
                                decreaseQty(product?.productId);
                              }}
                            >
                              -
                            </button>
                            <span>{product?.quantity}</span>
                            <button
                              className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                              onClick={() => {
                                increaseQty(product?.productId);
                              }}
                            >
                              +
                            </button>
                          </div>
                          <p className="text-slate-600 font-semibold w-[50%] lg:w-[20%] text-sm lg:text-base text-right break-all flex  justify-center">
                            {displayVNDCurrency(product?.sellingPrice)}
                          </p>
                          <MdDelete
                            className="text-red-500 cursor-pointer"
                            onClick={() =>
                              deleteProductInOrder(product?.productId)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  {/* {isOrder===false&&cart.map((product, index) =>  */}

                  {/* )} */}
                </div>
                {/* {district.id} */}
                {/* {offer} */}
                <hr className="bg-black h-0.5 w-full" />
                {/***summary  */}

                {/* {cart.length !== 0 && ( */}
                <div className="  mt-5 lg:mt-0 w-full ">
                  <div className="">
                    {/* <h2 className="text-white bg-red-600 px-4 py-1">Summary</h2> */}

                    <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                      <p>Tạm tính</p>
                      {/* <p>{displayVNDCurrency(totalPrice)}</p> */}
                      <p>{displayVNDCurrency(data.totalAmount)}</p>
                    </div>
                  </div>
                </div>
                {/* )} */}

                <hr className="bg-black h-0.5 w-full" />
                {/* {offer.discountValue} */}
                <div className="  mt-5 lg:mt-0 w-full ">
                  <div className="">
                    <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                      <label htmlFor="promote">Ưu đãi</label>
                      <select name="offer" onChange={handleChangeOffer}>

                        {/*  */}
                      {/* <option value={1}>Chọn ưu đãi</option>

                     {data.offerId&&<option value={data?.offerId} key={data?.offerId}>{usedOffer.code}</option>}
                     {offers.map(offer=><option value={offer._id} key={offer._id} className={`${moment.tz(offer.expireDate, "YYYY-MM-DDTHH:mm", "Asia/Ho_Chi_Minh").isBefore(currentTime) && "bg-red-500"}`}>{offer.code}</option>)} */}
                        
                      
                     {data?.offerId?<><option value={data?.offerId} key={data?.offerId}>{usedOffer.code}</option>
                     
                     {offers.map(offer=><option value={offer._id} key={offer._id} className={`${moment.tz(offer.expireDate, "YYYY-MM-DDTHH:mm", "Asia/Ho_Chi_Minh").isBefore(currentTime) && "bg-red-500"}`}>{offer.code}</option>)}
                     
                     
                     <option value={1}>Chọn ưu đãi</option></>:<><option value={1}>Chọn ưu đãi</option>
                     {offers.map(offer=><option value={offer._id} key={offer._id} className={`${moment.tz(offer.expireDate, "YYYY-MM-DDTHH:mm", "Asia/Ho_Chi_Minh").isBefore(currentTime) && "bg-red-500"}`}>{offer.code}</option>)}
                     
                     </>}
                    </select>
                    </div>
                  </div>
                </div>

                <div className="  mt-5 lg:mt-0 w-full ">
                  <div className="">
                    <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                      <label htmlFor="promote">Tổng tiền</label>
                      <p>{displayVNDCurrency(data.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <input type="checkbox" name="" id="" />
            Tôi đã kiểm tra thông tin đơn hàng . */}
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
//    const handleChangeOffer=(e)=>{
//     const selectedOfferId = e.target.value;
//     console.log(selectedOfferId)
//     const selectedOffer = offers.find((offer) => offer._id === selectedOfferId); 
//     if(!selectedOffer&&selectedOfferId===offer._id){
//       // ko  nằm trong offers chỉ là offer đã sử dụng 
//     console.log("1")
//     setOffer((prev)=>({...prev,...usedOffer}))
//     }
//     if(!selectedOffer&&selectedOfferId!==usedOffer._id)
//     {
//       console.log("2")
//       setOffer((prev)=>({...prev,discountValue:0}))

//     }
//     // console.log("4")
//     if(selectedOffer&&selectedOfferId!==offer._id){
//       console.log("78")
//       setOffer((prev)=>({...prev,...selectedOffer}))
//     }
//     // setOffer((prev)=>({...prev,...selectedOffer}))
//     // if(selectedOfferId===data.offerId){
//     // const selectedOffer = offers.find((offer) => offer._id === data.offerId); 
//     //   setOffer(selectedOffer)
//     // }
// //     console.log(offer._id===data.offerId)
// //     console.log(data.offerId)
// //     console.log(offer._id)
// // if (offer?._id===data.offerId) {
// //   let oldTotalAmount=data.items.reduce((prev,item)=>prev+item.quantity*item.sellingPrice,0)
// //    const newDiscount = discountByOffer(
// //       oldTotalAmount,
// //       offer.discountType,
// //       offer.discountValue,
// //       offer.maxDiscountMoney
// //     );
    
// //     console.log(newDiscount)
// //      setData(prevData => ({
// //       ...prevData,
// //       totalAmount: oldTotalAmount - newDiscount
// //     }));
   
// //   } 
//   }
  // useEffect(()=>{
  //  if(!isUpdated) {fetchOrderDetailById()}
  // },[params])