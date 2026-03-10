import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import rating from "../helpers/rating";
import SummaryApi from "../common";
import { toast } from "react-toastify";
const Review = ({ params, setReviews }) => {
  const [currentRating, setCurrentRating] = useState(rating([0, 0, 0, 0, 0]));
  const [showForm, setShowForm] = useState(false);
  const [rate, setRate] = useState(0);
  const [check, setCheck] = useState(false);
  const [data, setData] = useState({
    comment: "",
  });

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, [showForm]);
  const handleRating = (index) => {
    const newRating = new Array(5).fill(0).map((_, i) => (i <= index ? 1 : 0));
    let countRating = 0;
    for (let a of newRating) {
      if (a === 1) {
        countRating += 1;
      }
    }
    setRate(countRating);
    setCurrentRating(newRating);
  };
  const handleSubmit = async(e) => {
    if(data.comment===""){
      toast.error("Bạn chưa đồng ý đăng")
    }else{
    e.preventDefault();
     await createReview()
    console.log("You submited");
    setShowForm(false);
    }
  };
  const createReview = async () => {
    try {
      const fetchResponse = await fetch(`${SummaryApi.createReview.url}/${params?.id}`, {
        method: SummaryApi.createReview.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body:JSON.stringify({...data,rating:rate})
      });
      const responseData = await fetchResponse.json();
      if(responseData.success){
      setReviews((prevData) => {
        const newData = [...prevData, responseData.data];
        return newData;
      });
    }else{
      toast.error(responseData.message)
    }
    } catch (err) {
      
    }
  };
  const handleOpenReview = () => {
    setShowForm(true);
  };
  const handleCloseReview = () => {
    setShowForm(false);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };
  return (
    <div>
      <button
        className="bg-blue-700 text-gray-100 p-1 border-2  border-blue-700 rounded-md relative"
        onClick={handleOpenReview}
      >
        Viết đánh giá
      </button>
      {showForm && (
        <div className="fixed w-full h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-full max-w-2xl h-full max-h-[70%] overflow-y-hidden">
            <div className="flex justify-between items-center pb-3">
              <h2 className="font-bold text-lg">Viết Đánh giá</h2>
              <div
                className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
                onClick={handleCloseReview}
              >
                <CgClose />
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col p-4 gap-2 pb-5 justify-between"
            >
              <div className="flaex flex-col max-w-96 mx-auto my-0">
                <div className="flex mb-4 justify-center gap-4">
                  {currentRating.map((star, index) => (
                    <div key={index} onClick={() => handleRating(index)}>
                      {star === 1 ? (
                        <FaStar className="w-[40px] h-[40px] text-yellow-300" />
                      ) : (
                        <FaRegStar className="w-[40px] h-[40px] text-yellow-300" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex  justify-center list-none gap-4 text-sm container ">
                  <li>Rất Tệ</li>
                  <li>Tệ</li>
                  <li>Ổn</li>
                  <li>Tốt</li>
                  <li className="text-yellow-400 font-bold">Rất tốt</li>
                </div>
              </div>

             
              <label>Đánh giá của bạn  :</label>
              <textarea
                cols="20"
                rows="5"
                name="comment"
                className="w-full mb-4"
                placeholder="Nhập đánh giá của bạn tại đây"
                onChange={handleChange}
                value={data.comment}
              ></textarea>
              <div className="mb-4">
                <input
                  type="checkbox"
                  name="license"
                  id="license"
                  required
                  onClick={() => setCheck(!check)}
                />
                <label htmlFor="license" className="ml-2">
                  Đồng ý đăng
                </label>
              </div>
              <button
                type="submit"
                className={`${
                  check === false ? "bg-blue-300" : "bg-blue-700"
                } text-white px-4 py-2 rounded`}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
