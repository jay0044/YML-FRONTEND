// components/OrderSuccessModal.js
import React from "react";
import { Link } from "react-router-dom";

const OrderSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md">
        <div className="text-center">
          <img
            src="https://img.icons8.com/emoji/96/000000/check-mark-emoji.png"
            alt="Success"
            className="mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-green-600 mb-2">
            Order Successful!
          </h2>
          <p className="text-gray-700 mb-4">
            Thank you for shopping with <strong>YML Mart</strong>.<br />
            Your order has been placed successfully!
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <Link to="/" onClick={onClose}>
              <button className="bg-gradient-to-br from-sky-700 to-sky-500 text-white px-4 py-2 rounded hover:bg-gray-300 transition font-semibold">
                Continue Shopping
              </button>
            </Link>

            <Link to="/user-details" onClick={onClose}>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold">
                View My Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
