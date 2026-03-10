import React, { useState, useEffect } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadProductImage from "../helpers/uploadProductImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import imageTobase64 from "../helpers/imageTobase64";
import { addNewProduct } from "../store/productSlice";
import { useDispatch } from "react-redux";
import TextEditor from "./TextEditor";
const UploadProduct = ({ onClose, fetchData,searchProduct}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    productName: searchProduct,
    brandName: "",
    categoryId: "",
    productImage: [],
    description: "",
  
    sellingPrice: "",
    stockQuantity: "",
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [category, setCategory] = useState([]);
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    dispatch(addNewProduct(data))
    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
      // dispatch(getAllProducts(responseData.updateProducts))
      // console.log(data)
      
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  useEffect(() => {
    productCategory().then((data) => setCategory(data));
  }, []);
  return (
    <div className="fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden">
        <div className="flex justify-between items-center pb-3">
          <h2 className="font-bold text-lg">Thêm vật tư</h2>
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
            placeholder="Nhập tên vật tư"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />

          <label htmlFor="productName">Số lượng :</label>
          <input
            type="number"
            id="productName"
            placeholder="Nhập số lượng tồn"
            name="stockQuantity"
            value={data.stockQuantity}
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
            required
          />
          <label htmlFor="brandName" className="mt-3">
            Thương hiệu:
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
            Danh mục vật tư :
          </label>
 
          <select
            value={data?.categoryId}
            name="categoryId"
            onChange={handleOnChange}
            className="p-2 bg-slate-100 border rounded"
          >
            <option value={""}>Chọn danh mục vật tư</option>
            {category.map((el, index) => {
              return (
                <option value={el._id} key={el.value + index}>
                  {el.categoryName}
                </option>
              );
            })}
          </select>

          <label htmlFor="productImage" className="mt-3">
            Ảnh vật tư :
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
              <p className="text-red-600 text-xs">
                Vui lòng tải ảnh vật tư 
              </p>
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
 
          <TextEditor
            value={data.description}
            onChange={(val) =>
              setData((prev) => ({ ...prev, description: val }))
            }
          />
          <button className="px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700">
            Tạo vật tư 
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

export default UploadProduct;
