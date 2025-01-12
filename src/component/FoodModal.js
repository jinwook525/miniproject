import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-6xl w-11/12 shadow-lg relative space-y-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          ×
        </button>
        <div className="leading-tight">{children}</div> {/* Content container */}
      </div>
    </div>
  );
};

export default Modal;
