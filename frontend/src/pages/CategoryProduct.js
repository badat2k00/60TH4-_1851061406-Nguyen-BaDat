import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import VerticalCard from "../components/VerticalCard";
import SummaryApi from "../common";
import { useTranslation } from "react-i18next";

import PaginatedItems from "../components/PaginatedItems";
import { toast } from "react-toastify";
const CategoryProduct = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentItems, setCurrentItems] = useState(0);
  const location = useLocation();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");

  const [filterCategoryList, setFilterCategoryList] = useState([]);
  const urlCategoryListObject = {};
  urlCategoryListinArray.forEach((el) => {
    urlCategoryListObject[el] = true;
  });

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [sortBy, setSortBy] = useState("");
  const [categories, setCategories] = useState([]);
  const [isCategoryChecked, setIsCategoryChecked] = useState(false);

  // Fetch Data from Server

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setIsCategoryChecked(true);
    setSelectCategory((preve) => {
      return {
        ...preve,
        [value]: checked,
      };
    });
    console.log(selectCategory);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(SummaryApi.filterProduct.url, {
        method: SummaryApi.filterProduct.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          category: filterCategoryList,
        }),
      });

      const dataResponse = await response.json();
      if (dataResponse.success) {
        setData(dataResponse?.data || []);
      } else {
        toast.error(dataResponse.message);
      }
    };
    fetchData();
  }, [filterCategoryList]);

  useEffect(() => {
    // Get categories for URL
    const arrayOfCategory = Object.keys(selectCategory)
      .map((categoryKeyName) => {
        if (selectCategory[categoryKeyName]) {
          return categoryKeyName;
        }
        return null;
      })
      .filter((el) => el);

    setFilterCategoryList(arrayOfCategory);

    const urlFormat = arrayOfCategory.map((el) => `category=${el}`).join(",");

    // Combine both filters
    const combinedFilters = [urlFormat].filter(Boolean).join("&");

    // Navigate with updated URL
    navigate(`/product-category?${combinedFilters}`);
  }, [selectCategory]);

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target;

    setSortBy(value);

    if (value === "asc") {
      data.sort((a, b) => a.sellingPrice - b.sellingPrice);
    }

    if (value === "dsc") {
      data.sort((a, b) => b.sellingPrice - a.sellingPrice);
    }
    setData([...data]);
  };

  useEffect(() => {}, [sortBy]);
  useEffect(() => {
    productCategory().then((categories) => setCategories(categories));
  }, []);

  return (
    <div className="container h-full mx-auto p-4 ">
      {/***desktop version */}
      <div className="hidden lg:grid grid-cols-[200px,1fr] my-6 ">
        {/***left side */}
        <div className="bg-white p-2 min-h-[calc(100vh-120px)] lg:h-auto">
          {/**sort by */}
          <div className="">
            <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300">
              {t("sortby")}
            </h3>

            <form className="text-sm flex flex-col gap-2 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "asc"}
                  onChange={handleOnChangeSortBy}
                  value={"asc"}
                />
                <label>{t("pricelowtohigh")}</label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "dsc"}
                  onChange={handleOnChangeSortBy}
                  value={"dsc"}
                />
                <label>{t("pricehightolow")}</label>
              </div>
            </form>
          </div>

          {/**filter by */}
          <div className="">
            <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300">
              Doanh mục vật tư
            </h3>

            {/* <form className="text-sm flex flex-col gap-2 py-2">
              {productCategory.map((categoryName, index) => {
                return (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name={"category"}
                      checked={selectCategory[categoryName?.value]}
                      value={categoryName?.value}
                      id={categoryName?.value}
                      onChange={handleSelectCategory}
                    />
                    <label htmlFor={categoryName?.value}>
                      {t(categoryName?.label)}
                    </label>
                  </div>
                );
              })}
            </form> */}

            <form className="text-sm flex flex-col gap-2 py-2">
              {categories.map((category, index) => {
                return (
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name={"category"}
                      checked={selectCategory[category?.categoryName]}
                      value={category?.categoryName}
                      id={category?.categoryName}
                      onChange={handleSelectCategory}
                    />
                    <label htmlFor={category?.categoryName}>
                      {category?.categoryName}
                    </label>
                  </div>
                );
              })}
              <div className="flex items-center gap-3">
                <input type="checkbox" name={"category"} />
                <label>Khác</label>
              </div>
            </form>
          </div>

          <div className="">
            <form className="text-sm flex flex-col gap-2 py-2">
              {/* {
                          productCategory.map((categoryName,index)=>{
                            return(
                              <div className='flex items-center gap-3'>
                                 <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                                 <label htmlFor={categoryName?.value}>{t(categoryName?.label)}</label>
                              </div>
                            )
                          })
                        } */}
            </form>
          </div>
        </div>

        {/***right side ( product ) */}
        <div className="px-4 mb-6 ">
          <p className="font-medium text-slate-800 text-lg my-2">
          Kết quả tìm kiếm: {data.length}
          </p>

          <div className="min-h-[calc(100vh-120px)] " >
            {currentItems && !loading && (
              <VerticalCard data={currentItems} loading={loading} />
            )}
          </div>
          <PaginatedItems
            itemsPerPage={6}
            setCurrentItems={setCurrentItems}
            items={data}
          />
        </div>
        {/* {JSON.stringify(filterCategoryList)}
        {JSON.stringify(data)} */}
      </div>
    </div>
  );
};

export default CategoryProduct;

/* let loaiuudai
let uudai=0;
let tongtien=50000
function tinhtongtien(loaiuudai,uudai){
return loaiuudai==="%"?(tongtien-tongtien*uudai*0.01):(tongtien-uudai)
}
console.log(tinhtongtien("%",100))


 */
