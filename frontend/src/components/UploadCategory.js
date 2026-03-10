import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";

import DisplayImage from "./DisplayImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const UploadCategory = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    categoryName: "",
  });
  const [error, setError] = useState("");
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const { t } = useTranslation();

  const checkValue = (type, value) => {};
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

    if (error !== "") {
      // console.log(data.discountType)
      toast.error(error);
      console.log(error);
    } else {
      const response = await fetch(SummaryApi.createCategory.url, {
        method: SummaryApi.createCategory.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData?.message);
        onClose();
        fetchData();
      }

      if (responseData.error) {
        toast.error(responseData?.message);
      }
    }
  };
  //   useEffect(() => {
  //     if (data.discountValue) { // Kiểm tra để tránh lỗi khi giá trị rỗng
  //         const numValue = parseFloat(data.discountValue); // Chuyển đổi một lần

  //         if (data.discountType === "percentage") {
  //             if (isNaN(numValue) || numValue < 0 || numValue > 100) {
  //                 setError("Giá trị giảm giá phần trăm phải từ 0 đến 100.");
  //             } else {
  //                 setError(""); // Xóa lỗi nếu hợp lệ
  //             }
  //         } else if (data.discountType === "fixed") {
  //             if (isNaN(numValue) || numValue < 1000 || numValue > 1000000) {
  //                 setError("Giá trị giảm giá cố định phải từ 1.000 đến 1.000.000.");
  //             } else {
  //                 setError(""); // Xóa lỗi nếu hợp lệ
  //             }
  //         }
  //     } else {
  //       setError(""); // Nếu discountValue rỗng thì clear error
  //     }
  // }, [data.discountType, data.discountValue]);

  return (
    <div className="fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center ">
      <div className="bg-white p-4 rounded w-1/4 h-1/3  overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Tạo danh mục vật tư</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <form
          className="grid p-4 gap-2  h-full pb-5"
          onSubmit={handleSubmit}
        >
          <label htmlFor="description" className="mt-3">
            Tên danh mục:
          </label>
          <input
            className=" bg-slate-100 p-2"
            placeholder="Nhập tên danh mục "
            rows={3}
            onChange={handleOnChange}
            name="categoryName"
            value={data?.categoryName}
          />

          <div className="text-center">
            <button className="px-5 py-2 bg-red-600 text-white mb-10 hover:bg-red-700 rounded-full">
              Thêm
            </button>
          </div>
        </form>
      </div>

      {/***display image full screen */}

     
      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default UploadCategory;
