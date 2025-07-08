import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { FaShippingFast } from "react-icons/fa";

// const backend_Domin = process.env.REACT_APP_API_URL;
const backend_Domin = process.env.REACT_APP_LOCALHOST_URI;

const ChangeDeliveryStatus = ({ _id, deliveryStatus, onClose, callFunc }) => {
  const [newStatus, setNewStatus] = useState(deliveryStatus);

  const handleStatusChange = async () => {
    console.log(backend_Domin);
    try {
      const response = await fetch(`${backend_Domin}/api/orders/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update delivery status");
      }

      const data = await response.json();
      console.log("Delivery status updated:", data);
      callFunc(); // Refresh the order list
      onClose(); // Close the dropdown
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md mx-auto bg-white rounded-xl shadow-lg px-6 py-5 animate-fadeIn">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
          onClick={onClose}
        >
          <IoMdClose size={24} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-4">
          <FaShippingFast className="text-red-600 text-5xl" />
          <h2 className="text-xl font-semibold text-gray-800">
            Change Delivery Status
          </h2>
        </div>

        {/* Order ID */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 text-center">
            <span className="font-bold text-gray-800">Order ID : </span> {_id}
          </p>
        </div>

        {/* Status Select */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Select Status :
          </label>
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
          >
            <option value="Ordered">Ordered</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="In-transit">In-Transit</option>
            <option value="Out Of Delivery">Out Of Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleStatusChange}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded-lg shadow transition duration-300"
        >
          Update Status
        </button>
      </div>
    </div>
  );
};

export default ChangeDeliveryStatus;
