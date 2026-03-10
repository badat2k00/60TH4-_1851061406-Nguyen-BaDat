import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  FaRegStarHalfStroke,
  FaAngleLeft,
  FaAngleRight,
  FaStarHalfStroke,
} from "react-icons/fa6";
import { toast } from "react-toastify";
import parse from 'html-react-parser';
import displayVNDCurrency from "../helpers/displayCurrency";
import CategroyWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import addToItemsOrder from "../helpers/addToItemsOrder";
import Context from "../context";
import Review from "../components/Review";
import ratingtoArray from "../helpers/ratingtoArray";
import {convertTime} from "../helpers/convertTime";
import { useSelector } from "react-redux";
import {} from "react-icons/fa6";
// Nhập category name
const ProductDetails = () => {
  const currentUser = useSelector((state) => state?.user?.user);
  const [isOrder, setIsOrder] = useState(false);
  const scrollElement = useRef();
  const [avarageRate, setAvarageRate] = useState(0);
  const [category, setCategory] = useState("");
  const [orderId,setOrderId]=useState("")
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    categoryId: "",
    productImage: [],
    description: "",
    sellingPrice: "",
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const productImageListLoading = new Array(4).fill(null);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImageCoordinate, setZoomImageCoordinate] = useState({
    x: 0,
    y: 0,
  });
  const [zoomImage, setZoomImage] = useState(false);

  const { fetchUserAddToCart } = useContext(Context);

  const navigate = useNavigate();

  const fetchProductDetails = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.productDetails.url, {
      method: SummaryApi.productDetails.method,
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: params?.id,
      }),
    });
    setLoading(false);
    const dataReponse = await response.json();

    setData(dataReponse?.data);
    setActiveImage(dataReponse?.data?.productImage[0]);
  };

  // console.log("data", data);

  const [review, setReview] = useState();
  const [reviews, setReviews] = useState([]);
  const [sumRating, setSumRating] = useState({
    SumOneRating: "",
    SumTwoRating: "",
    SumThreeRating: "",
    SumFourRating: "",
    SumFiveRating: "",
  });
  const [percentageRating, setPercentageRating] = useState({
    percentageOneRating: "",
    percentageTwoRating: "",
    percentageThreeRating: "",
    percentageFourRating: "",
    percentageFiveRating: "",
  });

    const fetchLastestOrder = async () => {
      const dataResponse = await fetch(SummaryApi.getLastestOrder.url, {
        method: SummaryApi.getLastestOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const dataApi = await dataResponse.json();
      console.log(dataApi)
      console.log(dataApi._id);
      if (dataApi.success && dataApi.data && dataApi.data.items) {
        setIsOrder(true);
        
        setOrderId(dataApi._id)
      } else {
        setIsOrder(false);
      }
    };
    
      useEffect(()=>{
        fetchLastestOrder()
      },[])
  const fetchReviewByProductId = async () => {
    try {
      const res = await fetch(
        `${SummaryApi.getReviewByProduct.url}/${params?.id}`,
        {
          method: SummaryApi.getReviewByProduct.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await res.json();

      setReviews(data.data);
      setSumRating({
        SumOneRating: data.data1.SumOneRating,
        SumTwoRating: data.data1.SumTwoRating,
        SumThreeRating: data.data1.SumThreeRating,
        SumFourRating: data.data1.SumFourRating,
        SumFiveRating: data.data1.SumFiveRating,
      });
      setPercentageRating({
        percentageOneRating:data.data2.percentageOneRating,
        percentageTwoRating:data.data2.percentageTwoRating,
        percentageThreeRating:data.data2.percentageThreeRating,
        percentageFourRating:data.data2.percentageFourRating,
        percentageFiveRating:data.data2.percentageFiveRating
      })
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategoryProduct = async () => {
    try {
      const res = await fetch(
        `${SummaryApi.getCategoryByProduct.url}/${params?.id}`,
        {
          method: SummaryApi.getCategoryByProduct.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.data) {
        setCategory(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (reviews.length) {
      const rateArray = reviews.map((data) => data.rating);
      const average = rateArray.reduce((a, b) => a + b) / reviews.length;
      setAvarageRate(Math.ceil(average * 2) / 2);
    }
  }, [reviews]);

  useEffect(() => {
    fetchProductDetails();
    fetchReviewByProductId();
    fetchCategoryProduct();
  }, [params]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback((e) => {
    setZoomImage(true);
    const { left, top, width, height } = e.target.getBoundingClientRect();
    // console.log("coordinate", left, top, width, height);

    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    setZoomImageCoordinate({ x, y });
  }, []);

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };
  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
  };
 const handleAdd=async(e,id)=>{
      console.log(isOrder)
    if(isOrder===true){
        await addToItemsOrder(e,id,orderId)
        await addToCart(e,id,false)
       fetchUserAddToCart()
    }else{
        await addToCart(e,id,true)
       fetchUserAddToCart()
      }
    }

  const handleBuyProduct = async (e, id) => {
    if (!currentUser) {
      toast.error("Xin lỗi bạn nên đăng nhập để sử dụng tính năng này");
      return
    } 
    if(isOrder){
      toast.error("Bạn đang có 1 đơn hàng cần xử lý .Bạn không thể mua vật tư trong thời điểm này.")
      return 
    }
    else {
      await addToCart(e, id);
      fetchUserAddToCart();
      console.log(currentUser);
      navigate("/payment");
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="min-h-[200px] flex flex-col lg:flex-row gap-4 bg-white mb-4 p-4">
        <div className="h-96 flex flex-col lg:flex-row-reverse gap-4">
          <div className="h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative p-2">
            <img
              src={activeImage}
              className="h-full w-full object-scale-down mix-blend-multiply"
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              alt="img"
            />
            {zoomImage && (
              <div className="hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0">
                <div
                  className="w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150"
                  style={{
                    background: `url(${activeImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: `${zoomImageCoordinate.x * 100}% ${
                      zoomImageCoordinate.y * 100
                    }% `,
                  }}
                ></div>
              </div>
            )}
          </div>

          <div className="h-full">
            {loading ? (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {productImageListLoading.map((el, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded animate-pulse"
                      key={"loadingImage" + index}
                    ></div>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full">
                {data?.productImage?.map((imgURL, index) => {
                  return (
                    <div
                      className="h-20 w-20 bg-slate-200 rounded p-1"
                      key={imgURL}
                    >
                      <img
                        src={imgURL}
                        className="w-full h-full object-scale-down mix-blend-multiply cursor-pointer"
                        onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                        onClick={() => handleMouseEnterProduct(imgURL)}
                        alt="img "
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <div className="grid gap-1 w-full">
            <p className="bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block"></p>
            <h2 className="text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full">
              ""
            </h2>
            <p className="capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full"></p>

            <div className="text-red-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full"></div>

            <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full">
              <p className="text-red-600 bg-slate-200 w-full"></p>
              <p className="text-slate-400 line-through bg-slate-200 w-full"></p>
            </div>

            <div className="flex items-center gap-3 my-2 w-full">
              <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full"></button>
              <button className="h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full"></button>
            </div>

            <div className="w-full">
              <p className="text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full"></p>
              <p className=" bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full"></p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <p className="bg-red-200 text-red-600 px-2 rounded-full inline-block w-fit">
              {data?.brandName}
            </p>
            <h2 className="text-2xl lg:text-4xl font-medium">
              {data?.productName}
            </h2>
            <div className=" flex items-center gap-1">
              {ratingtoArray(avarageRate).map((value, index) => (
                <span key={index}>
                  {value === 0.5 && (
                    <FaStarHalfStroke className="text-yellow-300 text-lg" />
                  )}
                  {value === 1 && <FaStar className="text-yellow-300" />}
                  {value === 0 && <FaStar className="text-gray-300" />}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1">
              <p className="text-red-600">
                {displayVNDCurrency(data.sellingPrice)}
              </p>
            </div>

            <div className="flex items-center gap-3 my-2">
              <button
                className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] text-red-600 font-medium hover:bg-red-600 hover:text-white"
                onClick={(e) => handleBuyProduct(e, data?._id)}
              >
                Mua 
              </button>
               <button
                className="border-2 border-red-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-red-600 hover:text-red-600 hover:bg-white"
                onClick={(e) => handleAdd(e, data?._id)}
              >
                {isOrder?"Thêm vào đơn hàng":"Thêm vào giỏ hàng"}
              </button>

            </div>

           
          </div>
        )}


      </div>
      <div className="w-full h-full mt-2 bg-white p-2"> 
        {parse(data?.description)}
      </div>
      <div
        className="flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all"
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


        {category && (
          <CategroyWiseProductDisplay
            category={category}
            productId={params?.id}
            heading={"Vật tư tương tự"}
          />
        )}
      </div>
      {/*List Review */}
      <div className="p-4 ">
        <div className="flex justify-center items-center sm:items-center gap-2">
          <div className="flex flex-col">
            <h1 className="text-7xl text-center">{avarageRate}</h1>
            <span>{reviews.length} đánh giá </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-center gap-1 items-center">
              <span className="flex items-center">
                5 <FaStar className="text-amber-300" />
              </span>
              <div className="w-[300px] bg-slate-400 rounded-lg h-3">
                <div className='bg-amber-300 rounded-lg h-full' style={{width:`${Number(percentageRating.percentageFiveRating)}%`}}></div>
              </div>
              
              <span>{sumRating.SumFiveRating} đánh giá</span>
            </div>
            <div className="flex justify-center gap-1 items-center">
              <span className="flex items-center">
                4 <FaStar className="text-amber-300" />
              </span>
              <div className="w-[300px] bg-slate-400 rounded-lg h-3">
                 <div className='bg-amber-300 rounded-lg h-full' style={{width:`${Number(percentageRating.percentageFourRating)}%`}}></div>
              </div>
              <span>{sumRating.SumFourRating} đánh giá</span>
            </div>
            <div className="flex justify-center gap-1 items-center">
              <span className="flex items-center">
                3 <FaStar className="text-amber-300" />
              </span>
              <div className="w-[300px] bg-slate-400 rounded-lg h-3">
              <div className='bg-amber-300 rounded-lg h-full'  style={{width:`${Number(percentageRating.percentageThreeRating)}%`}}></div>
              </div>
              <span>{sumRating.SumThreeRating} đánh giá</span>
            </div>
            <div className="flex justify-center gap-1 items-center">
              <span className="flex items-center">
                2 <FaStar className="text-amber-300" />
              </span>
              <div className="w-[300px] bg-slate-400 rounded-lg h-3">
              <div className='bg-amber-300 rounded-lg h-full'  style={{width:`${Number(percentageRating.percentageTwoRating)}%`}}></div>
              </div>
              <span>{sumRating.SumTwoRating} đánh giá</span>
            </div>
            <div className="flex justify-center gap-1 items-center">
              <span className="flex items-center">
                1 <FaStar className="text-amber-300" />
              </span>
              <div className="w-[300px] bg-slate-400 rounded-lg h-3">
              <div className='bg-amber-300 rounded-lg h-full'  style={{width:`${Number(percentageRating.percentageOneRating)}%`}}></div>
              </div>
              <span>{sumRating.SumOneRating} đánh giá</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2  w-[100%]">
          <div className="flex flex-row  justify-center items-center w-full">
            <button className=" bg-white border-2 border-black text-black rounded-md p-1">
              Xem đánh giá{" "}
            </button>
            <Review
              params={params}
              setReview={setReview}
              setReviews={setReviews}
              setAvarageRate={setAvarageRate}
            />
          </div>
         <h1 className="text-2xl font-semibold py-4">Đánh giá</h1>
          
          <div>
            {reviews.map((review) => (
              <div className="flex flex-col w-full">
                <div className="flex gap-2">
                  <img src={review?.profilePic} alt="" width={70} height={70} />
                  <div>
                    <div className="text-lg">
                      {convertTime(review.reviewdate)}
                    </div>
                    <h2 className="text-lg"> {review.name}</h2>
                    <div>{review.comment}</div>
                  </div>
                  <div className="flex flex-row">
                    {ratingtoArray(review.rating).map((value, index) => (
                      <span key={index}>
                        {value === 1 ? (
                          <FaStar className="text-lg text-yellow-300" />
                        ) : (
                          <FaStar className="text-lg text-gray-400" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
