import React, { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadProductImage from "../helpers/uploadProductImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { editProduct } from "../store/productSlice";
import TextEditor from "./TextEditor";
import { useDispatch, useSelector } from "react-redux";
const AdminEditProduct = ({ onClose,fetchdata,productData}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    ...productData,
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [categories, setCategories] = useState([]);
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
    console.log(data);
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadProductImage(file);

    setData((preve) => {
      return {
        ...preve,
        productImage: [...preve.productImage, uploadImageCloudinary.url],
      };
    });
  };

  const handleDeleteProductImage = async (index) => {
    console.log("image index", index);

    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((preve) => {
      return {
        ...preve,
        productImage: [...newProductImage],
      };
    });
  };

  // const handleChange=(e)=>{
  //     setData((preve) => {
  //     return {
  //       ...preve,
  //       description:e.target.value
  //     };
  //   });
  // }
  const validateData = () => {
    if (!data.productName.trim()) {
      toast.error("Tên vật tư không được để trống");
    }
    if (!data.brandName.trim()) {
      toast.error("Tên thương hiệu không được để trống");
      return false;
    }
    if (!data.categoryId) {
      toast.error("Vui lòng chọn danh mục vật tư");
      return false;
    }
    if (!data.productImage.length) {
      toast.error("Vui lòng tải lên ít nhất một ảnh vật tư");
      return false;
    }
    if (!data.description.trim()) {
      toast.error("Mô tả vật tư không được để trống");
      return false;
    }
    if (!data.sellingPrice || isNaN(data.sellingPrice) || Number(data.sellingPrice) <= 0) {
      toast.error("Giá bán phải là số lớn hơn 0");
      return false;
    }
    // if (!data.stockQuantity || isNaN(data.stockQuantity) || Number(data.stockQuantity) < 0) {
    //   toast.error("Số lượng tồn kho phải là số không âm"));
    //   return false;
    // }
    return null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
     const errorMessage = validateData();
    if(!errorMessage){
    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(data)
    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
        dispatch(editProduct({
      _id: responseData.data._id,
      productData: responseData.data,
    }));
      fetchdata()
      console.log(responseData.data)
      setData((prevData) => ({ ...prevData, ...responseData.data }));
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  }else{
    toast.error(errorMessage)
  }
  };
  useEffect(() => {
    productCategory().then((data) => setCategories(data));
  }, []);

  return (
    <div className="fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Sửa vật tư</h2>
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
          <label htmlFor="productName">Tên vật tư :</label>
          <input
            type="text"
            id="productName"
            placeholder="Nhập tên vật tư "
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="brandName" className="mt-3">
          Nhà cung cấp
          </label>
          <input
            type="text"
            id="brandName"
            placeholder="Nhập tên nhà cung cấp"
            value={data.brandName}
            name="brandName"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="category" className="mt-3">
            Danh mục vật tư:
          </label>
          <select
            required
            value={data?.categoryId}
            name="categoryId"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value={""}>Chọn danh mục vật tư</option>
            {categories &&
              categories.map((el, index) => {
                return (
                  <option value={el._id} key={el.value + index}>
                    {el.categoryName}
                  </option>
                );
              })}
          </select>

          <label htmlFor="productImage" className="mt-3">
            Ảnh:
          </label>
          <label htmlFor="uploadImageInput">
            <div className="p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
              <div className="text-slate-500 flex justify-center items-center flex-col gap-2">
                <span className="text-4xl">
                  <FaCloudUploadAlt />
                </span>
                <p className="text-sm">Tải ảnh lên</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </div>
          </label>
          <div>
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
              <p className="text-red-600 text-xs">Tải ảnh lên</p>
            )}
          </div>

          <label htmlFor="sellingPrice" className="mt-3">
            Giá bán :
          </label>
          <input
            type="number"
            id="sellingPrice"
            placeholder="Nhập giá bán"
            value={data.sellingPrice}
            name="sellingPrice"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="description" className="mt-3">
            Mô tả :
          </label>
          {/* <TextEditor value={data.description} onChange={handleOnChange} /> */}
          <TextEditor
            value={data.description}
            onChange={(val) =>
              setData((prev) => ({ ...prev, description: val }))
            }
          />

          {/* <textarea
            className="h-28 bg-slate-100 border resize-none p-1"
            placeholder="enter product description"
            rows={3}
            onChange={handleOnChange}
            name="description"
            value={data.description}
          >{data.description}</textarea> */}

          <button className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700">
            Cập nhật vật tư
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

export default AdminEditProduct;
