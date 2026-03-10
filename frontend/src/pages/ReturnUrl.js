import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import {convertTime} from "../helpers/convertTime";
import ROLE from "../common/role";
import { useSelector } from "react-redux";
import Context from "../context";
const ReturnUrl = () => {
  const user = useSelector((state) => state?.user?.user);
  const { resetCartProduct } = useContext(Context);
  const [code, setCode] = useState("");
  const [orderDetail, setOrderDetail] = useState({});
  const [vnpParams, setVnpParams] = useState({
    vnp_Amount: "",
    vnp_BankCode: "",
    vnp_CardType: "",
    vnp_OrderInfo: "",
    vnp_PayDate: "",
    vnp_ResponseCode: "",
    vnp_TmnCode: "",
    vnp_TransactionNo: "",
    vnp_TransactionStatus: "",
    vnp_TxnRef: "",
    vnp_SecureHash: "",
  });
  const [order, setOrder] = useState({
    items: "",
    customerName: "",
    totalAmount: "",
    paymentMethod: "",
    orderDate: "",
    phoneNumber: "",
    productName: "",
    productImage: "",
    status: "",
    shippingAddress: "",
    offerId: "",
  });
  const navigate = useNavigate();
  const getVnpParams = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const params = {};
    urlParams.forEach((value, key) => {
      params[key] = value;
    });

    setVnpParams((prev) => ({
      ...prev,
      ...params,
    }));
  };
  useEffect(() => {
    console.log("Updated vnpParams:", vnpParams);
  }, [vnpParams]);

  const fetchPaymentResult = async () => {
    const response = await fetch(
      `${SummaryApi.returnUrl.url}?${new URLSearchParams(
        vnpParams
      ).toString()}`,
      {
        method: SummaryApi.returnUrl.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const data = await response.json();
    setCode(data.code);

    if (data.success) {
      resetCartProduct();
      toast.success("Thanh toán thành công");
    } else {
      toast.error("Thanh toán thất bại");
    }
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `${SummaryApi.getOrderById.url}/${vnpParams["vnp_OrderInfo"]}`,
          {
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
          }
        );
        const data = await response.json();

        setOrder((prev) => ({
          ...prev,
          ...data.data,
        }));
      } catch (error) {}
    };

    fetchOrderDetail();
    fetchPaymentResult();
  }, [vnpParams]);
  useEffect(() => {
    getVnpParams(); // Lấy vnp_Params từ URL khi trang được load
  }, []);

  return (
    <div className="w-full p-4 ">
      <div className="mb-8">
        {code === "00" ? (
          <div>
            <p className="text-center text-lg mb-8">
              Quý khách đã thanh toán đơn hàng thành công
            </p>
            <table className="w-full border-red-600 h-full">
              <thead>
                <tr className="">
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt hàng</th>
                  <th>Số điện thoại </th>
                  <th>Người nhận</th>
                  <th>Địa chỉ nhận hàng</th>
                  <th>Trạng thái đơn hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td>{vnpParams.vnp_OrderInfo}</td>
                  <td>{convertTime(order.orderDate)}</td>
                  <td>{order.phoneNumber}</td>
                  <td>{order.customerName}</td>
                  <td>{order.shippingAddress}</td>
                  <td>{order.status === "confirmed" && "Chờ giao hàng"}</td>
                </tr>
              </tbody>
            </table>

            <table className="w-full h-full mt-6">
              <thead>
                <tr className="text-center">
                  <th className="w-1/3">Vật tư</th>
                  <th className="w-1/3">Số lượng</th>
                  <th className="w-1/3">Giá</th>
              </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="flex justify-center items-center gap-2"><img src={item.productImage} alt="" width={50} height={50} /><h3 className="text-lg">{item.productName}</h3></td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">{item.sellingPrice}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-black">
                <tr className="text-center">
                  <td colSpan={2} className="text-xl">Tổng tiền</td>
                  <td className="text-xl">{order.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
            {user.role!=="GENERAL" && <Link to="/admin-panel/all-orders"><button>Quay lại</button> </Link>}
          </div>
        ) : (
          <div>
            Thanh toán thất bại
            {vnpParams.vnp_OrderInfo}
            <div>{order.orderDate}</div>
            <div>{order.paymentMethod}</div>
            <div>{order.totalAmount}</div>
            <div>{order.phoneNumber}</div>
            <div>{order.shippingAddress}</div>
            <div>{order.status}</div>
            <div>{order.customerName}</div>
            <div>{order.paymentMethod}</div>
          
          </div>
        )}
      </div>

      {user?.role === ROLE.GENERAL && (
        <>
          <div className="flex gap-5 justify-center items-center w-full">
            <Link to="/user/all-orders">
              <button className="rounded-full text-white bg-lime-700 p-2">Kiểm tra đơn hàng</button>
            </Link>
            <Link to="/">
              <button>Mua hàng tiếp</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnUrl;
