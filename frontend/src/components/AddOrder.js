import React, { useEffect, useState } from "react";
import { CgClose, CgSearch } from "react-icons/cg";
import getAllProvince from "../helpers/getAllProvince";
import getDistrictByProvince from "../helpers/getDistrictByProvince";
import getWardByDistrict from "../helpers/getWardByDistrict";
import SummaryApi from "../common";
import Modal from "../components/Modal";
import { MdDelete } from "react-icons/md";
import displayVNDCurrency from "../helpers/displayCurrency";
import { toast } from "react-toastify";
import discountByOffer from "../helpers/discountByOffer";
import moment from "moment";
const AddOrder = ({ onClose, handleAddToOrders, fetchAllOrder }) => {
  const currentTime = moment()
    .tz("Asia/Ho_Chi_Minh")
    .format("YYYY-MM-DDTHH:mm");
  const [orderId, setOrderId] = useState("");
  const [data, setData] = useState({
    customerName: "",
    shippingAddress: "",
    phoneNumber: "",
    paymentMethod: "",
    orderId: "",
    detail: "",
    totalAmount: 0,
  });
  const [offer, setOffer] = useState({
    code: "",
    discountValue: "",
    discountType: "",
    maxDiscountMoney: "",
    expireDate: "",
    detail: "",
  });
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState({
    customerName: "",
    homeAddress: "",
    phoneNumber: "",
    paymentMethod: "",
    itemsOrder: "",
    province_name: "",
    district_name: "",
    ward_name: "",
  });
  const [homeAddress, setHomeAddress] = useState("");
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
  const [searchProduct, setSearchProduct] = useState("");
  const [product, setProduct] = useState({
    _id: "",
    productName: "",
    productImage: "",
    sellingPrice: 0,
    quantity: 0,
  });
  const [wards, setWards] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectProduct, setSelectProduct] = useState(null);
  const [itemsOrder, setItemsOrder] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "homeAddress") {
      setHomeAddress(value);
      // if(error.homeAddress!==""){
      // setError(error=>({...error,homeAddress:""}))
      // }else{
      //   setTimeout(() => {
      //     setError(error=>({...error,homeAddress:" "}))
      //   }, 3000);
      // }
    }
    // if(name==="paymentAddress") {
    //    setData((prevData) => ({
    //     ...prevData,
    //     ["pa"]: value,
    //   }));
    // }
    else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleChangeProvince = async (e) => {
    const newProvinceId = e.target.value;
    // console.log(newProvinceId);
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
    // console.log(newDistrictId);h
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
        shippingAddress: homeAddress.concat(
          ",",
          selectedWard.ward_name +
            "," +
            district.district_name +
            "," +
            province.province_name
        ),
      }));
      // console.log(data);
    }
  };
  const handleSearch = (e) => {
    const { value } = e.target;

    setSearchProduct(value);
  };
  useEffect(() => {
    if (itemsOrder.length > 0 && error.itemsOrder) {
      setError((prev) => ({ ...prev, itemsOrder: "" }));
    }
    if (data.customerName && error.customerName) {
      setError((prev) => ({ ...prev, customerName: "" }));
    }
    if (data.phoneNumber && error.phoneNumber) {
      setError((error) => ({ ...error, phoneNumber: "" }));
    }
    if (homeAddress && error.homeAddress) {
      setError((error) => ({ ...error, homeAddress: "" }));
    }
    if (data.paymentMethod && error.paymentMethod) {
      setError((error) => ({ ...error, paymentMethod: "" }));
    }
  }, [
    itemsOrder,
    data.customerName,
    homeAddress,
    data.paymentMethod,
    data.phoneNumber,
  ]);
  const handleAddtoItemsOrder = (product) => {
    setSelectProduct(product);
    const checkProductExist = itemsOrder.some((p) => p._id === product._id);
    if (!checkProductExist) {
      let newProduct = { ...product, quantity: 1 };
      let newTotalAmount = 0;
      newTotalAmount +=
        data.totalAmount + newProduct.quantity * newProduct.sellingPrice;
      let newItems = [newProduct, ...itemsOrder];
      setItemsOrder(newItems);
      setData({ ...data, items: newItems, totalAmount: newTotalAmount });
      if (offer.discountValue) {
        const newDiscount = discountByOffer(
          newTotalAmount,
          offer.discountType,
          offer.discountValue,
          offer.maxDiscountMoney
        );
        // console.log(newDiscount)
        // console.log(newTotalAmount)
        setData((prevData) => ({
          ...prevData,
          totalAmount: newTotalAmount - newDiscount,
          items: newItems,
        }));
        // if(error.itemsOrder!=="" &&newItems.length>0){
        // setError((error)=>({...error,itemsOrder:""}))
        // }
      }
    } else {
      // let filterProduct=itemsOrder.filter(item=>item._id!==product._id)
      toast.error("Vật tư đã thêm vào danh sách chờ ");
      // return setItemsOrder(filterProduct);
    }
  };

  useEffect(() => {
    if (offer.discountValue) {
      const newDiscount = discountByOffer(
        data.totalAmount,
        offer.discountType,
        offer.discountValue,
        offer.maxDiscountMoney
      );
      setData((prevData) => ({
        ...prevData,
        totalAmount: prevData.totalAmount - newDiscount,
      }));
    } else {
      setData(data);
    }
  }, [offer.discountValue, offer.discountType, offer.maxDiscountMoney]);

  //  if(!offer?.code){
  //   newTotalAmount=newTotalAmount-0;
  // }
  const increaseQty = (id) => {
    let findProduct = itemsOrder.find((product) => product._id === id);
    const updateProduct = {
      ...findProduct,
      quantity: findProduct.quantity + 1,
    };
    const newItems = itemsOrder.map((product) =>
      product._id === id ? updateProduct : product
    );

    let newTotalAmount = newItems.reduce(
      (preve, curr) => preve + curr.quantity * curr?.sellingPrice,
      0
    );
    // console.log(newTotalAmount)
    setData((prevData) => ({
      ...prevData,
      items: newItems,
      totalAmount: newTotalAmount,
    }));
    console.log(data);
    setItemsOrder(newItems);

    if (offer.discountValue) {
      const newDiscount = discountByOffer(
        newTotalAmount,
        offer.discountType,
        offer.discountValue,
        offer.maxDiscountMoney
      );
      console.log(newDiscount);
      // console.log(newTotalAmount)
      setData((prevData) => ({
        ...prevData,
        totalAmount: newTotalAmount - newDiscount,
        items: newItems,
      }));
    }

    // useEffect(()=>{
    //   if(data.customerName!==""&&error.customerName){
    //     setError((error)=>({...error,customerName:""}))
    //   }
    // },[data.customerName,
    //   data.shippingAddress,
    //   data.phoneNumber,
    //   data.paymentMethod,
    //   itemsOrder,homeAddress
    // ])
  };
  const decreaseQty = (id) => {
    let findProduct = itemsOrder.find((product) => product._id === id);
    if (findProduct.quantity > 1) {
      const updateProduct = {
        ...findProduct,
        quantity: findProduct.quantity - 1,
      };
      const newItems = itemsOrder.map((product) =>
        product._id === id ? updateProduct : product
      );
      setItemsOrder(newItems);
      let newTotalAmount = newItems.reduce(
        (preve, curr) => preve + curr.quantity * curr?.sellingPrice,
        0
      );
      if (offer.discountValue) {
        const newDiscount = discountByOffer(
          newTotalAmount,
          offer.discountType,
          offer.discountValue,
          offer.maxDiscountMoney
        );
        // console.log(newTotalAmount)
        setData((prevData) => ({
          ...prevData,
          totalAmount: newTotalAmount - newDiscount,
          items: newItems,
        }));
      }
      // setData({...data,items:newItems,totalAmount:newTotalAmount})
      // console.log(itemsOrder)
    }
  };
  const deleteProduct = (id) => {
    const filtered = itemsOrder.filter((item) => item._id !== id);
    let newTotalAmount = filtered.reduce(
      (preve, curr) => preve + curr.quantity * curr?.sellingPrice,
      0
    );
    setItemsOrder(filtered);
    setData((prevData) => ({
      ...prevData,
      totalAmount: newTotalAmount,
      items: filtered,
    }));
  };
  // let totalAmount;
  // totalAmount = itemsOrder.reduce(
  //   (preve, curr) => preve + curr.quantity * curr?.sellingPrice,
  //   0
  // );
  const handleChangeOffer = (e) => {
    const selectedOfferCode = e.target.value;
    const selectedOffer = offers.find(
      (offer) => offer.code === selectedOfferCode
    );
    if (!selectedOffer) {
      setOffer((prev) => ({ ...prev, discountValue: 0 }));
    }
    setOffer((prev) => ({ ...prev, ...selectedOffer }));
  };
  async function createPaymentUrl() {
    const a = await fetch(SummaryApi.createPaymentUrl.url, {
      method: SummaryApi.createPaymentUrl.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ orderId: orderId }),
    });
    const responseData = await a.json();
    // console.log(responseData);
    if (responseData.success) {
      window.location.href = responseData.env;
    }
    if (responseData.error) {
      // console.log("false");
    }
  }
  const createOrder = async () => {
    // console.log(data)

    try {
      const fetchResponse = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          shippingAddress: homeAddress.concat(
            ",",
            ward?.ward_name +
              "," +
              district?.district_name +
              "," +
              province?.province_name
          ),
        }),
      });
      const responseData = await fetchResponse.json();

      // console.log(responseData.message)
      if (responseData.success) {
        if (data.paymentMethod === "VNPAY") {
          setOrderId(responseData.data._id);
          createPaymentUrl();
        } else {
          toast.success(responseData.message);
          handleAddToOrders(responseData.data);
          fetchAllOrder();

          // onClose();
        }

        // console.log("đã tạo rồi")
        // await fetchLastestOrder().then(data=>window.location.href=`/payment/${data._id}`)
      } else {
        toast.error(responseData.message);
      }
    } catch (err) {}
  };
  const checkData = () => {  
    let hasError = false;
    if (itemsOrder.length == 0) {
      setError((error) => ({
        ...error,
        itemsOrder: "Đơn hàng phải có ít nhất 1 vật tư",
      }));
      hasError = true;
    }
    if (data.customerName === "") {
      let errorName = "Tên người nhận không được để trống";
      setError((error) => ({ ...error, customerName: errorName  }));
      hasError = true;
    }
    if(data.customerName)
    if (
      province.province_name == "" ||
      district.district_name === "" ||
      ward.ward_name === ""
    ) {
      toast.error("Bạn phải chọn đẩy đủ tỉnh/thành-quận/huyện-xã/phường");
      hasError = true;
    }
    if (data.phoneNumber === "") {
      setError((error) => ({
        ...error,
        phoneNumber: "Số điện thoại không được để trống",
      }));
      hasError = true;
    }
    if (homeAddress === "") {
      setError((error) => ({
        ...error,
        homeAddress: "Địa chỉ  không được để trống ",
      }));
      hasError = true;
    }
    if (data.paymentMethod === "") {
      setError((error) => ({
        ...error,
        paymentMethod: "Bạn phải chọn phương thức thanh toán",
      }));
      hasError = true;
    }
    return hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = checkData();
    if (!hasError) {
      createOrder();
      onClose();
    }
    console.log(error);
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
      // console.log(dataResponse.data);
      setProducts(dataResponse.data);
    };
    fetchProduct();
    const fetchAllOffers = async () => {
      const response = await fetch(SummaryApi.getAllOffers.url, {
        method: SummaryApi.getAllOffers.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const dataResponse = await response.json();

      // console.log("product data", dataResponse);
      // console.log(dataResponse.data);
      setOffers(dataResponse?.data || []);
    };
    fetchAllOffers();
  }, [searchProduct]);
  return (
    <div className="fixed w-full h-full  bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-full max-w-6xl h-full max-h-full">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Tạo đơn hàng</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>
        <div className="flex h-full">
          <div className="max-w-xl w-full  h-full max-h-[80%] border-r border-r-black flex flex-col">
            <div className="flex flex-col w-[50%] md:w-full h-auto  gap-3">
              <h1 className="text-center">Thông tin giao hàng </h1>
              <form onSubmit={handleSubmit}>
                {/* <div className={`flex  ${isDisable===true?"flex-row ":"flex-col bg-red-200" } h-5`}> */}
                <div>
                  {/* <label className={`w-full ${isDisable&&"w-[100px]"} `}>Họ và Tên {isDisable&&":"} </label> */}
                  <label className={`w-full  `}>Họ và Tên </label>
                  {error.customerName ? (
                    <p className="text-red-400">{error.customerName}</p>
                  ) : (
                    ""
                  )}
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

                <label>Số nhà,Tên đường:</label>
                {error.homeAddress ? (
                  <p className="text-red-400">{error.homeAddress}</p>
                ) : (
                  ""
                )}

                <input
                  type="text"
                  name="homeAddress"
                  value={homeAddress}
                  onChange={handleChange}
                  // required
                  className="w-full px-2"
                  // disabled={isDisable}
                />

                <br />
                {/* {code} */}
                <div className="flex justify-around ">
                  <label htmlFor="">Tỉnh/thành</label>
                  <label htmlFor="">Quận/huyện</label>
                  <label htmlFor="">Xã/phường</label>
                </div>
                <div className="flex justify-between gap-2 ">
                  <select
                    name="full_name"
                    value={province.province_id}
                    className="w-[33.33%] overflow-x-scroll"
                    onChange={handleChangeProvince}
                  >
                    {/* {isOrder?<option value="" key="">{splitAddress(data.shippingAddress)[3]}</option>:<option value="" key="">Chọn Tỉnh/thành</option>} */}

                    <option value="">Chọn tỉnh thành</option>
                    {/* {JSON.stringify(provinces)} */}
                    {provinces.map((province) => (
                      <option
                        key={province.province_id}
                        value={province.province_id}
                      >
                        {province.province_name}
                      </option>
                    ))}
                  </select>

                  <select
                    name=""
                    className="w-[33.33%] overflow-y-scroll"
                    onChange={handleChangeDistrict}
                  >
                    {/* {isOrder?<option value="" key="">{splitAddress(data.shippingAddress)[2]}</option>:<option value="null" key="null">Chọn Quận/Huyện</option>} */}
                    <option value="">Chọn quận huyện</option>
                    {districts.map((district) => (
                      <option
                        key={district.district_id}
                        value={district.district_id}
                      >
                        {district.district_name}
                      </option>
                    ))}
                  </select>

                  <select
                    name=""
                    className="w-[33.33%]"
                    onChange={handleChangeWard}
                    value={ward.ward_id}
                  >
                    {/*  {isOrder?<option value="" key="">{splitAddress(data.shippingAddress)[1]}</option>:<option value="null" key="null">Chọn Xã/Phường</option>} */}
                    <option value="" key="">
                      Chọn xã phường
                    </option>
                    {wards.map((ward) => (
                      <option key={ward.ward_id} value={ward.ward_id}>
                        {ward.ward_name}
                      </option>
                    ))}
                  </select>
                </div>
                <label>Số điện thoại </label>
                {error.phoneNumber ? (
                  <p className="text-red-400">{error.phoneNumber}</p>
                ) : (
                  ""
                )}
                <input
                  type="text"
                  name="phoneNumber"
                  value={data.phoneNumber}
                  onChange={handleChange}
                  // required
                  className="w-full px-2"
                  // disabled={isDisable}
                />

                <h3>Phương thức thanh toán </h3>
                {/* {error && <p style={{ color: "red" }}>{error}</p>} */}

                <div className="controls mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={data.paymentMethod === "COD"}
                      onChange={handleChange}
                      // disabled={isDisable}
                      // required
                    />

                    <span className="ml-2">Thanh toán khi nhận hàng </span>
                  </label>
                </div>
                {/* {data.shippingAddress} */}
                <div className="controls mb-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={data.paymentMethod === "VNPAY"}
                      // required
                      onChange={handleChange}
                      // disabled={isDisable}
                      // className={`${isDisable?"hidden":"block"}`}
                    />
                    {/* <span className={`${isDisable?"hidden":"block"} ml-2`}>Thanh toán bằng VNPAY</span> */}
                    <span className={`ml-2`}>Thanh toán bằng VNPAY</span>
                  </label>
                </div>
                {error.paymentMethod && (
                  <p className="text-red-400">{error.paymentMethod}</p>
                )}
                <label>Ghi chú</label>
                <br />
                {/* {data.shippingAddress} */}
                <textarea
                  type="text"
                  name="detail"
                  value={data.detail}
                  onChange={handleChange}
                  className="w-full px-2"
                />
                <button type="submit">Đặt Hàng</button>
              </form>
            </div>
          </div>
          {/* <Modal/> */}
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
                      onClick={() => handleAddtoItemsOrder(product)}
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
                  {itemsOrder.length > 0 &&
                    itemsOrder.map((product, index) => (
                      <div
                        // key={product?._id}
                        className="w-full bg-white lg:h-20  my-2 border rounded flex flex-row items-center px-2"
                      >
                        <div className="w-16 h-14 bg-slate-200">
                          <img
                            src={
                              product?.productImage[0]
                              // ""
                            }
                            className="w-full h-full object-scale-down mix-blend-multiply bg-slate-50 "
                            alt={"product-img" || 0}
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
                                decreaseQty(product?._id);
                              }}
                            >
                              -
                            </button>
                            <span>{product?.quantity}</span>
                            <button
                              className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                              onClick={() => {
                                increaseQty(product?._id);
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
                            onClick={() => deleteProduct(product?._id)}
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
                    {error.itemsOrder && (
                      <p className="text-red-400">{error.itemsOrder}</p>
                    )}
                    <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                      <p>Tạm tính</p>
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
                        <option value={1}>Chọn ưu đãi</option>
                        {offers.map((offer) => (
                          <option
                            value={offer.code}
                            key={offer.code}
                            className={`${
                              moment
                                .tz(
                                  offer.expireDate,
                                  "YYYY-MM-DDTHH:mm",
                                  "Asia/Ho_Chi_Minh"
                                )
                                .isBefore(currentTime) && "bg-red-500"
                            }`}
                          >
                            {offer.code}
                          </option>
                        ))}
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

export default AddOrder;
