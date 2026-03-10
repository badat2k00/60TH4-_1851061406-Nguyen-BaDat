import React from 'react'

import { useSelector, useDispatch } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";
import Statistic from '../pages/Statistic';
const EmployeeHome = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(t(data.message));
      dispatch(setUserDetails(null));
      navigate("/login");
    }

    if (data.error) {
      toast.error(t(data.message));
    }
  };
  return (
    <div className="min-h-full md:flex hidden">
    <aside className="bg-white min-h-full  w-full  max-w-60 customShadow">
      <div className="h-32  flex justify-center items-center flex-col">
        <div className="text-5xl cursor-pointer relative flex justify-center">
          {user?.profilePic ? (
            <img
              src={user?.profilePic}
              className="w-20 h-20 rounded-full"
              alt={user?.name}
            />
          ) : (
            <FaRegCircleUser />
          )}
        </div>
        <p className="capitalize text-lg font-semibold">{user?.name}</p>
        <p className="text-sm">{user?.role}</p>
      </div>

      {/***navigation */}
      <div>
        <nav className="grid p-4">
          <Link
                       to={"/employee-panel/personal-information"}
                       className="px-2 py-1 hover:bg-slate-100"
                     >
                       Thông tin cá nhân 
                     </Link>
                     <Link to={"/employee-panel/all-users"} className="px-2 py-1 hover:bg-slate-100">
                       Quản lý Người dùng
                     </Link>
                     <Link to={"/employee-panel/all-offers"} className="px-2 py-1 hover:bg-slate-100">Quản lý ưu đãi </Link>
                     {/* <Link to={"/employee-panel/all-products"} className="px-2 py-1 hover:bg-slate-100">
                       Quản lý vật tư 
                     </Link> */}
                    
                     <Link to={"/employee-panel/statistic"} className="px-2 py-1 hover:bg-slate-100">
                       Thống kê 
                     </Link>
                     <Link to={"/employee-panel/all-orders"} className="px-2 py-1 hover:bg-slate-100">
                       Quản lý đơn hàng
                     </Link>
                     
                     <button
                       onClick={handleLogout}
                       className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
                     >
                       Đăng xuất
                     </button>
        </nav>
      </div>
    </aside>
    <main className="w-full h-full p-2">
        <Statistic/>
      </main>
</div>
  )
}

export default EmployeeHome