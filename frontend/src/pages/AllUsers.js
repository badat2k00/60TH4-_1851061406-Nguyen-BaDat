import React, { useState, useEffect } from "react";
import PaginatedItems from "../components/PaginatedItems";
import moment from "moment";
import SummaryApi from "../common";
import ChangeUserRole from "../components/ChangeUserRole";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import { CgSearch } from "react-icons/cg";
const AllUsers = () => {
  const [currentItems, setCurrentItems] = useState(0);
  const [allUser, setAllUsers] = useState([]);
  const user = useSelector((state) => state?.user?.user);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchUser,setSearchUser]=useState("")
  const handleSearch = (e) => {
    const { value } = e.target;
       setSearchUser(value);
  };
  const fetchUser=async()=>{
      const response = await fetch(SummaryApi.searchUser.url, {
        method: SummaryApi.searchUser.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ query: searchUser }),
      });
      const dataResponse = await response.json();
      // console.log(dataResponse.data)
      // setLoading(false)
      setTimeout(() => {
        setAllUsers(dataResponse.data);
      }, 1000);
  }
  const fetchAllUsers = async () => {
    const fetchData = await fetch(SummaryApi.allUser.url, {
      method: SummaryApi.allUser.method,
      credentials: "include",
    });

    const dataResponse = await fetchData.json();
    // console.log(dataResponse.data)
    if (dataResponse.success) {
      setAllUsers(dataResponse.data);
    }
    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }
  };
  useEffect(() => {
  if(searchUser===""){
  //   fetchUser()
  // }else{
    fetchAllUsers();
  }
  }, [searchUser]);
  return (
    <>
      <div>
        <div className="bg-white pb-4">
          <div className="w-full text-center">
            <h1 className="text-2xl">Quản lý tài khoản </h1>
            <div className="flex">
               <input
              type="text"
              placeholder="Nhập người dùng hoặc email"
              className="p-2 w-[80%] bg-slate-100"
              onChange={handleSearch}
              value={searchUser}
            />
            <button onClick={fetchUser} className="bg-red-400 px-2 text-white rounded-sm"> Tìm</button>
          </div>
          
            </div>
           
           {currentItems.length===0&&"Không thấy người dùng cần tìm"}
         {currentItems.length>0 && <table className="w-full userTable h-[calc(100vh-100px)]">
            <thead>
              <tr className="bg-black text-white">
                <th>Mã người dùng</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Xác thực Email</th>
                <th>Ngày đăng ký</th>
               {user?.role==='ADMIN'&& <th>Quyền</th>}
              </tr>
            </thead>
            <tbody className="">
              {
                currentItems&&currentItems.map((el, index) => {
                  return (
                    <tr>
                      <td>{el?._id}</td>
                      <td>{el?.name}</td>
                      <td>{el?.email}</td>
                      <td>{el?.isGoogleLink ? "Có" : "Chưa"}</td>
                      <td>{moment(el?.createdAt).format("DD/MM/YYYY")}</td>
                      {user?.role==='ADMIN'&&  <td>
                        {el?.role}

                       <div className="flex w-full gap-1 justify-center">
                         { selectedUser && (
                          <ChangeUserRole
                            name={selectedUser.name}
                            email={selectedUser.email}
                            userId={selectedUser._id}
                            onClose={() => setSelectedUser(null)}
                          />
                        )}
                         <MdModeEdit
                          onClick={() => {
                            setSelectedUser(el);
                          }}
                        />
                       </div>
                       
                      </td>}
                    </tr>
                  );
                })}
            </tbody>
          </table>}
        </div>
        <PaginatedItems
          itemsPerPage={13}
          setCurrentItems={setCurrentItems}
          items={allUser}
        />
      </div>
    </>
  );
};

export default AllUsers;
