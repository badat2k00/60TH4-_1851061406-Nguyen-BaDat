import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import DisplayImage from "./DisplayImage";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import moment from "moment";
// import moment from 'moment-timezone';
const AdminEditOffer = ({ onClose, productData }) => {
  // console.log(productData)
  // const nowInputFormat = moment().format("DD-MM-YYYYTHH:mm");
  const nowInputFormat = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DDTHH:mm");

  // const[nowInputFormat,setNowInputFormat]=useState("")
  const [data, setData] = useState({
    ...productData
  });
  const [error, setError] = useState({});
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");


  // Kiểm tra lỗi cho từng trường
  const validate = () => {
    let errors = {};
    
    // Kiểm tra nếu discountValue rỗng hoặc không hợp lệ
    if (!data.discountValue || isNaN(data.discountValue)) {
      errors.discountValue = "Giá trị ưu đãi phải là một số hợp lệ.";
    }

    // Kiểm tra lỗi cho discountType
    if (!data.discountType) {
      errors.discountType = "Chọn loại ưu đãi.";
    }

    // Kiểm tra ngày hết hạn
    if (!data.expireDate) {
      errors.expireDate = "Chọn ngày hết hạn.";
    } else if (!moment(data.expireDate, "YYYY-MM-DDTHH:mm").isValid()) {
      errors.expireDate = "Ngày hết hạn không hợp lệ.";
    }else if (moment.tz(data.expireDate, "YYYY-MM-DDTHH:mm", "Asia/Ho_Chi_Minh").isBefore(nowInputFormat)) {
    errors.expireDate = "Thời gian hết hạn phải lớn hơn thời điểm hiện tại.";
    }

    // Kiểm tra maxDiscountMoney (nếu có)
    if (data.maxDiscountMoney && isNaN(data.maxDiscountMoney)) {
      errors.maxDiscountMoney = "Giảm giá tối đa phải là một số hợp lệ.";
    }
 if (data.discountValue) {
      // Kiểm tra để tránh lỗi khi giá trị rỗng
      const numValue = parseFloat(data.discountValue); // Chuyển đổi một lần

      if (data.discountType === "percentage") {
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        errors.discountValue="Giá trị giảm giá phần trăm phải từ 0 đến 100.";
        } 
        
      } else if (data.discountType === "fixed") {
        if (isNaN(numValue) || numValue < 1000 || numValue > 1000000) {
           errors.discountValue="Giá trị giảm giá cố định phải từ 1.000 đến 1.000.000.";
        } 
        
      }
    
    }
     
    
    return errors;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      console.log(validationErrors)
      toast.error("Vui lòng sửa các lỗi trước khi gửi.");
    } else {

      const response = await fetch(SummaryApi.updateOffer.url, {
        method: SummaryApi.updateOffer.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({...data}),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData?.message);
        onClose();
        // setData(responseData.data)
      }

      if (responseData.error) {
        toast.error(responseData?.message);
      }
    }
  };
//  useEffect(() => {
//     if (data.discountValue) {
//       // Kiểm tra để tránh lỗi khi giá trị rỗng
//       const numValue = parseFloat(data.discountValue); // Chuyển đổi một lần

//       if (data.discountType === "percentage") {
//         if (isNaN(numValue) || numValue < 0 || numValue > 100) {
//           setError("Giá trị giảm giá phần trăm phải từ 0 đến 100.");
//         } else {
//           setError(""); // Xóa lỗi nếu hợp lệ
//         }
//       } else if (data.discountType === "fixed") {
//         if (isNaN(numValue) || numValue < 1000 || numValue > 1000000) {
//           setError("Giá trị giảm giá cố định phải từ 1.000 đến 1.000.000.");
//         } else {
//           setError(""); // Xóa lỗi nếu hợp lệ
//         }
//       }
    
//     }
//      else {
//       setError(""); // Nếu discountValue rỗng thì clear error
//     }
//   }, [data.discountType, data.discountValue]);
  // useEffect(() => {
    // Lấy thời gian hiện tại và định dạng lại về chuẩn datetime-local
    // const formattedDate = moment().format("DD-MM-YYYYTHH:mm");
    // setNowInputFormat(moment(formattedDate, "DD-MM-YYYYTHH:mm").format("YYYY-MM-DDTHH:mm"));
    // console.log(nowInputFormat)
  // }, []);
  const getExpireDateForInput = (date) => {
    return moment.utc(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DDTHH:mm");
  };

  return (
    <div className="fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Sửa ưu đãi </h2>
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
          {error.discountType && <div className="text-red-500">{error.discountType}</div>}

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
          {error.discountValue && <div className="text-red-500">{error.discountValue}</div>}

          <label htmlFor="maxDiscountMoney" className="mt-3">
            Giảm giá tối đa
          </label>
          <input
            type="text"
            id="maxDiscountMoney"
            placeholder="Nhập mức giá giảm lớn nhất"
            value={data.maxDiscountMoney}
            name="maxDiscountMoney"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          />
          {error.maxDiscountMoney && <div className="text-red-500">{error.maxDiscountMoney}</div>}

          <label htmlFor="expireDate" className="mt-3">
            Ngày hết hạn
          </label>
          {data.expireDate}
          <input
            type="datetime-local"
            id="expireDate"
            name="expireDate"
            // value={data.expireDate}
             value={data.expireDate ? getExpireDateForInput(data.expireDate) : ''}
            min={nowInputFormat}
            onChange={handleOnChange}
          />
          {error.expireDate && <div className="text-red-500">{error.expireDate}</div>}

          <label htmlFor="detail" className="mt-3">
            Mô tả :
          </label>
          <textarea
            className="h-28 bg-slate-100 border resize-none p-1"
            placeholder="Mô tả"
            rows={3}
            onChange={handleOnChange}
            name="detail"
            value={data.detail}
          ></textarea>

          <button
            className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700"
          >
            Sửa
          </button>
        </form>
      </div>


      {openFullScreenImage && (
        <DisplayImage
          onClose={() => setOpenFullScreenImage(false)}
          imgUrl={fullScreenImage}
        />
      )}
    </div>
  );
};

export default AdminEditOffer;
