import React ,{useState}from 'react'
import PaginatedItems from "../components/PaginatedItems";
import ROLE from "../common/role";
const AllOrderPaid = () => {
    const [currentItems, setCurrentItems] = useState(0);
  return (
    <div> {user?.role === ROLE.GENERAL  && (
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
                <th>Hello</th>
              </tr>
            </thead>
            <tbody className="">
              {currentItems&&currentItems.map((order, index) => (
                <tr key={index}>
                  <td>{order._id}</td>
                  <th>
                    <button
                      className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
                      onClick={() => handleDetailOrder(order)}
                    >
                      Details
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
                      <>  <button onClick={handlePayment}>
                          Thanh toán 
                        </button>
                        {/* <Link to={`/payment/${order?._id}`}>Đặt hàng</Link> */}
                        </>
                      )}
                      {order.status==="completed" &&" Phản hồi "}
                    {order.status === "canceled" && "Xóa Đơn"}{" "}
                    {
                      order.status === "pending" &&
                      "Hủy đơn " && <button
                      className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
                      onClick={() => handleDeleteOrder(order)}
                    >
                      Hủy đơn 
                    </button>}
                    {order.status==="confirmed"&&"Đổi /Trả hàng "}
                  </td>

                 
                 
                  {/* <td><UpdateOrder order={order} isUpdate={isUpdate} fetchOrdersByUser={fetchOrdersByUser()}/>Sửa</td> */}
                  <td>
                    <Link to={`/update/${order?._id}`}>Sửa</Link>
                  </td>
                  <td>
                 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}</div>
  )
}

export default AllOrderPaid