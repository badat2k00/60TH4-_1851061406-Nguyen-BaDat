import React from "react";
import { CgClose } from "react-icons/cg";
const Modal = ({ onClose, content, funcAllow, funcDeny,heading }) => {
  return (
    <div className="fixed flex  bg-slate-200 bg-opacity-50 top-0 left-0 right-0 bottom-0 justify-center items-center z-10">
      <div className="bg-white   p-4 rounded w-full max-w-2xl h-[50%] max-h-[80%] overflow-hidden">
        <div
          className="w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer"
          onClick={onClose}
        >
          <CgClose />
        </div>
      <h1 className="text-center text-xl">{heading}</h1>
      <p>{content}</p>
        <div className="flex flex-row justify-between">
          <button onClick={funcAllow}>Có</button>
          <button onClick={funcDeny}>Không</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
