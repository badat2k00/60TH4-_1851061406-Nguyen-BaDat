import React from "react";
import { CgClose } from "react-icons/cg";
const Report = ({ onClose, order }) => {
  return (
    <div className="fixed w-full  h-full bg-slate-200 bg-opacity-55 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3 bg-red-200">
          <h2 className="font-bold text-lg">Phản hồi</h2>
          <div
            className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
            onClick={onClose}
          >
            <CgClose />
          </div>
        </div>

        <div className="bg-red-500 w-full ">
          Vấn đề 
        </div>
        <select name="" id="">
          <option value="">Bảo hành</option>
          <option value="">Huỷ đơn hàng</option>
          <option value="">Đổi/Trả đơn hàng</option>
          <option value="">Tư vấn </option>
          {/* <option value=""></option> */}

        </select>
        <br/>
        <label htmlFor="">Mô tả</label>
        <textarea cols={5} rows={5} className="w-full">
          A
        </textarea>
      </div>
    </div>
  );
};

export default Report;
