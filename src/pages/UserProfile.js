import React, { useState, useEffect, useContext } from "react";
import {
  FaTimes,
  FaBars,
  FaUser,
  FaMapMarkedAlt,
  FaIdCard,
  FaUserCheck,
  FaUserShield,
  FaPlusCircle,
} from "react-icons/fa";
import { BsBagXFill, BsFillCartCheckFill } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileIcons from "../assest/profile.png";
import axios from "axios";
import SummaryApi from "../common/index";
import toast from "react-hot-toast";
import { uploadAddress } from "../helpers/uploadAddress";
import Context from "../context/index";
import profile from "../assest/profile.png";
import {
  FaTruck,
  FaBox,
  FaTimesCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaMotorcycle,
} from "react-icons/fa";
import { MdLocalShipping, MdCancel } from "react-icons/md";
// import { BsBagXFill } from "react-icons/bs";
import { RiShoppingCartFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle, IoMdCart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaLocationDot } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";
import { HiOutlineIdentification } from "react-icons/hi";
import { AiOutlineCalendar } from "react-icons/ai";

const Profile = () => {
  // const [activeSection, setActiveSection] = useState("Profile Information");
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useSelector((state) => state?.user?.user);
  const [orderData, setOrderData] = useState(null);
  const [kycDetails, setKycDetails] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const { authToken } = useContext(Context); // Get the authToken from Context
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const sidebarItems = [
    { label: "Profile Information", icon: <FaUser /> },
    { label: "My Orders", icon: <FaBox /> },
    { label: "Address", icon: <FaMapMarkedAlt /> },
    { label: "Delivered", icon: <FaCheckCircle /> },
    { label: "KYC Verification Status", icon: <FaIdCard /> },
  ];
  const [activeSection, setActiveSection] = useState(
    sidebarItems[0]?.label || ""
  );
  // Time updater
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Load data from localStorage if available, otherwise fetch from API
    const savedName = localStorage.getItem("userName");
    const savedEmail = localStorage.getItem("userEmail");

    if (savedName && savedEmail) {
      setName(savedName);
      setEmail(savedEmail);
    } else {
      const fetchUserData = async () => {
        try {
          const response = await fetch(SummaryApi.current_user.url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          const data = await response.json();
          setUserData(data.data);
          setName(data.data.name);
          setEmail(data.data.email);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [authToken]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    // Save updated data to state and localStorage
    setUserData((prevData) => ({
      ...prevData,
      name: name,
      email: email,
    }));
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const [address, setAddress] = useState({
    name: "",
    mobileNo: "",
    street: "",
    city: "Pune", // Default city as Pune
    state: "Maharashtra", // Default state as Maharashtra
    zip: "",
  });

  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]); // Not needed, but keeping it if required for other uses

  const handleAddNewAddress = () => {
    setShowAddressForm((prevState) => !prevState);
    if (!showAddressForm) {
      setAddress({
        name: "",
        mobileNo: "",
        street: "",
        city: "Pune", // Reset city to Pune
        state: "Maharashtra", // Reset state to Maharashtra
        zip: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (address.state !== "Maharashtra") {
      alert("Please enter an address in Maharashtra");
      return;
    }
    await uploadAddress(address, setUserData, authToken);
    console.log(userData);
    setShowAddressForm(false);
  };
  useEffect(() => {
    if (userData?.address?.length > 0) {
      console.log("Updated addresses:", userData.address);
    }
  }, [userData]);

  // Fetch street suggestions from Nominatim for streets in Pune, Maharashtra
  const fetchStreetSuggestions = async (query) => {
    if (query.length < 3) return; // Avoid too many API calls for short queries
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?street=${query}&city=Pune&state=Maharashtra&countrycodes=IN&format=json`
      );
      setStreetSuggestions(response.data.map((item) => item.display_name));
    } catch (error) {
      console.error("Error fetching street suggestions:", error);
    }
  };

  // Update street input and fetch suggestions
  const handleStreetChange = (e) => {
    const { value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, street: value }));
    fetchStreetSuggestions(value);
  };

  const fetchKycStatus = async (authToken, userId) => {
    // Replace the :userId in the URL with the actual userId
    const urlWithUserId = SummaryApi.getmykyc.url.replace(":userId", userId);
    try {
      const response = await fetch(urlWithUserId, {
        method: SummaryApi.getmykyc.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      setKycDetails(data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleKYCClick = () => {
    navigate("/businessprofile");
  };
  const handledelete = () => {
    navigate("/request-for-delete-account");
  };
  useEffect(() => {
    const fetchUserData = async (authToken) => {
      // const authToken = localStorage.getItem('authToken');

      try {
        const response = await fetch(SummaryApi.current_user.url, {
          method: SummaryApi.current_user.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setUserData(data.data);
        setOrderData(data.orderDetail);
        console.log("Full User Data", data);
        console.log("Order Data", data.orderDetail);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUserData(authToken);
  }, []);

  const deleteAddress = async (id, userId, authToken) => {
    try {
      const response = await fetch(SummaryApi.deleteAddress.url, {
        method: SummaryApi.deleteAddress.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          AddressId: id,
          userId: userId,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        setUserData((prevData) => ({
          ...prevData,
          address: responseData.data?.address || [], // Ensure address is always an array
        }));
        alert("Address deleted successfully");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete address");
    }
  };

  const StarRating = ({ itemId, initialRating, onSave }) => {
    const [rating, setRating] = useState(initialRating || 0);

    const handleClick = (newRating) => {
      setRating(newRating);
      onSave(itemId, newRating); // Trigger the save callback
    };

    return (
      <div className="flex items-center space-x-1">
        {" "}
        {/* Flex container to align stars horizontally */}
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`cursor-pointer ${
              index < rating ? "text-yellow-500" : "text-gray-300"
            }`}
            onClick={() => handleClick(index + 1)}
          />
        ))}
      </div>
    );
  };

  const [ratedItems, setRatedItems] = useState({});

  // Fetch rated items from localStorage on initial load
  useEffect(() => {
    const savedRatings = localStorage.getItem("ratedItems");
    if (savedRatings) {
      setRatedItems(JSON.parse(savedRatings));
    }
  }, []);

  const handleSaveRating = async (itemId, rating) => {
    try {
      const response = await fetch(SummaryApi.saveRating.url, {
        method: SummaryApi.saveRating.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, rating }),
      });
      if (!response.ok) {
        throw new Error("Failed to save rating");
      }

      const result = await response.json();
      if (result.success) {
        const updatedRatedItems = { ...ratedItems, [itemId]: true };
        setRatedItems(updatedRatedItems);
        localStorage.setItem("ratedItems", JSON.stringify(updatedRatedItems)); // Save to localStorage
        toast.success("Thanks for rating!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        throw new Error(result.message || "Failed to save rating");
      }
    } catch (error) {
      console.error("Error saving rating:", error);
      toast.error("Error saving rating. Please try again.");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to return the appropriate icon for each delivery status
  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "ordered":
        return <RiShoppingCartFill className="text-yellow-600 text-2xl" />;
      case "shipped":
        return <FaTruck className="text-blue-600 text-2xl" />;
      case "in-transit":
        return <MdLocalShipping className="text-orange-500 text-2xl" />;
      case "delivered":
        return <FaCheckCircle className="text-green-600 text-2xl" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-600 text-2xl" />;
      case "processing":
        return <FaHourglassHalf className="text-purple-600 text-2xl" />; // Add a processing icon
      case "out of delivery": // Make sure it's lowercase
        return <FaMotorcycle className="text-indigo-600 text-2xl" />; // Add out-for-delivery icon
      default:
        return <FaBox className="text-gray-500 text-2xl" />;
    }
  };

  // Function to render content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case "Profile Information":
        return (
          <div className="p-6 m-4 bg-sky-50 min-h-screen rounded-lg border border-gray-300">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-sky-700 mb-5">
              <FaUser className="text-green-600" />
              Profile Information
            </h1>

            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={ProfileIcons}
                  alt="Profile"
                  className="w-20 h-20 rounded-full shadow-md"
                />
              </div>
              <h2 className="text-xl font-bold mt-3 text-sky-700">
                {name.toUpperCase()}
              </h2>
            </div>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-lg transition w-full"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition w-full"
                  >
                    Save
                  </button>
                )}
                <button
                  type="button"
                  onClick={handledelete}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition w-full"
                >
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        );
      case "My Orders":
        return (
          <div className="p-4 md:p-6 m-1 md:m-4 bg-sky-50 min-h-screen rounded-lg border border-gray-300">
            <h1 className="flex items-center gap-2 font-bold text-sky-700 mb-2 text-xl md:text-2xl">
              <FaBox className="text-green-600" /> All Orders
            </h1>

            {orderData ? (
              <div className="w-full max-w-8xl">
                {orderData.length > 0 ? (
                  <>
                    <h2 className="flex justify-center items-center gap-2 text-xl md:text-2xl font-bold mb-2 text-sky-700">
                      <TbListDetails /> Order Summary
                    </h2>
                    {orderData
                      .filter((order) => order.status !== "created")
                      .map((order) => (
                        <div
                          key={order._id}
                          className="mb-8 border border-gray-300 rounded-xl bg-white shadow-md p-4 space-y-4"
                        >
                          {/* ✅ Order Summary */}
                          <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 text-sm md:text-md">
                            <div className="space-y-1 text-gray-700">
                              <p className="flex items-center gap-2">
                                <HiOutlineIdentification className="text-sky-700 text-lg" />
                                <span className="font-bold">Order ID :</span>{" "}
                                {order.order_id}
                              </p>
                              <p className="flex items-center gap-2">
                                <AiOutlineCalendar className="text-sky-700 text-lg" />
                                <span className="font-bold">Date :</span>{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>

                            <div className="mt-2 md:mt-0 text-right text-sm md:text-md space-y-1">
                              <p className="text-blue-600 font-bold flex items-center justify-end gap-1">
                                {getStatusIcon(order.deliveryStatus)}
                                Tracking :{" "}
                                {order.status === "created"
                                  ? "Order Failed"
                                  : order.deliveryStatus}
                              </p>
                              <p className="text-green-700 font-bold">
                                Payment : {order.status}
                              </p>
                            </div>
                          </div>

                          {/* ✅ Products List */}
                          {order.products.map((product) => (
                            <div
                              key={product._id}
                              className="relative flex flex-col md:flex-row gap-4 border border-sky-500 bg-sky-50 p-4 rounded-lg shadow-sm mb-4"
                            >
                              {/* ✅ Left Side: Product Image */}
                              <div className="h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden border border-gray-300 shrink-0 mx-auto md:mx-0">
                                <img
                                  src={product.image[0]}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              {/* ✅ Right Side: Info Block */}
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h3
                                  className="text-sm md:text-lg font-bold text-gray-800 truncate"
                                  title={product.name}
                                >
                                  {product.name}
                                </h3>

                                <div className="mt-1 space-y-1 text-sm text-gray-600">
                                  <p>
                                    <strong>Category :</strong>{" "}
                                    {product.category}
                                  </p>
                                  <p>
                                    <strong>Quantity :</strong>{" "}
                                    {product.quantity}
                                  </p>
                                  <p>
                                    <strong>Total :</strong>{" "}
                                    <span className="font-bold text-sky-800">
                                      ₹{product.price * product.quantity}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center mt-10 text-gray-500">
                    <BsBagXFill className="text-sky-600 text-6xl mb-4" />
                    <p className="text-xl font-semibold">No orders found!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mt-10 text-gray-500">
                <BsBagXFill className="text-sky-600 text-6xl mb-4" />
                <p className="text-xl font-semibold">No orders found!</p>
              </div>
            )}
          </div>
        );
      case "Address":
        return (
          <div className="p-6 m-4 bg-sky-50 min-h-screen rounded-lg border border-gray-300">
            <h1 className="flex items-center gap-2 font-bold text-sky-700 mb-5 text-2xl">
              <FaLocationDot className="text-green-600" />
              Manage Addresses
            </h1>

            {/* Add New Address Button */}
            <div className="flex items-center gap-2 mb-4 justify-end">
              <button
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-medium transition-all duration-300 justify-end
                ${
                  showAddressForm
                    ? "text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
                    : "text-sky-700 border border-sky-600 hover:bg-sky-600 hover:text-white"
                }`}
                onClick={handleAddNewAddress}
              >
                {showAddressForm ? (
                  <>
                    <FaTimesCircle className="text-lg" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FaPlusCircle className="text-lg" />
                    Add New Address
                  </>
                )}
              </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <form
                className="bg-white rounded-xl shadow-lg p-6 mb-8 space-y-4 animate-fadeIn"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                    required
                  />
                  <input
                    type="text"
                    name="mobileNo"
                    placeholder="Mobile Number"
                    value={address.mobileNo}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        mobileNo: e.target.value,
                      }))
                    }
                    className="border p-3 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                    required
                  />
                </div>

                {/* Street Suggestions */}
                <div>
                  <input
                    type="text"
                    name="street"
                    placeholder="Street / Locality"
                    value={address.street}
                    onChange={handleStreetChange}
                    className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none"
                    required
                  />
                  {streetSuggestions.length > 0 && (
                    <ul className="mt-1 border rounded-lg shadow bg-white max-h-40 overflow-y-auto">
                      {streetSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="p-2 hover:bg-sky-100 cursor-pointer"
                          onClick={() => {
                            setAddress((prev) => ({
                              ...prev,
                              street: suggestion,
                            }));
                            setStreetSuggestions([]);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* City & State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed border p-3 rounded-lg"
                  />
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed border p-3 rounded-lg"
                  />
                </div>

                {/* Pincode Dropdown */}
                <select
                  name="zip"
                  value={address.zip}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, zip: e.target.value }))
                  }
                  className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-sky-500 outline-none"
                  required
                >
                  <option value="" disabled>
                    Select Pincode
                  </option>
                  <option value="411057">411057</option>
                  <option value="411033">411033</option>
                  <option value="411028">411028</option>
                  <option value="411013">411013</option>
                  <option value="410506">410506</option>
                  <option value="412303">412303</option>
                  <option value="412108">412108</option>
                  <option value="411014">411014</option>
                  <option value="411009">411009</option>
                  <option value="411001">411001</option>
                </select>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
                  Save Address
                </button>
              </form>
            )}

            {/* Address Cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {userData?.address?.length > 0 ? (
                userData.address.map((addr, index) => (
                  <div
                    key={index}
                    className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition hover:shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {addr.name}
                      </h2>
                      <div
                        className="text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full cursor-pointer transition"
                        onClick={() => deleteAddress(addr._id, userData._id)}
                        title="Delete Address"
                      >
                        <MdDelete fontSize={20} />
                      </div>
                    </div>

                    <div className="mt-3 text-gray-700">
                      <p className="text-sm">{addr.mobileNo}</p>
                      <p className="mt-1 text-sm">
                        {addr.street}, {addr.city},<br />
                        {addr.state} – <strong>{addr.zip}</strong>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-6">
                  <p className="text-red-500 font-medium">
                    No addresses provided.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case "Delivered":
        return (
          <div className="p-6 m-4 bg-sky-50 min-h-screen rounded-lg border border-gray-300">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-sky-700 mb-8 flex-wrap">
              <FaCheckCircle className="text-green-500" />
              Delivered Items
            </h1>

            {orderData.filter(
              (order) => order.deliveryStatus.toLowerCase() === "delivered"
            ).length > 0 ? (
              orderData
                .filter(
                  (order) => order.deliveryStatus.toLowerCase() === "delivered"
                )
                .map((order) => (
                  <div key={order._id} className="mb-6">
                    <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-md space-y-4">
                      {order.products.map((product) => (
                        <div
                          key={product._id}
                          className="relative flex flex-col md:flex-row gap-4 border border-sky-500 bg-sky-50 p-4 rounded-lg shadow-sm"
                        >
                          {/* ✅ Image Left */}
                          <div className="h-20 w-20 md:h-24 md:w-24 rounded-lg overflow-hidden border border-gray-300 shrink-0">
                            <img
                              src={product.image[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          {/* ✅ Right Content */}
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-sm md:text-lg font-bold text-gray-800 truncate"
                              title={product.name}
                            >
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Total Cost :</strong>{" "}
                              <span className="text-sky-700 font-bold">
                                ₹{product.price * product.quantity}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Delivered On :</strong>{" "}
                              {new Date(order.updatedAt).toLocaleString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>

                            {/* ✅ Mobile Rating Below */}
                            <div className="mt-2 block md:hidden">
                              {!ratedItems[product._id] ? (
                                <div className="flex items-center gap-2 bg-white bg-opacity-90 px-2 py-1 rounded shadow-md w-fit text-sm md:text-lg">
                                  <span className="text-red-600 font-bold ">
                                    Your Rating
                                  </span>
                                  <StarRating
                                    itemId={product._id}
                                    initialRating={product.rating}
                                    onSave={handleSaveRating}
                                  />
                                </div>
                              ) : (
                                <span className="text-green-600 font-bold bg-white px-2 py-1 rounded shadow-md w-fit text-sm md:text-lg">
                                  ⭐ Thanks for your rating!
                                </span>
                              )}
                            </div>
                          </div>

                          {/* ✅ Desktop Rating Top Right */}
                          <div className="hidden md:block absolute top-3 right-3 text-sm z-10">
                            {!ratedItems[product._id] ? (
                              <div className="flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded shadow-md w-fit">
                                <span className="text-red-600 font-bold">
                                  Your Rating
                                </span>
                                <StarRating
                                  itemId={product._id}
                                  initialRating={product.rating}
                                  onSave={handleSaveRating}
                                />
                              </div>
                            ) : (
                              <span className="text-green-600 font-bold bg-white px-2 py-1 rounded shadow-md w-fit">
                                ⭐ Thanks for your rating!
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center text-center mt-10 text-gray-500">
                <BsBagXFill className="text-sky-600 text-6xl mb-4" />
                <p className="text-xl font-semibold">
                  No delivered items found!
                </p>
              </div>
            )}
          </div>
        );
      case "KYC Verification Status":
        const statusColors = {
          Rejected: "text-red-500 bg-red-100 border-red-500",
          Pending: "text-yellow-500 bg-yellow-100 border-yellow-500",
          Verified: "text-green-500 bg-green-100 border-green-500",
          undefined: "text-blue-500 bg-blue-100 border-blue-500", // Default when status is undefined
        };

        if (!kycDetails) {
          return (
            <div className="p-6 m-4 bg-sky-50 min-h-screen rounded-lg border border-gray-300">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-sky-700 mb-8 flex-wrap">
                {" "}
                <FaUserShield className="text-green-600" />
                KYC Verification Status
              </h1>
              <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-red-600 bg-red-100 rounded-full border border-red-600">
                    KYC Pending
                  </span>

                  <p className="text-gray-700 mb-6 font-medium">
                    To access all features, please complete your KYC
                    verification.
                  </p>

                  <button
                    onClick={handleKYCClick}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-10 font-semibold rounded-full shadow-md transition-all duration-300"
                  >
                    Complete KYC
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-6">
              <FaIdCard className="text-blue-600 text-3xl" />
              My KYC Status
            </h1>

            <div className="flex flex-col items-center text-center">
              <p className="text-lg font-medium text-gray-700 mb-3">
                Your KYC status is:
              </p>

              <div
                className={`text-sm font-semibold px-4 py-2 rounded-full border transition-all duration-300 ${
                  statusColors[kycDetails.kycStatus] ||
                  "text-gray-500 bg-gray-100 border-gray-500"
                }`}
              >
                {kycDetails.kycStatus || "Not Started"}
              </div>

              {!kycDetails.kycStatus && (
                <button
                  onClick={handleKYCClick}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300"
                >
                  Complete KYC Now
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-br from-sky-700 to-sky-500 fixed z-40 w-72 min-h-screen  transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-white font-bold text-lg">Dashboard</h2>
          <button onClick={toggleSidebar} className=" text-white text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center px-4 mb-4">
          <img
            src={user?.profilePic || profile}
            alt="profile"
            className="w-16 h-16 rounded-full mb-2"
          />
          <p className="text-white font-bold capitalize">
            {user?.name || "User"}
          </p>
          <p className="text-white text-sm">{user?.email}</p>
        </div>
        <hr className="border-white my-2" />

        {/* Navigation */}
        <nav className="px-4 mt-6 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveSection(item.label);
                if (window.innerWidth < 768) {
                  setSidebarOpen(false); // Close sidebar on small screens
                } else {
                  setSidebarOpen(true); // Keep open on medium and up
                }
              }}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-md transition-all font-semibold duration-200 shadow-sm
              ${
                activeSection === item.label
                  ? "bg-gradient-to-r from-green-800 via-green-700 to-lime-800 text-white shadow-md ring-2 ring-lime-400"
                  : "bg-white text-sky-700 hover:bg-sky-100 hover:text-black"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ✅ Overlay when sidebar is open on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/100 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Content Area */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        {/* Topbar */}
        {!sidebarOpen && (
          <div className="p-4 flex justify-between items-center bg-sky-700 text-white">
            <button
              onClick={toggleSidebar}
              className="text-white text-2xl"
              title="Open Sidebar"
            >
              <FaBars />
            </button>

            {/* Date/Time */}
            <div className="hidden md:flex text-lg font-bold gap-4">
              <p>{currentTime.toLocaleDateString()}</p>
              <p>{currentTime.toLocaleTimeString()}</p>
            </div>

            {/* Title */}
            <h1 className="font-bold text-lg">Welcome to the Dashboard</h1>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Profile;
