import React, { useState, useEffect } from "react";
import SummaryApi from "../common";
import uploadPersonImage from "../helpers/uploadPersonImage";
import { FaRegCircleUser } from "react-icons/fa6";
import { toast } from "react-toastify";
const PersonalInformation = () => {
  const [data, setData] = useState({
    name: "",
    profilePic: "",
    // email: "",
  });
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const dataResponse = await fetch(SummaryApi.current_user.url, {
          method: SummaryApi.current_user.method,
          credentials: "include",
        });

        const dataApi = await dataResponse.json();

        if (dataApi.success) {
          setData(dataApi.data); 
        } else {
          console.error("Failed to fetch user details:", dataApi.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadPersonImage(file);
    setData((prev) => {
      return {
        ...prev,
        profilePic: uploadImageCloudinary.url,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.name !== "") {
      await updateUser();
    } else {
      toast.error("Vui lòng nhập tên ");
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          profilePic: data.profilePic,
        }),
        credentials: "include",
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success("Cập nhật thông tin thành công");
        setData(responseData.data);
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="justify-start flex flex-col items-center w-full h-full p-4">
        <h1 className="text-4xl">Thông tin cá nhân</h1>
        <div className="m-3 w-[100px] h-[100px] border-2 border-black rounded-full flex justify-center items-center">
          {data?.profilePic ? (
            <img
              src={data?.profilePic}
              alt="Profile"
              className=" w-full h-full rounded-full "
            />
          ) : (
            <FaRegCircleUser className=" w-full h-full" />
          )}
        </div>
        <div className="w-40 h-10 mb-4 relative">
          <form>
            <label>
              <div className="bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute w-full ">
                Chọn ảnh
              </div>
              <input type="file" hidden onChange={handleUploadImage} />
            </label>
          </form>
        </div>

        <br />

        <form onSubmit={handleSubmit}>
          <label>Tên : </label>
          <input
            type="text"
            name="name"
            value={data?.name || ""}
            onChange={handleChange}
            className="px-2 rounded-full"
          />
          <br />
          <label>Email: {data?.email}</label>
          <br />
          <div className="text-center mt-4">
            <button type="submit" className="bg-green-400 p-3 rounded-full">
              Cập nhật
            </button>
          </div>
        </form>
        <br />

      </div>
    </div>
  );
};

export default PersonalInformation;
