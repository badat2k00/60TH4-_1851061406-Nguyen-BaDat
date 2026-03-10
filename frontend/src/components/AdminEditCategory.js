import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory } from "../store/categorySlice"; // Update category action
import { toast } from "react-toastify";
import SummaryApi from "../common";

const AdminEditCategory = ({ onClose, categoryId,fetchData }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories); // Get categories from Redux state

  // Find the category to edit by categoryId
  const category = categories.find((cat) => cat._id === categoryId);
  const [data, setData] = useState({
    categoryName:  "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      // If the category is found, set it in the form field
      setData({
        categoryName: category.categoryName,
      });
    }
  }, [category]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.categoryName === "") {
      setError("Tên danh mục không được để trống!");
      toast.error("Tên danh mục không được để trống!");
      return;
    }

    try {
      const response = await fetch(SummaryApi.updateCategory.url, {
        method: SummaryApi.updateCategory.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           categoryId,
          categoryName: data.categoryName,
        }),
      });

      const responseData = await response.json();
      console.log(responseData.data)
      if (responseData.success) {
        toast.success(responseData.message);
        // After success, update the Redux store
        dispatch(updateCategory({ categoryId, categoryName: data.categoryName }));
        onClose();
        fetchData()
      } else {
        toast.error(responseData.message || "Có lỗi xảy ra khi cập nhật danh mục");
        console.log(responseData.message)
      }
    } catch (error) {
      toast.error("Có lỗi khi kết nối tới server");
    }
  };

  return (
    <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-1/4 h-1/3 overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Sửa danh mục vật tư</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form className="grid p-4 gap-2 h-full pb-5" onSubmit={handleSubmit}>
          <label htmlFor="categoryName" className="mt-3">
            Tên danh mục:
          </label>
          <input
            className="bg-slate-100 p-2"
            placeholder="Nhập tên danh mục "
            rows={3}
            onChange={handleOnChange}
            name="categoryName"
            value={data.categoryName}
          />

          <div className="text-center">
            <button className="px-5 py-2 bg-red-600 text-white mb-10 hover:bg-red-700 rounded-full">
              Sửa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditCategory;
