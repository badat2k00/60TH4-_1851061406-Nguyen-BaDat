import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { useDispatch,useSelector } from "react-redux";
import { setAllCategories, deleteCategory, } from "../store/categorySlice";
import UploadCategory from "../components/UploadCategory";
import AdminEditCategory from "../components/AdminEditCategory";
import Modal from "../components/Modal";
const AllCategories = () => {
  // const [categories, setCategories] = useState([]);
   const [editCategory, setEditCategory] = useState(false);
   const [categoryId,setCategoryId]=useState("")
   const [openDeleteCategory,setOpenDeleteCategory]=useState(false);
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const dispatch = useDispatch();
  const categories=useSelector(state=>state.categories.categories)
  const fetchAllCategories = async () => {
    try {
      const response = await fetch(SummaryApi.getAllCategory.url);
      const dataResponse = await response.json();
      if (dataResponse.success) {
        // setCategories(dataResponse.data);
        dispatch(setAllCategories(dataResponse.data));
      }
      if (dataResponse.error) {
        console.log(dataResponse.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const closeDeleteCategory=()=>{
    setOpenDeleteCategory(false)
  }
  const handleDelete = () => {
    deleteCategoryById(categoryId);
    closeDeleteCategory()
  };
  const deleteCategoryById = async (categoryId) => {
    try {
      console.log("Deleting Product ID:", categoryId);
      const response = await fetch(SummaryApi.deleteCategory.url, {
        method: SummaryApi.deleteCategory.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message, {
          position: "top-right",
          autoClose: 5000,
        });
        // Gọi lại fetchdata để cập nhật danh sách sản phẩm sau khi xóa
        dispatch(deleteCategory(categoryId));
        // fetchdata();
      } else {
        toast.error(responseData.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  
  const handleEdit = (category) => {
    setEditCategory(true);
    setCategoryId(category._id)

  };
  useEffect(() => {
    fetchAllCategories();
  }, []);
  return (
    <div className="w-full h-screen flex flex-col gap-2">
      <div className="bg-white py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">Danh mục vật tư</h2>
        <button
          className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all py-1 px-3 rounded-full "
          onClick={() => setOpenUploadCategory(true)}
        >
          Tạo danh mục vật tư mới
        </button>
      </div>

      <div>
        <div className="bg-white">
          <table className="w-full userTable">
            <thead>
              <tr className="bg-black text-white">
                <th>Mã danh mục vật tư </th>
                <th>Tên danh mục vật tư</th>

                <th>Hành động</th>
              </tr>
            </thead>
            <tbody className="">
            {categories&&categories.map((category) => (
                <tr>
                  <td>{category._id}</td>
                  <td>{category.categoryName}</td>
                 
                  <td>
                    <button className="mr-4 " onClick={ ()=>handleEdit(category)}>Sửa</button>

                    <button onClick={() =>{setCategoryId(category._id);setOpenDeleteCategory(true)}}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editCategory && (
      <AdminEditCategory
        onClose={() => setEditCategory(false)}
        categoryId={categoryId}
        fetchData={fetchAllCategories}
        
      />
    )}
      {openUploadCategory && (
        <UploadCategory
          onClose={() => setOpenUploadCategory(false)}
          fetchData={fetchAllCategories}
          
        />
      )}
      {openDeleteCategory && 
      <Modal heading={"Xoá danh mục "}funcAllow={handleDelete} onClose={closeDeleteCategory} content={"Bạn có muốn xoá danh mục vật tư này không ?"} funcDeny={closeDeleteCategory}/>
      }
    </div>
  );
};

export default AllCategories;
