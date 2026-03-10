import React, { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
const Offer = () => {
  const [offers, setOffers] = useState([]);
  const scrollElement = useRef();
  const scrollRight = () => {
    scrollElement.current.scrollLeft += 500;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 500;
  };
  const addToOffer = async (e,id) => {
    // console.log(JSON.stringify(id))
    try {
      const response = await fetch(SummaryApi.addOfferToUser.url, {
        method: SummaryApi.addOfferToUser.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({offerId:id }),
      });
      const offerData = await response.json();
   
      if (offerData.success) {
        toast.success("Lấy ưu đãi thành công")
        console.log(offerData.data)
      }
      if (offerData.error) {
        toast.error(offerData?.message)
      }
    } catch (e) {}
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/all-offers", {
        method: "GET",
      });
      const offerData = await response.json();
      // console.log(offerData.data)
      setOffers(offerData.data);
    } catch (e) {}
  };
  useEffect(() => {
    fetchOffers();
  }, []);
  return (
    <div className="container mx-auto px-4 my-6 relative ">
      <h2 className="text-2xl font-semibold py-4">Ưu đãi</h2>

      <div
        className="flex items-center gap-4 md:gap-6 overflow-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        <button
          className="bg-white shadow-md rounded-full p-1 absolute left-0 text-lg hidden md:block"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>

        <button
          className="bg-white shadow-md rounded-full p-1 absolute right-0 text-lg hidden md:block"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>
        {offers.map((offer) => (
          <div className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-sm shadow relative ">
           <h1 className="pt-2 px-4">{offer.detail }</h1>
            <div className="p-4 grid gap-3">
              {/* {offer.isActive?"True":"False"} */}
              <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black">
                {offer?.code}
              </h2>
             
              <button
                className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-0.5 rounded-full"
                onClick={(e) => addToOffer(e,offer?._id)}
              >
                Lấy ưu đãi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offer;
