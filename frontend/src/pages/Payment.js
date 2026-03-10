import React, { useContext, useState, useEffect } from "react";
import Context from "../context";
import SummaryApi from "../common";
import { Link, useNavigate } from "react-router-dom";
import displayVNDCurrency from "../helpers/displayCurrency";
import Modal from "../components/Modal";
import getAllProvince from "../helpers/getAllProvince";
import getDistrictByProvince from "../helpers/getDistrictByProvince";
import getWardByDistrict from "../helpers/getWardByDistrict";
import discountByOffer from "../helpers/discountByOffer";
import splitAddress from "../helpers/splitAddress";
import moment from "moment";
import { toast } from "react-toastify";
const Payment = () => {
  const [disabled, setDisaled] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  // const [offer,setOffer]=useState({})
  const currentTime = moment()
    .tz("Asia/Ho_Chi_Minh")
    .format("YYYY-MM-DDTHH:mm");
  const [oldTotalAmount, setOldTotalAmount] = useState("");
  const [offer, setOffer] = useState({
    code: "",
    discountValue: "",
    discountType: "",
    maxDiscountMoney: "",
    expireDate: "",
    detail: "",
    _id: "",
  });
  const [usedOffer, setUsedOffer] = useState({
    code: "",
    discountValue: "",
    discountType: "",
    maxDiscountMoney: "",
    expireDate: "",
    detail: "",
    _id: "",
  });
  const [offers, setOffers] = useState([]);
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
  const [orderId, setOrderId] = useState("");
  // const [isUpdated,setIsUpdated]=useState(false);
  // const { resetCartProduct} = useContext(Context);
  // const [openModal, setOpenModal] = useState(false);
  //  const context=useContext(Context)
  //  const [order,setOrder]=useState([])
  const [cart, setCart] = useState([]);
  // const params = useParams();
  // console.log(params.id)
  const [data, setData] = useState({
    customerName: "",
    shippingAddress: "",
    phoneNumber: "",
    paymentMethod: "",
    orderId: "",
    detail: "",
    offerId: "",
    totalAmount: 0,
    items: "",
  });
  const [homeAddress, setHomeAddress] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const bankCode = "NCB";
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const closeModal = () => {
    // setOpenModal(false);
    // setIsDisable(false);
  };

  const deleteAllProductCartByUser = async () => {
    await fetch(SummaryApi.deleteAllProductInCart.url, {
      method: SummaryApi.deleteAllProductInCart.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        data.success ? console.log(data.message) : console.log(data.message);
      });
  };

  async function createPaymentUrl(orderId) {
    const a = await fetch(SummaryApi.createPaymentUrl.url, {
      method: SummaryApi.createPaymentUrl.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ orderId: orderId }),
    });
    const responseData = await a.json();
    console.log(responseData);
    if (responseData.success) {
      window.location.href = responseData.env;
    }
    if (responseData.error) {
      console.log("false");
    }
  }
 const total = cart.reduce(
  (prev, curr) =>
    prev + curr.quantity * curr?.productId?.sellingPrice,
  0
);

const discount = offer?.discountValue
  ? discountByOffer(
      total,
      offer.discountType,
      offer.discountValue,
      offer.maxDiscountMoney
    )
  : 0;

const totalAmount = total - discount;
  const createOrder = async () => {
   
    // các trường khác
    const total = cart.reduce(
  (prev, curr) =>
    prev + curr.quantity * curr?.productId?.sellingPrice,
  0
);

const discount = offer?.discountValue
  ? discountByOffer(
      total,
      offer.discountType,
      offer.discountValue,
      offer.maxDiscountMoney
    )
  : 0;

const totalAmount = total - discount;
    try {
      const fetchResponse = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          totalAmount:totalAmount,
          offerId: offer._id,
        }),
      });
      const responseData = await fetchResponse.json();
      console.log(responseData.message);
      if (responseData.success) {
        // setIsOrder(true)
        setOrderId(responseData.id);
        if (data.paymentMethod === "VNPAY") {
          createPaymentUrl(responseData.id);
          toast.success(responseData.message);
        } else {
          navigate("/");
          toast.success(responseData.message);
        }

        console.log("đã tạo rồi");
        // await fetchLastestOrder().then(data=>window.location.href=`/payment/${data._id}`)
      } else {
        setIsOrder(false);
      }
    } catch (err) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.shippingAddress !== ",," && data.shippingAddress !== "") {
      if (isOrder === false) {
        createOrder();
      } else {
        // await updateOrderDetail();
      }
    } else {
      console.log("Điền lại ");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "homeAddress") {
      setHomeAddress(value);
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleChangeHomeAddress = (e) => {
    setHomeAddress(e.target.value);
  };

  const handleChangeOffer = (e) => {
    const selectedOfferId = e.target.value;
    const selectedOffer = offers.find((offer) => offer._id === selectedOfferId);
    if (selectedOffer) {
      let checkOfferExpired = moment
        .tz(selectedOffer.expireDate, "YYYY-MM-DDTHH:mm", "Asia/Ho_Chi_Minh")
        .isBefore(currentTime);
      if (!checkOfferExpired) {
        setOffer((prev) => ({ ...prev, ...selectedOffer }));
      } else {
        setOffer((prev) => ({ ...prev, discountValue: 0 }));
      }
    }
  };

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
    const selectedDistrict = districts.find(
      (district) => district.district_id === newDistrictId
    );

    setDistrict({
      district_name: selectedDistrict?.district_name,
      district_id: selectedDistrict?.district_id,
    });
    const data = await getWardByDistrict(newDistrictId);
    setWard({ ward_id: "", ward_name: "" });
    setWards(data);
  };
  const handleChangeWard = async (e) => {
    const newWardId = e.target.value;
    const selectedWard = wards.find((ward) => ward.ward_id === newWardId);

    setWard({ ward_name: selectedWard?.ward_name, ward_id: newWardId });
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
  };

  const fetchAddToCartProduct = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();
    if (responseData.success) {
      if (isOrder) setIsOrder(false);
      setCart(responseData?.data);
      console.log(cart);
    }
    return responseData?.data;
  };
  // const fetchOrderDetailById = async () => {
  //   const response = await fetch(SummaryApi.getOrderDetailById.url, {
  //     method: SummaryApi.getOrderDetailById.method,
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       orderId: params?.id,
  //     }),
  //   });

  // const dataReponse = await response.json();
  // setIsUpdated(true)
  // setData(dataReponse.data)
  // setIsDisable(true)
  // };

  // const fetchLastestOrder = async () => {
  //   const dataResponse = await fetch(SummaryApi.getLastestOrder.url, {
  //     method: SummaryApi.getLastestOrder.method,
  //     credentials: "include",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //   });
  //   const dataApi = await dataResponse.json();

  //   if (dataApi.data?.offerId === undefined) {
  //   }
  //   if (dataApi.success && Object.keys(dataApi.data).length > 0) {
  //     console.log(dataApi.success);
  //     setIsOrder(true);
  //     setDisaled(true);
  //     setData(dataApi.data);
  //     // setProvince((province)=>({...province,full_name:dataApi.data.shippingAddress[]}))
  //     setCart(dataApi.data?.items);
  //     setHomeAddress(splitAddress(data.shippingAddress)[0]);

  //   }

  //   if (Object.keys(dataApi.data).length === 0) {
  //     console.log("Failed");
  //     setIsOrder(false);
  //     fetchAddToCartProduct();

  //     //  await fetchAddToCartProduct().then(data=>setCart(data.data))
  //   }
  //   return dataApi.data;
  // };

  useEffect(() => {
    getAllProvince().then((provinces) => setProvinces(provinces));
  }, []);
  useEffect(() => {
    //   // })
    const fetchAllOffers = async () => {
      const response = await fetch(SummaryApi.getOfferByUser.url, {
        method: SummaryApi.getOfferByUser.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const dataResponse = await response.json();

      console.log("product data", dataResponse);
      console.log(dataResponse.data);
      // let filterOffers = dataResponse.data.filter(
      //   (offer) => offer._id !== data.offerId
      // );
      // if (isOrder) {
      //   setOffers(filterOffers);
      //   let findUsedOffer = dataResponse.data.find(
      //     (offer) => offer._id === data.offerId
      //   );
      //   setUsedOffer(findUsedOffer || {});
      // } else {
      setOffers(dataResponse?.data || []);
      // }
      // setOffers(dataResponse?.data || []);

      // console.log(usedOffer)
    };
    fetchAllOffers();
    // async function fetchData() {
    //   await fetchLastestOrder();
    // }
    // fetchData();

    //   // Gọi hàm fetchCartData
    fetchAddToCartProduct();
    // fetchOrderDetailById();

    //   // //   }
  }, [isOrder]);

  useEffect(() => {
    // let oldTotalAmount
    // if (isOrder) {
    //   setOldTotalAmount(
    //     data.items.reduce(
    //       (prev, item) => prev + item.quantity * item.sellingPrice,
    //       0
    //     )
    //   );
    // } else {
    const total = cart.reduce(
    (prev, curr) => prev + curr.quantity * curr?.productId?.sellingPrice,
    0
  );

  const discount = discountByOffer(
    total,
    offer.discountType,
    offer.discountValue,
    offer.maxDiscountMoney
  );
   

    // totalPrice=totalPrice-discount
    setData((prev) => ({
      ...prev,
      totalAmount: total - discount,
    }));
  }, [
    cart,
    offer._id,
    offer.discountValue,
    offer.discountType,
    offer.maxDiscountMoney,
  ]);

  // const totalQty = cart.reduce(
  //   (previousValue, currentValue) => previousValue + currentValue.quantity,
  //   0
  // );

  // totalPrice ko thay đổi ,offer thay đổi

  // đoạn này đang test
 
  // console.log(isOrder)

  const handleResetAddress = () => {
    setDisaled(!disabled);
  };
  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      {/* {isOrder===false?(
      <>
        {cart.map(product=>{
          return<>{JSON.stringify(product)}</>
        })}
      </>
      ) : ( */}
      <div className="flex flex-col md:flex-row mx-auto p-4 h-full lg:max-w-screen-xl gap-2 ">
        {/* shipping infomation */}

        {/* {openModal && (
            <Modal
              onClose={closeModal}
              content={"Bạn có đồng ý thực hiện giao dịch ko "}
              funcAllow={
                // data.paymentMethod === "VNPAY" ? createPaymentUrl : AllowCOD
                updateOrderDetail
              }
              funcDeny={""}
            />
          )} */}
        {/* {JSON.stringify(province)} */}
        <div className="flex flex-col w-[50%] md:w-full h-auto p-8 gap-3">
          <h1 className="text-center">Thông tin giao hàng </h1>
          <form onSubmit={handleSubmit}>
            {/* <div className={`flex  ${isDisable===true?"flex-row ":"flex-col bg-red-200" } h-5`}> */}
            <div>
              {/* <label className={`w-full ${isDisable&&"w-[100px]"} `}>Họ và Tên {isDisable&&":"} </label> */}
              <label className={`w-full  `}>Họ và Tên </label>
              <input
                type="text"
                name="customerName"
                value={data.customerName}
                onChange={handleChange}
                required
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
                onChange={handleChangeProvince}
                className="w-[33.33%] overflow-x-scroll"
                disabled={disabled}
                value={province.province_id}
              >
                {disabled ? (
                  <option value={""} key="">
                    {splitAddress(data.shippingAddress)[3]}
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
                {/* <option value="" key="">Chọn Tỉnh/thành</option> */}
                {/* {JSON.stringify(provinces)} */}
                {/* // {provinces.map(province=>(<option key={province.province_id} value={province.province_id}>{province.province_name}</option>))} */}
              </select>

              <select
                name=""
                onChange={handleChangeDistrict}
                className="w-[33.33%] overflow-x-scroll"
                disabled={disabled}
                value={district.district_id}
              >
                {disabled ? (
                  <option value="" key="">
                    {splitAddress(data.shippingAddress)[2]}
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
                {/* // {districts.map(district=>(<option key={district.district_id} value={district.district_id}>{district.district_name}</option>))} */}
              </select>
              <select
                name=""
                onChange={handleChangeWard}
                className="w-[33.33%] overflow-x-scroll"
                disabled={disabled}
              >
                {disabled ? (
                  <option value="" key="">
                    {splitAddress(data.shippingAddress)[1]}
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
              {isOrder && disabled && (
                <button onClick={handleResetAddress}>Sửa</button>
              )}
            </div>
            <label>Số điện thoại </label>
            <br />
            <input
              type="text"
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-2"
              // disabled={isDisable}
            />
            <h3>Phương thức thanh toán </h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="controls mb-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={data.paymentMethod === "COD"}
                  onChange={handleChange}
                  // disabled={isDisable}
                  required
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
                  required
                  onChange={handleChange}
                />
                {/* <span className={`${isDisable?"hidden":"block"} ml-2`}>Thanh toán bằng VNPAY</span> */}
                <span className={`ml-2`}>Thanh toán bằng VNPAY</span>
              </label>
            </div>

            <label>Ghi chú</label>
            <br />
            {/* {data.shippingAddress} */}
            <textarea
              type="text"
              name="detail"
              value={data.detail}
              onChange={handleChange}
              className="w-full px-2"
              rows={5}
            />
            <button onClick={() => navigate("/cart")}>Quay lại giỏ hàng</button>
            <button
              type="submit"
              className={`${
                isDisable ? "bg-slate-500" : "bg-blue-500"
              } p-2 rounded-md`}
            >
              {/* {isDisable
                  ? "Sửa thông tin đơn hàng"
                  : "Lưu thông tin giao hàng"} */}

              {data.paymentMethod === "VNPAY" ? "Thanh toán" : "Đặt hàng"}
            </button>
          </form>
        </div>
        {/* {console.log(provinces)} */}
        <form className="  w-[50%] md:w-full p-4 h-auto ">
          <div className="flex flex-col md:justify-center   lg:justify-between ">
            {/***view product */}
            <div className="w-full  md:max-w-screen-md ">
              {isOrder &&
                cart.map((product, index) => (
                  <div
                    key={product?._id}
                    className="w-full bg-white lg:h-20  my-2 border rounded flex flex-row  "
                  >
                    <div className="w-20 h-20 bg-slate-200">
                      <img
                        src={product?.productImage?.[0]}
                        className="w-full h-full object-scale-down mix-blend-multiply bg-slate-50 "
                        alt="product-img"
                      />
                    </div>
                    <div className="px-4 py-2  w-full flex justify-between  flex-col md:flex-row">
                      {/**delete product */}

                      <div className="text-sm w-[100%] lg:w-[50%]  break-all">
                        {product?.productName}
                      </div>
                      <div className="flex items-center justify-center w-[10%] text-center bg-white">
                        <span>x</span>
                      </div>
                      <div className="w-[10%] text-center flex items-center justify-center bg-white">
                        <span>{product?.quantity}</span>
                      </div>
                      <p className="text-slate-600 font-semibold w-[50%] lg:w-[20%] text-sm lg:text-base text-right break-all flex items-center justify-center">
                        {displayVNDCurrency(product?.sellingPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              {isOrder === false &&
                cart.map((product, index) => (
                  <div
                    key={product?._id}
                    className="w-full bg-white lg:h-20  my-2 border rounded flex flex-row  "
                  >
                    <div className="w-20 h-20 bg-slate-200">
                      <img
                        src={product?.productId?.productImage[0]}
                        className="w-full h-full object-scale-down mix-blend-multiply bg-slate-50 "
                        alt="product-img"
                      />
                    </div>
                    <div className="px-4 py-2  w-full flex justify-between  flex-col md:flex-row">
                      {/**delete product */}
                      <div className="text-sm w-[100%] lg:w-[50%]  break-all">
                        {product?.productId?.productName}
                      </div>
                      <div className="flex items-center justify-center w-[10%] h-full  text-center bg-white">
                        <span>x</span>
                      </div>
                      <div className="w-[10%] bg-white flex justify-center items-center">
                        <span>{product?.quantity}</span>
                      </div>
                      <p className="text-slate-600 font-semibold w-[50%] lg:w-[20%] text-sm lg:text-base text-right break-all flex justify-center items-center">
                        {displayVNDCurrency(product?.productId?.sellingPrice)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            {/* {offer} */}

            <hr className="bg-black h-0.5 w-full" />
            {/***summary  */}

            {/* {cart.length !== 0 && (
               
              )} */}

            <hr className="bg-black h-0.5 w-full" />

            <div className="  mt-5 lg:mt-0 w-full ">
              <div className="">
                <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                  <label htmlFor="promote">Ưu đãi</label>
                  {/* <select name="offer" onChange={handleChangeOffer}>
                    <option value={1}>Chọn ưu đãi</option>
                     {offers.map(offer=><option value={offer._id} key={offer.code} className={`${offer.expireDate && "bg-red-500"}`}>{offer.code}</option>)}
                    </select> */}

                  <select name="offer" onChange={handleChangeOffer}>
                    {/* {isOrder && data?.offerId ? (
                      <>
                        <option value={data?.offerId} key={data?.offerId}>
                          {usedOffer.code}
                        </option>

                        {offers.map((offer) => (
                          <option
                            value={offer._id}
                            key={offer._id}
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

                        <option value={1}>Chọn ưu đãi</option>
                      </>
                    ) : (
                      <> */}
                    <option value={1}>Chọn ưu đãi</option>
                    {offers.map((offer) => (
                      <option
                        value={offer._id}
                        key={offer._id}
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
                    {/* </>
                    )} */}
                  </select>
                </div>
              </div>
            </div>
            <div className="  mt-5 lg:mt-0 w-full ">
              <div className="">
                <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                  <p>Giảm giá</p>
                  <p>
                    {displayVNDCurrency(
                      discountByOffer(
                        cart.reduce(
                          (prev, curr) =>
                            prev +
                            curr.quantity * curr?.productId?.sellingPrice,
                          0
                        ),
                        offer.discountType,
                        offer.discountValue,
                        offer.maxDiscountMoney
                      )
                    )}
                  </p>
                </div>
              </div>
            </div>
            <hr className="bg-black h-0.5 w-full" />

            <div className="  mt-5 lg:mt-0 w-full ">
              <div className="">
                <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                  <label htmlFor="promote">Tổng tiền</label>
                  <p>
                    {/* ko có isOrder  */}
                    {/* {isOrder && data.offerId ?*/}

                    {displayVNDCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <br />
        </form>
      </div>
    </>
  );
};

export default Payment;
