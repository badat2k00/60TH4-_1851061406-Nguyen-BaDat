import { useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [send, setSend] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(email===""){
      toast.error("Vui lòng không để trống")
    }
    if(!email.includes("@")){
      toast.error("Vui lòng nhập email hợp lệ")
    }
    else{
    try {
      const res = await fetch(SummaryApi.sendPassword.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message, {
          autoClose: 5000,
          position: "top-right",
        });
        setSend(true)
      } else {
        toast.error(data.message, {
          autoClose: 5000,
          position: "top-right",
        });
      }
      
    } catch (error) {
      console.log(error);
    }
  }
  };
  // Tạo thêm mã pin để nhập recovery => xóa mật khẩu cũ
  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
      {send ? (
        <div className="text-center">
          <svg className="h-12 w-12 text-blue-500" /* Success icon */></svg>
          <h1 className="text-2xl font-semibold py-4">Email đã được gửi!</h1>
          <p className="text-lg">
            Vui lòng kiểm tra hộp thư đến của bạn để lấy lại mật khẩu.
          </p>
        </div>
      ) : (
        <div className="py-8">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="mx-auto">
              <svg
                className="h-12 w-12 text-blue-500" /* LockOutlinedIcon equivalent */
              ></svg>
            </div>
            <h1 className="text-center text-2xl font-semibold py-4">
              Quên Mật khẩu
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3"
                id="email"
                type="email"
                placeholder="Nhập địa chỉ email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Lấy lại mật khẩu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
