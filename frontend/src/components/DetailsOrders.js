import React, { useState } from "react";
import { CgClose } from "react-icons/cg";
import {convertTime} from "../helpers/convertTime";
import { useSelector } from "react-redux";
const DetailsOrders = ({ onClose, order }) => {
   const user = useSelector((state) => state?.user?.user);
  const [data, setData] = useState({
    items: order?.items,
    customerName: order?.customerName,
    isPaid: order?.isPaid,
    totalAmount: order?.totalAmount,
    paymentMethod: order?.paymentMethod,
    orderDate: order?.orderDate,
    phoneNumber: order?.phoneNumber,
    productName: order?.productName,
    productImage: order?.productImage || [],
    status: order?.status,
    shippingAddress: order?.shippingAddress,
    offerId:order?.offerId,
    detail:order?.detail
  });
  function fetchOrders() {
    console.log(data.items);
  }
  console.log(fetchOrders);
  return (
    <div className="fixed w-full  h-full bg-slate-200 bg-opacity-55 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Chi tiết đơn hàng</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>
        <div className=" grid py-10 gap-2 overflow-y-scroll  h-full ">
          {data.items.map((item, key) => (
            <div
              key={item.productId}
              className="grid p-4 gap-0  h-full pb-5 grid-rows-1 grid-cols-2"
            >
              <img
                src={item?.productImage?.[0]}
                width={80}
                height={80}
                className="bg-slate-100 border cursor-pointer "
                alt=""
              />
              <div>
                <h4>{item.productName}</h4>
                <h1>{item.category}</h1>
                <h2>Giá:{item.sellingPrice}</h2>
                <h3>Số lượng :{item.quantity}</h3>
              </div>
            </div>
          ))}
            <hr/>
          
          <h3 className="text-right">Tổng tiền: {data.totalAmount}</h3>
          <h3>Người nhận: {data.customerName}</h3>
          <h3>Địa chỉ người nhận: {data.shippingAddress}</h3>
          <h3>Số điện thoại: {data.phoneNumber}</h3>
          <h3>Ngày đặt hàng: {convertTime(data.orderDate)}</h3>
          <h3>Trạng thái: 
            {data.status==="pending"&&" Đang xử lý"}
            {data.status==="confirmed"&&" Đã thanh toán"}
            {data.status==="canceled"&&" Đã huỷ"}
          </h3>
          
          <h3>Mã ưu đãi: {data.offerId|| "không"}</h3>
          <h3>Phương thức thanh toán: {data.paymentMethod ==="COD"?"thanh toán trực tiếp":"VNPAY"}</h3>
          <h3>{data.detail&&"Ghi chú :"} {data.detail}</h3>
          {user?.role==="GENERAL"?
          <p className="text-red-500">
            Bạn chỉ có thể sửa đổi thông tin đơn hàng hoặc huỷ đơn hàng trong 1 giờ kể từ khi đặt hàng.
            Vui lòng liên hệ với chúng tôi để hỗ trợ khi cần thiết.
          </p>:""}
        </div>
      </div>
    </div>
  );
};

export default DetailsOrders;
