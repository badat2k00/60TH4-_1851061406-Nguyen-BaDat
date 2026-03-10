import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";

const AdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      dispatch(setUserDetails(null));
    }
    if (data.error) {
      console.log(data.error);
    }
  };

  useEffect(() => {
    if (user?.role !== ROLE.ADMIN || user?.role === "undefined") {
      navigate("/");
    }
    const handlePopState = () => {
      navigate("/login");
      logout();
      // Nếu người dùng cố quay lại, điều hướng về trang "giỏ hàng" chẳng hạn
    };

    window.addEventListener("popstate", handlePopState);
  }, [user, navigate]);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/login");
    }

    if (data.error) {
      toast.error(
        data.message);
    }
  };
  return (
    <div className="min-h-full md:flex hidden">
      <aside className="bg-white min-h-full  w-full p-2 max-w-60 customShadow">
        <div className="h-32  flex justify-center items-center flex-col">
          <div className="text-5xl cursor-pointer  flex justify-center">
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
          <nav className="grid p-4 ">
            <Link
              to={"/admin-panel/personal-information"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Thông tin cá nhân
            </Link>
            <Link
              to={"/admin-panel/all-users"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Quản lý Người dùng
            </Link>
            <Link
              to={"/admin-panel/all-offers"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Quản lý ưu đãi{" "}
            </Link>
            <Link
              to={"/admin-panel/all-products"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Quản lý vật tư
            </Link>
            <Link
              to={"/admin-panel/all-categories"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Quản lý danh mục vật tư
            </Link>
            <Link
              to={"/admin-panel/statistic"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Thống kê
            </Link>
            <Link
              to={"/admin-panel/all-orders"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Quản lý đơn hàng
            </Link>
            <Link
              to={"/admin-panel/add-supply"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Nhập hàng
            </Link>
            <Link
              to={"/admin-panel/change-password"}
              className="px-2 py-1 hover:bg-slate-100"
            >
              Đổi mật khẩu
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 mt-32"
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </aside>

      <main className="w-full h-full p-2">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
