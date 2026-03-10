import React, { useState } from "react";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import imageTobase64 from "../helpers/imageTobase64";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import logo from "../logo.jpg";
const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = data;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if(!name || !email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return 
    }
    if(!email.includes("@") || !email.includes(".")) {
      toast.error("Email không hợp lệ");
      return 
    }
    if(!regex.test(password)) {
      toast.error("Mật khẩu mới phải có tối thiểu 8 ký tự, 1 ký tự in hoa ,1 ký tự thường ");
      return 
    }
    if(password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận phải trùng với mật khẩu ");
      return 
    }
    else{
    try {
      const res = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/login");
      } else if (result.error) {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi đăng ký");
    }
  }
  };

  return (
    <section id="signup" className="h-full flex justify-center items-center">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto relative overflow-hidden rounded-full">
            <div>
              <img src={logo} alt="" />
            </div>
            <form>
              <label></label>
            </form>
          </div>

          <form classTên="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Tên: </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  name="name"
                  value={data.name}
                  onChange={handleOnChange}
                
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="grid">
              <label>Email : </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  placeholder="Nhập email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label>Mật khẩu : </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={data.password}
                  name="password"
                  onChange={handleOnChange}
                
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((preve) => !preve)}
                >
                  <span>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>
              </div>
            </div>

            <div>
              <label>Xác nhận mật khẩu: </label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu xác nhận"
                  value={data.confirmPassword}
                  name="confirmPassword"
                  onChange={handleOnChange}
                  
                  className="w-full h-full outline-none bg-transparent"
                />

                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowConfirmPassword((preve) => !preve)}
                >
                  <span>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </div>

            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6">
              Đăng ký
            </button>
          </form>

          <div className="flex justify-center items-center w-full mt-5 gap-2">
            <p className="">
              Đã có tài khoản?{" "}
              </p>
              <Link
                to={"/login"}
                className=" text-red-600 hover:text-red-700 hover:underline"
              >
                Đăng nhập
              </Link>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
