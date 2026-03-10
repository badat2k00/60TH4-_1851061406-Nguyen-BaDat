import React, { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";
import displayVNDCurrency from "../helpers/displayCurrency";
import { FaRegTrashCan } from "react-icons/fa6";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import {convertTime} from "../helpers/convertTime"
import AdminEditOffer from "./AdminEditOffer";
import Modal from "./Modal";
const AdminOfferCard = ({ data, fetchdata }) => {
  const [editOffer, setEditProduct] = useState(false);
  const [active,setActive]=useState("");
  const [expireDate,setExpireDate]=useState("")
  const [openDeleteOffer,setOpenDeleteOffer]=useState(false);
    const closeDeleteOffer=()=>{
      setOpenDeleteOffer(false)
    }
  const deleteOffer = async (offerId) => {
    try {
      console.log("Deleting Product ID:", offerId);
      const response = await fetch(SummaryApi.deleteOffer.url, {
        method: SummaryApi.deleteOffer.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          offerId
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message, {
          position: "top-right",
          autoClose: 5000,
        });
        // Gọi lại fetchdata để cập nhật danh sách sản phẩm sau khi xóa
        fetchdata();
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
  const publishOffer=async(offerId)=>{
    try {
      console.log("Deleting Product ID:", offerId);
      const response = await fetch(SummaryApi.publishOffer.url, {
        method: SummaryApi.publishOffer.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          offerId
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message, {
          position: "top-right",
          autoClose: 5000,
        });
        // Gọi lại fetchdata để cập nhật danh sách sản phẩm sau khi xóa
        fetchdata();
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
  }
  const handleDelete = () => {
    deleteOffer(data._id);
    setOpenDeleteOffer(false)
    fetchdata()
  }
  const handleReFix=()=>{

  } 
  return (
    <div className="bg-white p-4 rounded ">
      <div className="w-40">
        <div className="w-32 h-32 flex justify-center items-center">
          <p className="font-semibold">
            {/* {displayVNDCurrency(data.sellingPrice)} */}
            {data.detail}
          </p>

        </div>
        <h1 className="text-ellipsis line-clamp-2 break-words">{data.code}</h1>
        <h1>Hạn:  {convertTime(data.expireDate)||""}</h1>
        <div>
          
          
          <div className="flex justify-end">
       
           
          <div
              className="ml-au p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
              onClick={() => setEditProduct(true)}
            >
              <MdModeEditOutline />
            </div><div
              className=" ml-au p-2 bg-green-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer"
              onClick={()=>setOpenDeleteOffer(true)}
            >
              <FaRegTrashCan/>
            </div>
           

          </div>
        </div>
      </div>
      {openDeleteOffer &&<Modal heading={"Xoá ưu đãi"}onClose={closeDeleteOffer} content={"Bạn có muốn xoá ưu đãi này không ?"}funcAllow={handleDelete} funcDeny={closeDeleteOffer}/>}

      {editOffer && (
        <AdminEditOffer
          productData={data}
          onClose={() => setEditProduct(false)}
          // fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminOfferCard;
