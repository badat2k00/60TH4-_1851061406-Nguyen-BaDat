import {
  createBrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import AdminPanel from "../pages/AdminPanel";
import EmployeePanel from "../pages/EmployeePanel";
import AdminHome from "../components/AdminHome";
import AllUsers from "../pages/AllUsers";
import AllProducts from "../pages/AllProducts";
import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import Payment from "../pages/Payment";
import Statistic from "../pages/Statistic";
import NotFound from "../pages/NotFound";
import PersonalInformation from "../pages/PersonalInformation";
import UserPanel from "../pages/UserPanel";
import AllOrders from "../pages/AllOrders";
import AddSupply from "../pages/AddSupply";
import ResetPassword from "../pages/ResetPassword";
// import FavoriteProduct from "../pages/FavoriteProduct";
import ReturnUrl from "../pages/ReturnUrl";
// import ChangePin from "../pages/ChangePIN";
// import VerticationUser from "../pages/VerticationUser";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
// import UpdateOrder from "../pages/UpdateOrder";
import SummaryApi from "../common";
import AllOffers from "../pages/AllOffers";
import ChangePassword from "../pages/ChangePassword";
import AllCategories from "../pages/AllCategories";
import CheckOrder from "../pages/CheckOrder";
import EmployeeHome from "../components/EmployeeHome";

const Router = () => {
  const currentUser = useSelector((state) => state?.user?.user);
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route
          index
          element={
            currentUser?.role === "ADMIN" ? (
              <AdminHome />
            ) : currentUser?.role === "EMPLOYEE" ? (
              <EmployeeHome />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="home"
          element={
            currentUser?.role === "ADMIN" ? (
              <AdminHome />
            ) : currentUser?.role === "EMPLOYEE" ? (
              <EmployeeHome />
            ) : (
              <Home />
            )
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route
          path="product-category"
          element={currentUser?.role !== "ADMIN" && <CategoryProduct />}
        />
        <Route
          path="product/:id"
          element={currentUser?.role !== "ADMIN" && <ProductDetails />}
        />
        <Route
          path="cart"
          element={currentUser?.role !== "ADMIN" ? <Cart /> : <NotFound />}
        />
        <Route path="search" element={<SearchProduct />} />
        <Route
          path="payment/:id?"
          element={currentUser?.role !== "ADMIN" ? <Payment /> : <NotFound />}
        />
        <Route path="reset-password" element={<ResetPassword />} />
        {/* <Route path="favorite-product" element={<FavoriteProduct />} /> */}
        <Route path="returnUrl" element={<ReturnUrl />} />
        {/* <Route path="verifyaccount" element={<VerticationUser />} /> */}
        <Route
          path="user"
          element={currentUser?.role !== "ADMIN" ? <UserPanel /> : <NotFound />}
        >
          <Route
            path="personal-information"
            element={<PersonalInformation />}
          />
          <Route path="all-orders" element={<AllOrders />} />
          <Route path="all-offers" element={<AllOffers />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {currentUser?.role !== "ADMIN" && (
          <Route path="check-status-order" element={<CheckOrder />} />
        )}
        <Route
          path="admin-panel"
          element={
            currentUser?.role === "ADMIN" ? <AdminPanel /> : <NotFound />
          }
        >
          <Route
            index
            element={
              currentUser?.role === "ADMIN" ? <AdminHome /> : <NotFound />
            }
          />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="all-products" element={<AllProducts />} />
          <Route path="statistic" element={<Statistic />} />
          <Route path="all-offers" element={<AllOffers />} />
          <Route path="all-categories" element={<AllCategories />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="add-supply" element={<AddSupply />} />
          <Route
            path="personal-information"
            element={
              currentUser?.role === "ADMIN" ? (
                <PersonalInformation />
              ) : (
                <NotFound />
              )
            }
          />
          <Route path="all-orders" element={<AllOrders />} />
        </Route>

        <Route
          path="employee-panel"
          element={
            currentUser?.role === "EMPLOYEE" ? <EmployeePanel /> : <NotFound />
          }
        >
          <Route
            index
            element={
              currentUser?.role === "EMPLOYEE" ? <EmployeeHome /> : <NotFound />
            }
          />
          <Route path="all-users" element={<AllUsers />} />
          <Route path="statistic" element={<Statistic />} />
          <Route path="all-offers" element={<AllOffers />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="personal-information"
            element={
              currentUser?.role === "EMPLOYEE" ? (
                <PersonalInformation />
              ) : (
                <NotFound />
              )
            }
          />
          <Route path="all-orders" element={<AllOrders />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default Router;
