import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
const CheckOrder = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
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
  const findOrder = async () => {
    try {
      const responseData = await fetch(SummaryApi.getOrderByPhone.url, {
        method: SummaryApi.getOrderByPhone.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      const dataApi = await responseData.json();
      if (dataApi.success) {
        setOrder(dataApi.data);
        console.log(order);
      } else {
        setOrder(null)
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e) => {
    setPhoneNumber(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber) {
      findOrder();
    } else {
      toast.error("Vui lòng nhập số điện thoại.");
    }
  };

  return (
    <div className="w-full h-full flex py-7 mx-auto  ">
      <div className="w-[50%] h-auto flex flex-col justify-start items-center p-8 gap-4">
        <h1 className="text-center text-xl ">Kiểm tra đơn hàng </h1>
        <form className="w-[50%]" onSubmit={handleSubmit}>
          <label>Số điện thoại :</label>

          <br />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Nhập số điện thoại của bạn"
            className="w-full px-2"
            onChange={handleChange}
            value={phoneNumber}
          />

          <br />
          <br />
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-slate-500 text-center p-3 rounded-full"
            >
              Kiểm tra
            </button>
          </div>
        </form>
      </div>
      <div className="w-[50%]  h-auto bg-slate-300 flex flex-col p-8 gap-3 mr-2">
       
        {!order&&"Không tìm thấy đơn hàng "} 
        {order &&(
          <>
           <h1>Chi tiết Đơn hàng</h1>
            <table className="w-full">
              <tbody>
                <tr>
                  <td>Mã đơn hàng </td>
                  <td>{order?._id}</td>
                </tr>
                <tr>
                  <td>Người nhận </td>
                  <td>{order?.customerName}</td>
                </tr>
                <tr>
                  <td>Địa chỉ</td>
                  {console.log(order?.shippingAddress)}
                  <td>{order?.shippingAddress}</td>
                </tr>
                <tr>
                  <td>Phương thức thanh toán</td>
                  <td>
                    {order?.paymentMethod === "COD" && "Thanh toán trực tiếp"}
                    {order?.paymentMethod === "VNPAY" && "VNPAY"}
                  </td>
                </tr>
                <tr>
                  <td>Thanh toán</td>
                  <td>
                    {order?.isPaid === true && "Đã thanh toán"}
                    {order?.isPaid === false && "Chưa thanh toán"}
                  </td>
                </tr>
                <tr>
                  <td>Tình trạng giao hàng</td>
                  <td>
                    {order?.status === "pending" && "Chờ giao hàng"}
                    {order?.status === "confirmed" && "Đã giao"}
                    {order?.status === "cancelled" && "Đã hủy"}
                  </td>
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
                {order?.items &&
                  order?.items?.map((item, index) => (
                    <tr key={index} className="text-center">
                      <td className="flex justify-start items-center gap-2">
                        <img
                          src={item.productImage}
                          alt=""
                          width={50}
                          height={50}
                        />
                        <h3 className="text-lg">{item.productName}</h3>
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">{item.sellingPrice}</td>
                    </tr>
                  ))}
              </tbody>
              <tfoot className="border-t-black">
                <tr className="text-center">
                  <td colSpan={2} className="text-xl">
                    Tổng tiền
                  </td>
                  <td className="text-xl">{order.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckOrder;
