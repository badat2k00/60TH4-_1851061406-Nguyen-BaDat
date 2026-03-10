import React, { useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const ChangePassword = () => {
  const currentUser = useSelector(state => state?.user?.user);
  const [forgotLink,setForgotLink]=useState("")
  const navigate =useNavigate()
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const getForgotLink=()=>{
    
    switch (currentUser?.role) {
      case "GENERAL":
        return '/user/forgot-password'
      case "EMPLOYEE":
        return "/employee-panel/forgot-password"
      case "ADMIN":
        return "/admin-panel/forgot-password"
    }
  }

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  
  const validate = () => {
    let errors = "";
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!data.oldPassword||!data.newPassword||!data.confirmPassword) {
      errors = "Vui lòng nhập đầy đủ thông tin.";
    }

    if (data.newPassword !== data.confirmPassword) {
      errors = "Mật khẩu mới không trùng khớp với mật khẩu xác nhận.";
    }
    if(regex.test(data.newPassword)){
      errors = "Mật khẩu mới phải có tối thiểu 8 ký tự, 1 ký tự in hoa ,1 ký tự in thường ";
    }
    if (errors) {
      setError(errors);
      return false;
    }

    setError("");
    return true;
  };

  const changePassword = async () => {
    try {
      const response = await fetch(SummaryApi.changePassword.url, {
        method: SummaryApi.changePassword.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser._id,
          originpassword: data.oldPassword,
          newPassword: data.newPassword
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
      } else {
        toast.error(responseData.message);
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi trong quá trình đổi mật khẩu.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      changePassword();  
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[500px] h-[500px]  flex flex-col p-8 gap-3">
        <h1 className="text-center text-lg">Đổi mật khẩu </h1>
        <form onSubmit={handleSubmit}>
          <label>Mật khẩu cũ :</label>
          <input
            type="password"
            name="oldPassword"
            value={data.oldPassword}
            onChange={handleChange}
            className="p-2 w-full"
          />
          
            
          {/* <button type="button" className="text-blue-500" onClick={()=>{navigate("/admin-panel/forgot-password")}}>Quên mật khẩu ?</button> */}
          <button type="button" className="text-blue-500" onClick={()=>{navigate(getForgotLink())}}>Quên mật khẩu ?</button>
         
          <br />
          <label htmlFor="">Mật khẩu mới: </label>
          <input
            type="password"
            name="newPassword"
            value={data.newPassword}
            onChange={handleChange}
            className="p-2 w-full"
          />
          <br />
          <label htmlFor="">Xác nhận mật khẩu :</label>
          <input
            type="password"
            name="confirmPassword"
            value={data.confirmPassword}
            onChange={handleChange}
            className="p-2 w-full"
          />
          <div><button type="submit" className="bg-slate-500  mt-4">Lưu thay đổi</button></div>
          
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
