import React, { useEffect, useState, useCallback,useContext } from "react";
import { useSelector } from "react-redux";
import ROLE from "../common/role";
import SummaryApi from "../common";
import DetailsOrders from "../components/DetailsOrders";
import PaginatedItems from "../components/PaginatedItems";
import Context from "../context";
import { convertTime, AllowUpdateOrder,AllowCancelOrder } from "../helpers/convertTime";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Report from "../components/Report";
import Modal from "../components/Modal";
import AddOrder from "../components/AddOrder";
import UpdateOrder from "../components/UpdateOrder";
import moment, { now } from "moment";
import { toast } from "react-toastify";

const AllOrders = () => {
  const context = useContext(Context);
  const [orders, setOrders] = useState([]);
  const [AllOrders, setAllOrders] = useState([]);
  const [currentItems, setCurrentItems] = useState(0);
  const user = useSelector((state) => state?.user?.user);
  // const [bankCode, setBankCode] = useState("");
  const [loading, setLoading] = useState(false);
  // if roles=Admin  fetch , role =General =>
  const [openDetailOrder, setOpenDetailOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openReport, setOpenReport] = useState(false);
  const [openAddOrder, setOpenAddOrder] = useState(false);
  const [openUpdateOrder, setOpenUpdateOrder] = useState(false);
  const [openCancelOrder,setOpenCancelOrder]=useState(false)
  const [openDeleteOrder, setOpenDeleteOrder] = useState(false);

  const fetchAllOrders = useCallback(async () => {
    const dataResponse = await fetch(SummaryApi.getAllOrders.url, {
      method: SummaryApi.getAllOrders.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const dataApi = await dataResponse.json();

    setOrders(dataApi.data);
    if (dataApi.success) {
      console.log("Success");
    }

    if (dataApi.error) {
      console.log("Failed");
    }
  }, []);

  const fetchOrdersByUser = useCallback(async () => {
    const dataResponse = await fetch(SummaryApi.getOrdersbyUser.url, {
      method: SummaryApi.getOrdersbyUser.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
    });
    const dataApi = await dataResponse.json();
    console.log(dataApi.data);
    if (dataApi.success && dataApi.data) {
      // setBankCode("NCB");
      console.log("Success");
      setOrders(dataApi.data);
    }

    if (dataApi.error) {
      console.log("Failed");
    }
  }, []);
  async function createPaymentUrl(order) {
    const a = await fetch(SummaryApi.createPaymentUrl.url, {
      method: SummaryApi.createPaymentUrl.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ orderId:order._id }),
    });
    const responseData = await a.json();
    console.log(responseData);
    if (responseData.success) {
      console.log(responseData.data);
      window.location.href = responseData.env;
    }
    if (responseData.error) {
      console.log("false");
    }
  }
  const handlePayment = (order) => {
    createPaymentUrl(order);
  };
  const handleOpenAddOrder = () => {
    setOpenAddOrder(true);
  };
  const closeAddOrder = () => {
    setOpenAddOrder(false);
  };
  const handleDetailOrder = (order) => {
    setSelectedOrder(order);
    setOpenDetailOrder(true);
  };
  const closeDetailOrder = () => {
    setOpenDetailOrder(false);
  };

  const handleOpenReport = (order) => {
    setSelectedOrder(order);
    setOpenReport(true);
  };
  const closeReport = () => {
    setOpenReport(false);
  };
  const closeUpdateOrder = () => {
    setOpenUpdateOrder(false);
  };
  const closeCancelOrder=()=>{
    setOpenCancelOrder(false)
  }
  const closeDeleteOrder = () => {
    setOpenDeleteOrder(false);
  };

  useEffect(() => {
    if (user?.role === ROLE.ADMIN || user?.role === ROLE.EMPLOYEE) {
      fetchAllOrders();
    } else {
      fetchOrdersByUser();
    }
  }, [user, fetchAllOrders, fetchOrdersByUser]);

  // useEffect(() => {
  //   let now = moment();
  // }, []);

  const handleCancelOrder =async(order) => {
    // setOrders(newOrder)
    
    const findOrder = orders.find((a) => a._id === order._id);
    // console.log(findOrder);
    
        const updateOrder = {...findOrder,status:"cancelled"}
        setOrders(prevOrders=>prevOrders.map(o=>o._id===order._id?updateOrder:o))
        
    setSelectedOrder(order)
    try {
      const res = await fetch(SummaryApi.cancelOrder.url, {
        method: SummaryApi.cancelOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ orderId: order._id }),
      });
      const responseData = await res.json();
    
      if (responseData.success) {
        // setOrders([...orders,responseData.data])
          setOrders(prevOrders =>
        prevOrders.map(o =>
          o._id === order._id ? responseData.data : o
        ))
        setOpenCancelOrder(false)
        context.fetchUserAddToCart()
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleDeleteOrder = async (order) => {
    // setOrders(newOrder)
    try {
      const res = await fetch(SummaryApi.deleteOrder.url, {
        method: SummaryApi.deleteOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ orderId: order._id }),
      });
      const data = await res.json();
      console.log(data);
      if (data.success) {
        const newOrder = orders.filter((a) => a._id !== order._id);
        setOrders(newOrder);
        // await fetchOrdersByUser()
        setSelectedOrder(null);
        setOpenDeleteOrder(false)
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleOrderUpdated = (updatedOrder) => {
    if (!updatedOrder || (updatedOrder.items && updatedOrder.items.length === 0)) {
      // setOrders(prevOrders => prevOrders.filter(order => order._id !== selectedOrder._id));
      // closeUpdateOrder();
    } else {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          // order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
          order._id === updatedOrder._id ? updatedOrder: order

        )
      );
      setSelectedOrder(updatedOrder);
    }
  };
  const handleAddToOrders=(newOrder)=>{
    setOrders(prevOrders=>[...prevOrders,newOrder])
  }
  return (
    <>
      {openDetailOrder && (
        <DetailsOrders onClose={closeDetailOrder} order={selectedOrder} />
      )}

      {openReport && <Report onClose={closeReport} order={selectedOrder} />}
      {openAddOrder && <AddOrder onClose={closeAddOrder} handleAddToOrders={handleAddToOrders} fetchAllOrders={fetchAllOrders}/>}

      {openUpdateOrder && (
        <UpdateOrder onClose={closeUpdateOrder} order={selectedOrder} onUpdated={handleOrderUpdated} />
      )}

      {openDeleteOrder && (
        <Modal
          onClose={closeDeleteOrder}
          content={"Bạn có muốn xoá đơn hàng không"}
          funcAllow={() => handleDeleteOrder(selectedOrder)}
          funcDeny={closeDeleteOrder}
        />
      )}
      {openCancelOrder &&(
        <Modal
          onClose={closeCancelOrder}
          content={"Bạn có muốn huỷ đơn hàng không"}
          funcAllow={() => handleCancelOrder(selectedOrder)}
          funcDeny={closeCancelOrder}
        />
      )}
     
      
      {user?.role !== ROLE.GENERAL && (
        <button onClick={handleOpenAddOrder}>Tạo đơn hàng</button>
      )}

      {(user?.role === ROLE.ADMIN || user?.role === ROLE.EMPLOYEE) && (
        <div className="bg-white pb-4 ">
          <table className="w-full userTable h-[calc(100vh-100px)]">
            <thead>
              <tr className="bg-black text-white">
                <th>Mã đơn hàng</th>
                <th>Mã khách hàng</th>
                <th>Tên khách hàng</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Chi tiết đơn hàng</th>
                <th>Ngày đặt hàng</th>
                <th>Trạng thái đơn hàng</th>
                <th>Thanh toán</th>
                <th>Phương thức thanh toán</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="">
              {currentItems &&
                currentItems.map((order, index) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.userId}</td>
                    <td>{order.customerName}</td>
                    <td>{order.phoneNumber}</td>
                    <td>{order.shippingAddress}</td>
                    <td>
                      <button
                        className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
                        onClick={() => handleDetailOrder(order)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                    <td>{convertTime(order.orderDate)}</td>
                    <td>{order.status}</td>
                    <td>{order.isPaid ? "Yes" : "No"}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.totalAmount}</td>
                    <td className="p-4">
                      {order.status==="pending" &&AllowUpdateOrder(order.orderDate,user.role) &&<button
                        onClick={() => {
                          if(AllowUpdateOrder(order.orderDate,user.role)){
                            console.log(AllowUpdateOrder(order.orderDate,user.role))
                            setSelectedOrder(order);
                            setOpenUpdateOrder(true); 
                          }else{
                            // console.log(user.role)
                             console.log(AllowUpdateOrder(order.orderDate,user.role))
                            toast.error("Bạn đã hết thời gian để chỉnh sửa đơn hàng")
                          }
                        }}
                        className="border-2 me-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 l"
                      >
                        Sửa
                      </button>}
                      {order.paymentMethod === "VNPAY" &&
                        order.status === "pending" && (
                          <>
                            {" "}
                            <button onClick={()=>{setSelectedOrder(order);handlePayment(order)}}>Thanh toán</button>
                            {/* <Link to={`/payment/${order?._id}`}>Đặt hàng</Link> */}
                          </>
                        )}
                      {order.status === "pending" && "Hủy đơn "&&AllowCancelOrder(order.orderDate,user.role) && (
                        <button
                          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
                          onClick={() => {
                            if (AllowCancelOrder(order.orderDate,user.role)) {
                            setSelectedOrder(order);
                            setOpenCancelOrder(true);
                          } else {
                           toast.error("Bạn đã hết thời gian để huỷ đơn hàng này")
                          }
                          }}
                        >
                          Hủy đơn
                        </button>)}
                      {order.status === "canceled" && (
                        <button
                          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 "
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenDeleteOrder(true);
                          }}
                        >
                          Xoá
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {user?.role === ROLE.GENERAL && (
        <div className="pb-4  h-[calc(100vh-100px)]">
          <table className="w-full userTable">
            <thead>
              <tr className="bg-black text-white">
                <th>Mã đơn hàng</th>
                <th>Chi tiết đơn hàng</th>
                <th>Ngày đặt hàng</th>
                <th>Trạng thái đơn hàng</th>
                <th>Thanh toán</th>
                <th>Phương thức thanh toán</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="">
              {currentItems &&
                currentItems.map((order, index) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <th>
                      <button
                        className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
                        onClick={() => handleDetailOrder(order)}
                      >
                        Xem chi tiết
                      </button>
                    </th>
                    <td>{convertTime(order.orderDate)}</td>
                    <td>{order.status}</td>
                    <td>{order.isPaid ? "Yes" : "No"}</td>
                    <td>{order.paymentMethod}</td>
                    <td>{order.totalAmount}</td>
                    {/* Thêm nút  Hủy vào + CHỉ cho Thanh Toán với VNPAY thôi  */}
                    <td>
                      {order.paymentMethod === "VNPAY" &&
                        order.status === "pending" && (
                          <>
                            {" "}
                            <button onClick={()=>{setSelectedOrder(order);handlePayment(order)}}>Thanh toán</button>
                            {/* <Link to={`/payment/${order?._id}`}>Đặt hàng</Link> */}
                          </>
                        )}
                      {/* {order.status==="completed" &&" Phản hồi "} */}
                      {/* <button
                        className="me-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 "
                        onClick={() => handleOpenReport(order)}
                      >
                        Phản hồi
                      </button> */}
                     {order.status==="pending" &&AllowUpdateOrder(order.orderDate,user.role) &&<button
                        onClick={() => {
                          if (AllowUpdateOrder(order.orderDate,user.role)) {
                            setSelectedOrder(order);
                            setOpenUpdateOrder(true);
                          } else {
                           toast.error("Bạn đã hết thời gian để chỉnh sửa đơn hàng này")
                          }
                        }}
                        className="border-2 me-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 l"
                      >
                        Sửa
                      </button>}
                      {order.status === "canceled" && (
                        <button
                          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 "
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpenDeleteOrder(true);
                          }}
                        >
                          Xoá
                        </button>
                      )}{" "}
                      {order.status === "pending" && "Hủy đơn "&&AllowCancelOrder(order.orderDate,user.role) && (
                        <button
                          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
                          onClick={() => {
                            if (AllowCancelOrder(order.orderDate,user.role)) {
                            setSelectedOrder(order);
                            setOpenCancelOrder(true);
                          } else {
                           toast.error("Bạn đã hết thời gian để huỷ đơn hàng này")
                          }
                          }}
                        >
                          Hủy đơn
                        </button>
                      )}
                      {order.status === "confirmed" && "Đổi /Trả hàng "}
                    </td>

                    {/* <td><UpdateOrder order={order} isUpdate={isUpdate} fetchOrdersByUser={fetchOrdersByUser()}/>Sửa</td> */}
                    <td></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      {user?.role === "GENERAL" ? (
        <PaginatedItems
          itemsPerPage={10}
          setCurrentItems={setCurrentItems}
          items={orders}
        />
      ) : (
        <PaginatedItems
          itemsPerPage={5}
          setCurrentItems={setCurrentItems}
          items={orders}
        />
      )}
    </>
  );
};

export default AllOrders;

// Nếu chưa thanh toánn đơn hàng cũ => ko được xóa trong add to cart

// Return url sẽ ko xóa (điều kiện fetch lastest order  kiểm tra isPaid = true chưa nếu )
/* 
Đơn đã thanh toán chỉ được sửa địa chỉ giao hàng 
Đơn chưa thanh toán /thanh toán bằng COD được thay đổi địa chỉ ,ptt toán 
*/
