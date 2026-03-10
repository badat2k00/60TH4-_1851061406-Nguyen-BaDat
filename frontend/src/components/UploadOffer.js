import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";

import DisplayImage from "./DisplayImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
import { isNaN } from "lodash";

const UploadOffer = ({ onClose, fetchData }) => {
  const nowInputFormat = moment().format("DD-MM-YYYYTHH:mm");
  const [data, setData] = useState({
    code: "",
    detail: "",
    discountType: "",
    discountValue: "",
    expireDate: nowInputFormat,
    maxDiscountMoney: "",
    isActive: "",
  });
  const [error, setError] = useState("");
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
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
      const response = await fetch(SummaryApi.createOffer.url, {
        method: SummaryApi.createOffer.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        onClose();
        toast.success(responseData?.message);
        fetchData();
      }

      if (responseData.error) {
        toast.error(responseData?.message);
      }
    }
  };
  useEffect(() => {
    let errorMsg="";
    const maxDiscount = parseFloat(data.maxDiscountMoney);
    const numValue=parseFloat(data.discountValue);
    if (data.code.trim()==="") {
      errorMsg="Bạn vui lòng nhập mã ưu đãi";
    }else if(data.detail.trim()=== ""){
      errorMsg="Bạn vui lòng nhập mô tả";
    }else if(data.maxDiscountMoney===""||isNaN(data.maxDiscount)||maxDiscount<100){
      errorMsg="Bạn vui lòng nhập giá trị giảm giá lớn nhất có thể(số lớn hơn 100)";
    }else if(data.expireDate===""){
      errorMsg="Bạn vui lòng chọn ngày hết hạn cho ưu đãi"
    }else if(data.discountType===""){
      errorMsg="Bạn vui lòng chọn loại ưu đãi";
    }else if(data.discountValue===""){
     errorMsg = "Bạn vui lòng nhập giá trị giảm giá.";
    }
    else{
      if (data.discountType==="percentage") {
        if(isNaN(numValue)||numValue<0||numValue>100){
          errorMsg="Giá trị giảm giá phần trăm phải từ 0 đến 100.";
        }
      }else if(data.discountType==="fixed") {
        if(isNaN(numValue)||numValue<1000||numValue>1000000) {
          errorMsg="Giá trị giảm giá cố định phải từ 1.000 đến 1.000.000.";
        }
      }
    }
    setError(errorMsg);
  }, [data.discountType, data.discountValue, data.detail, data.code,data.expireDate,data.maxDiscountMoney]);

  return (
    <div className="fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Thêm ưu đãi</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>
        <form
          className="grid p-4 gap-2 overflow-y-scroll h-full pb-5"
          onSubmit={handleSubmit}
        >
          <label htmlFor="code">Mã ưu đãi:</label>
          <input
            type="text"
            id="code"
            placeholder="Nhập mã ưu đãi"
            name="code"
            value={data.code}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />
          <label htmlFor="discountType" className="mt-3">
            Loại ưu đãi :
          </label>
          <select
            id="discountType"
            name="discountType"
            value={data.discountType}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded mt-2"
            required
          >
            <option value="" disabled>
              Chọn loại ưu đãi
            </option>
            <option value="percentage">Giảm giá theo %</option>
            <option value="fixed">Giảm giá trực tiếp</option>
          </select>
          <label htmlFor="discountValue" className="mt-3">
            Giá trị ưu đãi :
          </label>
          <input
            type="text"
            id="discountValue"
            placeholder="Nhập giá trị ưu đãi"
            value={data.discountValue}
            name="discountValue"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />
          {/* {error !== "" && <h1 className="text-red-500">{error}</h1>} */}
          <label htmlFor="maxDiscountMoney" className="mt-3">
            Giảm giá tối đa
          </label>
          <input
            type="text"
            id="maxDiscountMoney"
            placeholder="Nhập giá trị giảm giá tối đa"
            value={data.maxDiscountMoney}
            name="maxDiscountMoney"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            // required
          />
          <label htmlFor="expireDate" className="mt-3">
            Ngày hết hạn
          </label>
          <input
            type="datetime-local"
            id="meeting-time"
            name="expireDate"
            value={data.expireDate}
            min={nowInputFormat}
            onChange={handleOnChange}
          />
          {/* <div>
            {data?.productImage[0] ? (
              <div className="flex items-center gap-2">
                {data.productImage.map((el, index) => {
                  return (
                    <div className="relative group">
                      <img
                        src={el}
                        alt={el}
                        width={80}
                        height={80}
                        className="bg-slate-100 border cursor-pointer"
                        onClick={() => {
                          setOpenFullScreenImage(true);
                          setFullScreenImage(el);
                        }}
                      />

                      <div
                        className="absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer"
                        onClick={() => handleDeleteProductImage(index)}
                      >
                        <MdDelete />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-red-600 text-xs">
                {t("*Please upload product image")}
              </p>
            )}
          </div> */}
          <label htmlFor="detail" className="mt-3">
            Mô tả :
          </label>
          <textarea
            className="h-28 bg-slate-100 border resize-none p-1"
            placeholder="Nhập mô tả"
            rows={3}
            onChange={handleOnChange}
            name="detail"
            value={data?.detail}
          ></textarea>
          <button className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700">
            Tạo mới 
          </button>
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

export default UploadOffer;
