import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import Context from "../context";
import displayVNDCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import Modal from "../components/Modal";
import { toast } from "react-toastify";
import CountDownTimer from "../components/CountDownTimer";
const Cart = () => {
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const context = useContext(Context);
  // const loadingCart = new Array(4).fill(null);
    // const [openModal, setOpenModal] = useState(false);
    const [chooseModal,setChooseModal]=useState(null)
  const navigate = useNavigate();
  // const [isOrder, setIsOrder] = useState(localStorage.getItem("isOrder") === "true");
  const [isOrder, setIsOrder] = useState(false);
  const [orderId,setOrderId]=useState("")
  const [isUpdate, setIsUpdate] = useState(false);
  // const [id, setId] = useState("");
  const [items, setItems] = useState([]);
  const fetchLastestOrder = async () => {
    const dataResponse = await fetch(SummaryApi.getLastestOrder.url, {
      method: SummaryApi.getLastestOrder.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const dataApi = await dataResponse.json();

   

    if (dataApi.success && Object.keys(dataApi.data).length > 0) {
      // console.log(dataApi.success);
      // localStorage.setItem("isOrder","true")
      setIsOrder(true);
      // setId(dataApi.data._id);
      setOrderId(dataApi.data._id)
      setData(dataApi.data.items);
    }
    //  if(!dataApi.data){
    // setIsOrder(false);
    // await fetchData();
    // }
    else {
      console.log(dataApi.message);
      await fetchData();
      setIsOrder(false);
    }
  };
  const closeModal = () => {
    setChooseModal(null);
  };
  const openModal=(chooseModal)=>{
    setChooseModal(chooseModal)
  }
  // const createOrder = async () => {
  //   try {
  //     const fetchResponse = await fetch(SummaryApi.createOrder.url, {
  //       method: SummaryApi.createOrder.method,
  //       credentials: "include",
  //       headers: {
  //         "content-type": "application/json",
  //       },
  //     });
  //     const responseData = await fetchResponse.json();
  //     console.log(responseData?.id);
  //     setId(responseData?.id);
  //     window.location.href = `/payment/${responseData.id}`;
  //   } catch (err) {}
  // };
  console.log(isOrder);
  const fetchData = async () => {
    const response = await fetch(SummaryApi.addToCartProductView.url, {
      method: SummaryApi.addToCartProductView.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });

    const responseData = await response.json();

    // setData(responseData.data);
    if (responseData.success&& responseData.data.length>0) {
      console.log(responseData.data);
      setData(responseData.data);
      setIsOrder(false);
    }else{
      setData([]);
      setIsOrder(false);
    }
  };

  const handleLoading = async () => {
    await fetchData();
  };

  const increaseQty = async (id, qty) => {

    if (isOrder === false) {
      
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty + 1,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
        console.log(responseData.data2)
        //  toast.success(responseData.message)
      }else{
        toast.error(responseData.message)
      }
    } else {
      const response = await fetch(SummaryApi.updateQuantityProductOrder.url, {
        method: SummaryApi.updateQuantityProductOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          quantity: qty + 1,
          orderId:orderId
        }),
      });
      console.log(orderId)
      const responseData = await response.json();

      if (responseData.success) {
        // fetchLastestOrder();
      // openModal("1")
      setData(responseData.data.items);
      toast.success(responseData.message)
      }else{
        toast.error(responseData.message)
      }
    }
  };

  const decreaseQty = async (id, qty) => {
    if (isOrder) {
      const response = await fetch(SummaryApi.updateQuantityProductOrder.url, {
        method: SummaryApi.updateQuantityProductOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        }, 
        body: JSON.stringify({
          productId: id,
          quantity: qty - 1,
          orderId:orderId
        }),
      });
      
      const responseData = await response.json();
      if (responseData.success) {
        setData(responseData.data.items);
        toast.success(responseData.message)
      }else{
       
        toast.error(responseData.message)
      }
    } else if (qty >1 && isOrder === false) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
        // openModal("2")
        // console.log(responseData.data2)
      }
    }
  };

  const deleteProduct = async (id) => {
    if (isOrder === false) {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
        }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        fetchData();
        context.fetchUserAddToCart();
      }else{
        toast.error(responseData.message)
      }
    } else {
      const response = await fetch(SummaryApi.deleteProductInOrder.url, {
        method: SummaryApi.deleteProductInOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          productId: id,
          orderId:orderId
        }),
      });
     
      // id ở đây là cartid
      const responseData = await response.json();

      if (responseData.success) {
        if(responseData.data){
        fetchLastestOrder();
        context.fetchUserAddToCart();
        }
        else{
          setIsOrder(false)
          await fetchData()
          context.fetchUserAddToCart()
        }

      }
    }
  };
  const handlePayment = async () => {
    await fetchLastestOrder();
    if (isOrder === false) {
      window.location.href = "/payment";
    } 
  };

  const totalQty = data.reduce(
    (previousValue, currentValue) => previousValue + currentValue.quantity,
    0
  );
  let totalPrice;
  if (isOrder) {
    totalPrice = data.reduce(
      (preve, curr) => preve + curr.quantity * curr?.sellingPrice,
      0
    );
  } else {
    totalPrice = data.reduce(
      (preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice,
      0
    );
  }

  useEffect(() => {
    // setLoading(true);

    // getAllProvince();
    // fetchLastestOrder().then(data=>console.log(data));
    // fetchData().then(data=>console.log(data))
    fetchLastestOrder()
  }, []);
  return (
    // <div className="sm:container max-w-[calc(320px-32px)] mx-auto ">
    <div className="max-w-sm px-4 sm:container mx-auto relative">
{isOrder&&<CountDownTimer/>}
       {chooseModal==="1" && (
            <Modal
              onClose={closeModal}
              content={"Bạn có muốn xoá không? "}
              funcAllow={
                // data.paymentMethod === "VNPAY" ? createPaymentUrl : AllowCOD
                ""
              }
              funcDeny={""}
            />
          )}
          
      <h1 className="text-lg mt-5">{isOrder?"Vật tư trong đơn hàng":"Giỏ hàng"}</h1>
      <div className="text-center text-lg my-3">
        {/* {data.length === 0 && !loading && ( */}
        {data.length === 0 && (
          <>
            {" "}
            <p className="bg-white py-5 ">Giỏ hàng của bạn đang trống </p>
            <button className="bg-red-50 m-4 p-2">
              <Link to="/">Mua hàng tiếp </Link>
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col md:justify-center md:flex-row md:gap-10 lg:flex-row  p-4">
        {/***view product */}
        <div className="w-full  md:max-w-screen-md  max-h-[410px] overflow-y-auto">
          {/* {loading
            ? loadingCart?.map((el, index) => {
                return (
                  <div
                    key={el + "Add To Cart Loading" + index}
                    className="w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded"
                  ></div>
                );
              }): */}
          {/* data.map((product, index) => { */}
          {data.length!==0 &&data.map((product, index) => {
            // data.items =[{productId},{productId}]
            // data =[{productId:{},_id},{productId:{},_id}]
            return (
              <div
                // key={product?._id + "Add To Cart Loading"}
                className="w-full bg-white h-32 my-2 border border-slate-300  rounded grid grid-cols-[128px,1fr] "
              >
                <div className="w-32 h-32 bg-slate-200">
                  <img
                    src={
                      isOrder
                        ? product?.productImage?.[0]??""
                        : product?.productId?.productImage?.[0]??""
                    }
                    className="w-full h-full object-scale-down mix-blend-multiply"
                    alt="product-img"
                  />
                </div>
                <div className="px-4 py-2 relative w-full ">
                  {/**delete product */}
                  <div
                    className="absolute top-10 md:right-0 md:top-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer"
                    // onClick={() => deleteProduct(product?._id)}
                    onClick={() => {
                      isOrder
                        ? deleteProduct(product?.productId)
                        : deleteProduct(product?._id);
                    }}
                  >
                    <MdDelete />
                  </div>

                  <h2 className="text-sm lg:text-xl text-ellipsis line-clamp-1 flex flex-wrap">
                    {/* {product?.productId?.productName} */}
                    {isOrder
                      ? product?.productName
                      : product?.productId?.productName}
                    {/* <h1>
                      {isOrder ? product?.productId : product?.productId?._id}
                    </h1> */}
                  </h2>

                  <div className="flex items-center justify-between">
                    <p className="text-red-600 font-medium text-lg">
                      {/* {displayVNDCurrency(product?.productId?.sellingPrice)} */}
                      {isOrder
                        ? displayVNDCurrency(product?.sellingPrice)
                        : displayVNDCurrency(product?.productId?.sellingPrice)}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-2  mt-1 max-h-6 ">
                    <div className="flex flex-wrap gap-3 items-center">
                      <button
                        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                        onClick={() => {
                          isOrder
                            ? decreaseQty(product?.productId, product?.quantity)
                            : decreaseQty(product?._id, product?.quantity);
                        }}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>

                      <button
                        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded "
                        onClick={() => {
                          isOrder
                            ? increaseQty(product?.productId, product?.quantity)
                            : increaseQty(product?._id, product?.quantity);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-slate-600 font-semibold text-lg">
                      {/* {displayVNDCurrency(
                            product?.productId?.sellingPrice * product?.quantity
                          )} */}
                      {isOrder
                        ? displayVNDCurrency(
                            product?.sellingPrice * product?.quantity
                          )
                        : displayVNDCurrency(
                            product?.productId?.sellingPrice * product?.quantity
                          )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {console.log(isOrder.toString())}
     
        {data.length !== 0 && (
          <div className=" w-full md:w-[30%] pt-2 ">
            {/* {loading ? (
              <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse"></div>
            ) : ( */}
            <div className="h-36 bg-white">
              <h2 className="text-white bg-red-600 px-4 py-1">Tổng </h2>
              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Số lượng</p>
                <p>{totalQty}</p>
              </div>

              <div className="flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600">
                <p>Tổng</p>
                <p>{displayVNDCurrency(totalPrice)}</p>
              </div>

             {!isOrder&& <button
                className="bg-blue-600 p-2 text-white w-full mt-2 "
                onClick={handlePayment}
              >
                {isOrder?""
                  : "Tạo đơn hàng"}
                {/* {isOrder?"Thanh toán" :"Tạo đơn hàng"} */}
                {/* Cập nhật đơn hàng lại là xong  */}
                {/* {isUpdate?"Đã cập nhật ":""} */}
                {/* 
                  {isUpdate
    ? "Đã cập nhật"
    : isOrder
    ? "Cập nhật giỏ hàng vào đơn hàng hiện tại"
    : "Tạo đơn hàng"} */}
              </button>}
            </div>
            {/* )} */}
          </div>
        )}
        {/* } */}
      </div>
    </div>
  );
};

export default Cart;
