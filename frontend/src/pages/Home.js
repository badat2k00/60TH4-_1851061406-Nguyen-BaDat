import React, { useEffect ,useState} from "react";
import CategoryList from "../components/CategoryList";
import VerticalCardProduct from "../components/VerticalCardProduct";
import Offer from "../components/Offer";
import productCategory from '../helpers/productCategory'


const Home = () => {
  const [categories,setCategories]=useState([])
  useEffect(()=>{
    productCategory().then(category=>setCategories(category))
  },[])
  return (
    <div>
      <CategoryList />
      <Offer />
      {categories.map(category=><>
      <VerticalCardProduct category={category.categoryName} heading={category?.categoryName} />
      
      </>)}
      <VerticalCardProduct category={"Khác"} heading={"Khác"} />
    </div>
  );
};

export default Home;
