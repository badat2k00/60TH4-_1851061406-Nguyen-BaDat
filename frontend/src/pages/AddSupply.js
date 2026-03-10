import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import Modal from "../components/Modal";
import SummaryApi from "../common";
import PaginatedItems from "../components/PaginatedItems";
import { CgSearch } from "react-icons/cg";
import { editProduct } from "../store/productSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
const AddSupply = () => {
  const dispatch = useDispatch();
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [updateStocktemp, setUpdateStocktemp] = useState();
  const [updated, setUpdated] = useState(false);

  const [allProduct, setAllProduct] = useState([]);
  const [selectProduct, setSelectProduct] = useState(null);
  const [currentItems, setCurrentItems] = useState(0);
  const [searchProduct, setSearchProduct] = useState("");
  const [openResetModal, setOpenResetModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [allHistory, setAllHistory] = useState([]);
  const [timesUpdate, setTimesUpdate] = useState(0);
  const [historyUpdate, setHistoryUpdate] = useState({
    time: 0,
    quantity: 0,
    oldStock: 0,
    newStock: 0,
  });
  const fetchAllProduct = async () => {
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();

    if (dataResponse?.data) {
      // dispatch(getAllProducts(dataResponse?.data));
      setAllProduct(dataResponse?.data);
    }
    // setAllProduct(dataResponse?.data || [])
  };
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchProduct(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // localStorage.setItem("temp",searchProduct)
    // setUpdateStocktemp(searchProduct)
    fetchProduct();

    // setUpdated(true)
    // setOpenUploadProduct(true)
    // }})
    // &&setOpenUploadProduct(true))
  };
  const handleQuantityChange = (e, productId) => {
    const value = Number(e.target.value);

    setAllProduct((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, quantityToAdd: value } : p
      )
    );
  };

  const handleReset = (product) => {
    setSelectProduct(product);

    for (let i = 0; i < allHistory.length; i++) {
      if (product.stockQuantity === allHistory[i].newStock)
        setAllProduct((prev) =>
          prev.map((p) =>
            p._id === product._id
              ? {
                  ...product,
                  stockQuantity: allHistory[i].oldStock,
                  quantity: 0,
                }
              : p
          )
        );
      try {
        const a = async () => {
          const response = await fetch(SummaryApi.updateProduct.url, {
            method: SummaryApi.updateProduct.method,
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              ...product,
              stockQuantity: allHistory[i].oldStock,
            }),
          });
          const responseData = await response.json();

          if (responseData.success) {
            toast.success(responseData?.message);

            dispatch(
              editProduct({
                _id: responseData.data._id,
                productData: responseData.data,
              })
            );
          }

          if (responseData.error) {
            toast.error(responseData?.message);
          }
        };
        a();
      } catch (error) {}
      setAllHistory((prev) =>
        prev.filter((p) => p.oldStock !== product.stockQuantity)
      );
    }

    setTimesUpdate(timesUpdate - 1);

    handleCloseResetModal();
  };
  const fetchProduct = async () => {
    const response = await fetch(SummaryApi.searchProductByType.url, {
      method: SummaryApi.searchProductByType.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ query: searchProduct }),
    });
    const dataResponse = await response.json();
    // setLoading(false)
    setTimeout(() => {
      setAllProduct(dataResponse.data);
    }, 1000);

    return dataResponse;
  };
  // fetchProduct();
  useEffect(() => {
    if (searchProduct === "") {
      // setTimeout(() => {
      fetchAllProduct();
      // }, 500);
    }
  }, [searchProduct]);

  const handleCloseResetModal = () => {
    setOpenResetModal(false);
  };
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };
  const handleUpdate = (product) => {
    setSelectProduct(product);
    if (product?.quantityToAdd === undefined || product?.quantityToAdd === 0) {
      alert("VUi lòng chọn số lượng vật tư");
    } else {
      let newTimesUpdate = timesUpdate + 1;
      setTimesUpdate(newTimesUpdate);

      const newHistoryUpdate = {
        time: newTimesUpdate,
        quantity: product?.quantityToAdd,
        oldStock: product.stockQuantity,
        newStock: Number(product.stockQuantity) + product.quantityToAdd,
      };
      setHistoryUpdate(newHistoryUpdate);
      let newAllHistory = [...allHistory, newHistoryUpdate];
      setAllHistory(newAllHistory);
      setUpdated(true);
      //  localStorage.setItem("temp",JSON.stringify(updated))
      localStorage.setItem("productHistory", JSON.stringify(newAllHistory));

      setAllProduct((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? {
                ...product,
                stockQuantity:
                  Number(product.stockQuantity) + product.quantityToAdd,
                // historyUpdate: setAllHistory([...allHistory, historyUpdate]),
                quantityToAdd: 0,
                update: true,
              }
            : p
        )
      );
      // localStorage.setItem("updateProducts",)
      // try {
      const handleUpdateStock = async () => {
        // e.preventDefault();

        const response = await fetch(SummaryApi.updateProduct.url, {
          method: SummaryApi.updateProduct.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            ...product,
            stockQuantity:
              Number(product.stockQuantity) + product.quantityToAdd,
          }),
        });
        // console.log(data)
        const responseData = await response.json();

        if (responseData.success) {
          toast.success(responseData?.message);
          // onClose();
          dispatch(
            editProduct({
              _id: responseData.data._id,
              productData: responseData.data,
            })
          );

          // fetchdata()
          console.log(responseData.data);
          // setData((prevData) => ({ ...prevData, ...responseData.data }));
        }

        if (responseData.error) {
          toast.error(responseData?.message);
        }
      };

      // } catch (error) {

      // }
      handleUpdateStock();

      console.log(newAllHistory);
      // setUpdateStock([...updateStock,{...product,updated:updated}])

      // localStorage.setItem("temp",JSON.stringify(updateStock))
      handleCloseUpdateModal();
    }
  };
  const toggleResetUpdate = (product) => {
    setSelectProduct(product);
    // console.log(product)
    /* 
updated ban đầu =false => cập nhật 

*/
    if (updated) {
      setOpenResetModal(true);
    } else {
      setOpenUpdateModal(true);
    }
  };

  useEffect(() => {
    // fetchAllProduct()
    // console.log(updateStocktemp)
    setUpdated(JSON.parse(localStorage.getItem("temp")));
    console.log(updated);
  }, []);

  return (
    <div>
      {/* <form> */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mời bạn nhập vật tư"
          value={searchProduct}
          onChange={handleSearch}
        />
        <button type="submit">
          <CgSearch />
        </button>
      </form>

      {/* <Modal/> */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          // fetchData={fetchAllProduct}
          searchProduct={searchProduct}
        />
      )}

      {currentItems.length === 0 && searchProduct !== "" && (
        <div>
          Không tìm thấy vật tư bạn cần tìm .Bạn có muốn đặt vật tư{" "}
          {searchProduct} này không?
          <button onClick={() => setOpenUploadProduct(true)}> Có </button>
          <button onClick={() => setSearchProduct("")}>Không</button>
        </div>
      )}
      {currentItems.length > 0 && (
        <table className="w-full userTable h-[calc(100vh-100px)]">
          <thead>
            <tr className="bg-black text-white">
              <th>Mã vật tư</th>
              <th>Ảnh</th>
              <th>Tên vật tư</th>
              <th>Danh mục vật tư</th>
              <th>Số lượng </th>
              <th>Đơn giá</th>
              <th>Nhập thêm</th>
              {/* {user?.role==='ADMIN'&& <th>Quyền</th>} */}
              <th>Hành động </th>
            </tr>
          </thead>
          <tbody className="">
            {currentItems &&
              currentItems.map((el, index) => {
                return (
                  <tr>
                    <td>{el?._id}</td>
                    <th className="flex justify-center">
                      <img
                        src={el?.productImage[0]}
                        alt=""
                        width={100}
                        height={100}
                      />
                    </th>
                    <td>{el?.productName}</td>
                    <td>{el?.categoryId?.categoryName}</td>
                    <td>{el?.stockQuantity}</td>
                    <td>{el?.sellingPrice}</td>
                    <td>
                      <input
                        type="number"
                        value={el?.quantityToAdd || 0}
                        onChange={(e) => handleQuantityChange(e, el._id)}
                        className="w-9"
                        min={0}
                      />
                    </td>
                    {/* <td>{updateStock!==null &&<button onClick={()=>toggleResetUpdate(el)} >{updated &&selectProduct===el?"Hoàn tác":"Cập nhật"}</button>}</td> */}
                    {/* <td><button onClick={()=>toggleResetUpdate(el)} >{el?.updated &&selectProduct===el?"Hoàn tác":"Cập nhật"}</button></td> */}

                    {/* {console.log(updateStocktemp)} */}
                    <td>
                      {el.update ? (
                        <>
                          <button
                            onClick={() => {
                              setOpenUpdateModal(true);
                              setSelectProduct(el);
                            }}
                          >
                            Cập nhật thêm
                          </button>
                          <button
                            onClick={() => {
                              setOpenResetModal(true);
                              setSelectProduct(el);
                            }}
                          >
                            Hoàn tác
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            setOpenUpdateModal(true);
                            setSelectProduct(el);
                          }}
                        >
                          Cập nhật
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
      {openResetModal && (
        <Modal
          content={"Bạn có muốn hoàn tác không"}
          onClose={handleCloseResetModal}
          funcAllow={() => handleReset(selectProduct)}
          funcDeny={handleCloseResetModal}
        />
      )}
      {openUpdateModal && (
        <Modal
          content={"Bạn có muốn cập nhật số lượng tồn không"}
          onClose={handleCloseUpdateModal}
          funcAllow={() => handleUpdate(selectProduct)}
          funcDeny={handleCloseUpdateModal}
        />
      )}
      {}
      <PaginatedItems
        itemsPerPage={10}
        setCurrentItems={setCurrentItems}
        items={allProduct}
      />
    </div>
  );
};

export default AddSupply;

/* 
khi cap nhat (luu body so nhap vao localstorage )
*/

/* 

// let historyUpdate=[{
//     time:0,
//     quantity:10,
//     stock:100,
//     newStock:110
// },{time:1,quantity:12,stock:110,newStock:132}]
let time=0//const [timeUpdate,setTimeUpdate]=useState(0)
let historyUpdate=[]//const [historyUpdate]
let product={stockQuantity:100}//

function update(quantity){
    
    time+=1//setTimeUpdate(time+1)
    historyUpdate.push({time,quantity:quantity,oldstock:product.stockQuantity,newStock:product.stockQuantity+quantity})
    
    product.stockQuantity+=quantity
     
    
    // return historyUpdate,product
    // console.log(historyUpdate)
    return historyUpdate
}
// console.log(product) 
// function reset(time){
//     if(time>1){
//       product.stockQuantity=historyUpdate[time-1].stock
//       time=time-1
//     }else{
//       product.stockQuantity=historyUpdate[0].stock
//     }
//     return product
// }
 
function reset(){
    // if(time>1){
    // console.log(product)
    for(let i=0;i<historyUpdate.length;i++){
        if(product.stockQuantity==historyUpdate[i].newStock)
       product.stockQuantity=historyUpdate[i].oldstock
       time=time-1
      historyUpdate=historyUpdate.filter(p=>p.oldstock!=product.stockQuantity)
    }
    console.log(product)
    return historyUpdate
}
console.log(update(100))
// console.log(product)
console.log(update(200))
console.log(update(300))
// console.log(update(400))
console.log(reset())
console.log(reset())
console.log(reset())
// console.log(reset())
// console.log(reset(2))
// let a=[1,2,3]
// a.filter(a=>a==1)
// console.log(reset(1))

*/
