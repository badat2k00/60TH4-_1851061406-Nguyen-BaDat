import React from "react";

const Footer = () => {
  return (
    <footer className=" w-full pt-4  ">
      <div className="  w-full   bg-green-400  mx-auto justify-center items-start flex text-white gap-3 text-base">
        <div className="flex flex-col w-[30%] justify-center items-start h-full p-4">
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="flex flex-col w-[30%]  justify-center items-start p-4">
          <h1 className="text-lg">CHÍNH SÁCH KHÁCH HÀNG</h1>
          <div>Chính sách đổi trả hàng</div>
          <div>Quy định và hình thức thanh toán</div>
          <div>Chính sách bảo hành  </div>
          <div></div>
          <div></div>
        </div>
        <div className="flex flex-col w-[30%] justify-start items-start  h-full p-4">
          <h1 className="text-lg">THÔNG TIN LIÊN HỆ </h1>
          <div>Facebook vnFarm</div>
          <div className="clamp"></div>
          
        </div>
      </div>
      <h2 className="text-center">Bản quyền VNFARM 2025</h2>
    </footer>
  );
};

export default Footer;
