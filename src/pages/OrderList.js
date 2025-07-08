import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import ChangeDeliveryStatus from "../components/ChangeDeliveryStatus";
import * as XLSX from "xlsx"; // Import xlsx for Excel manipulation
import Loader from "../components/Loader";
import { useSeller } from "../context/SellerContext";
import { FiDownload, FiEdit2 } from "react-icons/fi";
import { FaClipboardList, FaUser } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import {
  FaBoxOpen,
  FaShippingFast,
  FaTruckMoving,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

const OrderList = () => {
  const [orderData, setOrderData] = useState([]);
  const { seller } = useSeller(); // Get seller data from context
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading
  const [updateDeliveryDetails, setUpdateDeliveryDetails] = useState({
    _id: "",
    deliveryStatus: "",
  });

  // Function to export data to Excel
  const exportToExcel = (orders) => {
    const worksheetData = [];

    // Prepare data for Excel
    orders.forEach((order, orderIndex) => {
      order.products.forEach((product, productIndex) => {
        worksheetData.push({
          "Sr. No.": orderIndex + 1,
          "Customer Name": order.userId?.name || "No name available",
          "Product Name": product.name || "No name available",
          Amount: `${order.amount} ₹`,
          "Payment Status": order.status || "No status available",
          "Delivery Status": order.deliveryStatus || "Ordered",
          "Delivery Address": `${order.deliveryAddress?.street || ""}, ${
            order.deliveryAddress?.city || ""
          }, ${order.deliveryAddress?.state || ""} - ${
            order.deliveryAddress?.zip || ""
          }`,
        });
      });
    });

    // Create a new workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "order_list.xlsx");
  };

  const fetchAllOrders = async () => {
    setLoading(true); // Set loading to true when fetching starts

    try {
      const response = await fetch(SummaryApi.getOrders.url);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setOrderData(data.orders);
      console.log(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChangeClick = (order) => {
    setUpdateDeliveryDetails(order);
    setOpenDropdown(true);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Ordered":
        return {
          icon: <FaBoxOpen className="text-sky-600" />,
          label: "Ordered",
          className: "bg-sky-100 text-sky-700 border-sky-300",
        };
      case "Processing":
        return {
          icon: <FaClock className="text-yellow-600" />,
          label: "Processing",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "Shipped":
        return {
          icon: <FaTruckMoving className="text-indigo-600" />,
          label: "Shipped",
          className: "bg-indigo-100 text-indigo-700 border-indigo-300",
        };
      case "In-transit":
        return {
          icon: <FaShippingFast className="text-blue-600" />,
          label: "In-Transit",
          className: "bg-blue-100 text-blue-700 border-blue-300",
        };
      case "Out Of Delivery":
        return {
          icon: <FaTruck className="text-orange-600" />,
          label: "Out For Delivery",
          className: "bg-orange-100 text-orange-700 border-orange-300 truncate",
        };
      case "Delivered":
        return {
          icon: <FaCheckCircle className="text-green-600" />,
          label: "Delivered",
          className: "bg-green-100 text-green-700 border-green-300",
        };
      case "Cancelled":
        return {
          icon: <FaTimesCircle className="text-red-600" />,
          label: "Cancelled",
          className: "bg-red-100 text-red-700 border-red-300",
        };
      default:
        return {
          icon: <FaBoxOpen className="text-gray-500" />,
          label: "Unknown",
          className: "bg-gray-100 text-gray-700 border-gray-300",
        };
    }
  };

  return (
    // <div className="p-6 bg-gray-50 min-h-screen">
    //     <div className="flex justify-between items-center mb-6">
    //         <h2 className="text-3xl font-semibold text-gray-800">Order List</h2>
    //         <button
    //             className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
    //             onClick={() => exportToExcel(orderData)}
    //         >
    //             Get Excel Sheet
    //         </button>
    //     </div>
    //     {loading ? ( // Conditionally render Loader when loading is true
    //         <div className="flex justify-center items-center w-full h-64">
    //             <Loader /> {/* Display Loader */}
    //         </div>
    //     ) : (
    //     <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
    //         <thead>
    //             <tr className="bg-gray-800 text-white text-left">
    //                 <th className="p-4">Sr. No.</th>
    //                 <th className="p-4">Customer Name</th>
    //                 <th className="p-4">Items</th>
    //                 <th className="p-4">Amount</th>
    //                 <th className="p-4">Payment Status</th>
    //                 <th className="p-4">Delivery Status</th>
    //                 <th className="p-4">Delivery Address</th>
    //                 <th className="p-4">Actions</th>
    //             </tr>
    //         </thead>
    //         {orderData.map((order, orderIndex) => (
    //             <tbody key={orderIndex} className="border-b border-gray-200 divide-y divide-gray-200">
    //                 {order.products.map((product, productIndex) => (
    //                     <tr key={`${orderIndex}-${productIndex}`} className="bg-white hover:bg-gray-100">
    //                         {productIndex === 0 && (
    //                             <>
    //                                 <td
    //                                     rowSpan={order.products.length}
    //                                     className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200"
    //                                 >
    //                                     {orderIndex + 1}
    //                                 </td>
    //                                 <td
    //                                     rowSpan={order.products.length}
    //                                     className="p-4 text-center font-semibold text-gray-700 border-r border-gray-200"
    //                                 >
    //                                     {order.userId?.name || 'No name available'}
    //                                 </td>
    //                             </>
    //                         )}
    //                         <td className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
    //                             {product.name || 'No name available'}
    //                         </td>
    //                         {productIndex === 0 && (
    //                             <>
    //                                 <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
    //                                     {order.amount} ₹
    //                                 </td>
    //                                 <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
    //                                     {order.status || 'No status available'}
    //                                 </td>
    //                                 <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
    //                                     {order.deliveryStatus || 'Ordered'}
    //                                 </td>
    //                                 <td rowSpan={order.products.length} className="p-4 text-center font-medium text-gray-700 border-r border-gray-200">
    //                                     {order.deliveryAddress
    //                                         ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.zip}`
    //                                         : 'No address available'}
    //                                 </td>
    //                                 <td rowSpan={order.products.length} className="p-4 text-center">
    //                                     <button
    //                                         className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
    //                                         onClick={() => handleStatusChangeClick(order)}
    //                                     >
    //                                         Change Status
    //                                     </button>
    //                                 </td>
    //                             </>
    //                         )}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         ))}
    //     </table>
    //     )}

    //     {openDropdown && (
    //         <ChangeDeliveryStatus
    //             onClose={() => setOpenDropdown(false)}
    //             _id={updateDeliveryDetails._id}
    //             deliveryStatus={updateDeliveryDetails.deliveryStatus}
    //             callFunc={fetchAllOrders}
    //         />
    //     )}
    // </div>
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FaClipboardList className="text-black-600" />
          Order List
        </h2>
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition duration-200"
          onClick={() => exportToExcel(orderData)}
        >
          <FiDownload />
          Export as Excel
        </button>
      </div>

      {/* Loader or Table */}
      {loading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="min-w-full text-sm md:text-base border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4 text-center">SR No.</th>
                <th className="p-4 text-center">Customer Name</th>
                <th className="p-4 text-center">Ordered Items</th>
                <th className="p-4 text-center">Amount</th>
                <th className="p-4 text-center">Payment</th>
                <th className="p-4 text-center">Delivery Status</th>
                <th className="p-4 text-center">Address</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            {orderData.map((order, orderIndex) => (
              <tbody key={orderIndex}>
                <tr className="hover:bg-gray-50">
                  <td className="p-4 border font-semibold text-gray-700 align-top">
                    {orderIndex + 1}
                  </td>
                  <td className="p-4 border text-gray-700 align-top">
                    {order.userId?.name || "No name"}
                  </td>
                  <td className="p-4 border text-gray-600 align-top whitespace-pre-wrap break-words max-w-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      {(order.products || []).map((product, index) => (
                        <li key={index}>{product.name || "Unnamed Product"}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 border text-gray-700 font-medium align-top">
                    ₹ {order.amount}
                  </td>
                  <td className="p-4 border text-gray-700 font-medium align-top">
                    {order.status || "N/A"}
                  </td>
                  <td className="p-4 border align-top">
                    {(() => {
                      const status = getStatusStyle(
                        order.deliveryStatus || "Ordered"
                      );
                      return (
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${status.className}`}
                        >
                          {status.icon}
                          {status.label}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-4 border text-gray-700 align-top whitespace-pre-wrap">
                    {order.deliveryAddress ? (
                      <div className="space-y-1 leading-relaxed">
                        <div>
                          <span className="font-semibold text-gray-800">
                            Street:
                          </span>{" "}
                          {order.deliveryAddress.street}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">
                            City:
                          </span>{" "}
                          {order.deliveryAddress.city}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">
                            State:
                          </span>{" "}
                          {order.deliveryAddress.state}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">
                            Pincode:
                          </span>{" "}
                          {order.deliveryAddress.zip}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-800">
                            Mobile:
                          </span>{" "}
                          {order.deliveryAddress.mobileNo}
                        </div>
                      </div>
                    ) : (
                      "No address"
                    )}
                  </td>

                  <td className="p-4 border text-center align-top">
                    <button
                      className="flex items-center justify-center gap-2 bg-red-600 hover:from-indigo-600 hover:to-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
                      onClick={() => handleStatusChangeClick(order)}
                    >
                      <FiEdit2 />
                      <span className="font-medium">Change</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      )}

      {/* Change Status Modal */}
      {openDropdown && (
        <ChangeDeliveryStatus
          onClose={() => setOpenDropdown(false)}
          _id={updateDeliveryDetails._id}
          deliveryStatus={updateDeliveryDetails.deliveryStatus}
          callFunc={fetchAllOrders}
        />
      )}
    </div>
  );
};

export default OrderList;
