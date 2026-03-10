import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const NotFound = () => {
  const currentUser = useSelector((state) => state?.user?.user);
  return (
    <>
      <div className='flex justify-center items-center h-full flex-col'>
        <h1 className='text-xl'>Không tìm thấy trang cần tìm</h1>
        <div>{currentUser?.role!=='ADMIN' ?(<Link to="/">Mua hàng tiếp </Link>)  : <Link to="/admin-panel">Trở lại </Link>}</div>
      </div>
      
    </>
  );
};

export default NotFound;
