import React, { useContext, useState } from "react";

import { GrSearch } from "react-icons/gr";
import { CiLogout } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import logo from "../logo.jpg"
import ROLE from "../common/role";
import Context from "../context";

// import i18n from "../i18n";
// import { useTranslation } from "react-i18next";
const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  // console.log(searchQuery)
  const [search, setSearch] = useState(searchQuery);
  // const { t } = useTranslation();
  // const [lng, setLng] = useState(i18n.language);
  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };

  // const toggleLanguage = () => {
  //   const newLng = lng === "en" ? "vi" : "en";
  //   i18n.changeLanguage(newLng);
  //   setLng(newLng);
  // };

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);


  };
  const handleSearchByBar=(e)=>{
    if (search !=="") {
      navigate(`/search?q=${search}`);
      
    } else {
      toast.error("Vui lòng nhập tên vật tư vào ô tìm kiếm")
      // navigate("/search");
    }
  }
  return (

    <>
      <header className="p-3 bg-lime-600 w-full z-40 ">
        <div className="h-auto container mx-auto flex items-center px-4 justify-between ">
          <Link to="/">
            {/* <Logo w={90} h={50} /> */}
            <div className="flex items-center justify-center ">
              <div className="w-[50px] h-[50px] flex justify-center items-center text-lg">
              <img src={logo} alt="" className="w-full h-full rounded-full"  />
              </div>
            </div>
          </Link>

          <div className="flex items-center  ml-64  max-w-md border rounded-full pl-2 mx-4 bg-white">
            <input
              type="text"
              placeholder="Tìm vật tư ở đây..."
              className="w-full outline-none px-2"
              onChange={handleSearch}
              value={search}
            />
            <div className="text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white cursor-pointer">
              <GrSearch onClick={handleSearchByBar}/>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-7">
            <div className="relative flex justify-center">
              {user?._id && (
                <div
                  className="text-3xl cursor-pointer relative flex justify-center"
                  onClick={() => setMenuDisplay((prev) => !prev)}
                >
                  {user?.profilePic ? (
                    <img
                      src={user?.profilePic}
                      className="w-7 h-7 rounded-full"
                      alt={user?.name}
                    />
                  ) : (
                    <FaRegCircleUser className="text-gray-50"/>
                  )}
                </div>
              )}

              {menuDisplay && (
                <div className="absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded">
                  <nav>
                   

                    {user?.role === ROLE.GENERAL && (
                      <>
                        <Link
                          to="/user/personal-information"
                          className="whitespace-nowrap hidden md:block hover:bg-slate-100 p-2"
                          onClick={() => setMenuDisplay((prev) => !prev)}
                        >
                          Tài khoản
                        </Link>
                       
                      </>
                    )}
                  </nav>
                </div>
              )}
            </div>

            {user?._id && (
              <Link to="/cart" className="text-2xl relative">
                <span>
                  <FaShoppingCart className="text-white"/>
                </span>

                <div className="bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3">
                  <p className="text-sm">{context?.cartProductCount}</p>
                </div>
              </Link>
            )}

            <div className="flex gap-4">
              {user?._id ? (
                
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 text-sm"
                >
				<CiLogout className="lg:hidden" size={18}/>
                <span className="hidden lg:block">Đăng xuất</span>
                </button>
              ) : (
                <>
                <Link to="/check-status-order"className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700">Kiểm tra đơn hàng</Link>
                <Link
                  to="/login"
                  className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700"
                >
                  <span className="hidden lg:block">Đăng nhập</span>
                </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
