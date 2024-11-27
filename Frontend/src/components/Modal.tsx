import React, { ReactNode } from "react";

interface ModalProp {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
const Modal = ({ isOpen, onClose, children }:ModalProp) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-gray-700 bg-opacity-75 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-slate-950 rounded-lg shadow-lg w-96 p-2 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end mb-2">
          {/* <h2 className="text-xl font-semibold">{title}</h2> */}
          <button
            className="text-xl font-semibold text-red-500 hover:text-red-700"
            onClick={onClose}
          >
            X
          </button>
        </div>
        <div className="flex flex-col items-center">{children}</div>
        {/* <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Modal;
