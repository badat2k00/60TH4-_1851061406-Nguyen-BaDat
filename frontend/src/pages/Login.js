import React, { useContext, useEffect, useState } from "react";
import logo from "../logo.jpg"
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { Slide, toast } from "react-toastify";
import Context from "../context";
import { FcGoogle } from "react-icons/fc";
import { useTranslation } from "react-i18next";
const Login = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

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
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if(!data.email || !data.password){
      toast.error("Vui lòng nhập đủ email và password")
    }
    else if(!data.email.includes("@") || !data.email.includes(".")){
      toast.error("Email không hợp lệ")
    }
    else{
    const dataResponse = await fetch(SummaryApi.signIn.url, {
      method: SummaryApi.signIn.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      toast.success(t(dataApi.message));
      const userDetails = await fetchUserDetails();
      
      if (userDetails?.data?.role ==="ADMIN") {
        console.log(userDetails.data.role)
        navigate("/admin-panel")
      }else{
        navigate("/")
        fetchUserAddToCart();
      }
        
    
    }

    if (dataApi.error) {
      toast.error(t(dataApi.message));
    }
  }
  };
 
  const handleLogin = async () => {
	let url=`${process.env.REACT_APP_REDIRECT_URI}/oauth`;
    const res = await fetch(url, { method: "post" });
    const data = await res.json();
    nav(data.url);
    navigate("/");
    fetchUserDetails();
    fetchUserAddToCart();
  };
  function nav(url) {
    window.location.href = url;
  }
  return (
    <section id="login " className="h-full">
      <div className="mx-auto my-3 container p-4 flex justify-center items-center h-full ">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={logo} alt="login icons" className="rounded-full"/>
          </div>

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              {/* <label>{t("email")} : </label> */}
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              {/* <label>{t("password")} : </label> */}
              <div className="bg-slate-100 p-2 flex mb-1 ">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              <Link
                to={"/forgot-password"}
                className="block w-fit mx-auto hover:underline hover:text-red-600"
              >
                {t("forgotpassword")}?
              </Link>
            </div>

            <div className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full rounded-md text-center transition-all mx-auto block mt-2">
              <button>{t("login")}</button>
            </div>

            <p className="my-5 mx-auto">
              {t("donthaveaccount")}?{" "}
              <Link
                to={"/sign-up"}
                className=" text-red-600 hover:text-red-700 hover:underline"
              >
                {t("signup")}
              </Link>
            </p>
          </form>
          <fieldset
            style={{
              borderTop: "1px solid black",
              textAlign: "center",
              padding: " 0.5em ",
            }}
          >
            <legend
              style={{
                backgroundColor: "white",
                padding:"0 5px"
              }}
            >
              Hoặc
            </legend>
          </fieldset>

          <div className="rounded-md bg-black text-white p-2 flex items-center justify-center relative  hover:cursor-pointer" onClick={() => handleLogin()}>
            <FcGoogle className="absolute left-2"/>
            <button  className="text-center">Đăng nhập bằng Google</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
