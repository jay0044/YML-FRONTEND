import React, { useContext, useEffect, useState } from "react";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdCheckCircle, MdDelete, MdPayments } from "react-icons/md";
import { IoIosAddCircle, IoMdCart } from "react-icons/io";
import Context from "../context/";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import { useCart } from "../context/CartContext";
import { uploadAddress } from "../helpers/uploadAddress";
import axios from "axios";
import Loader from "../components/Loader";
import { RiLoginCircleFill } from "react-icons/ri";
import { FaLocationCrosshairs } from "react-icons/fa6";
import {
  FaMapMarkedAlt,
  FaChevronUp,
  FaChevronDown,
  FaPlusCircle,
  FaTimesCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import OrderSuccessModal from "../components/OrderSuccessModal";

const Cart = () => {
  const { authToken } = useContext(Context); // Get the authToken from Context
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser(); // Assuming setUser is available to update user context
  const { updateCartProductCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasAddress, setHasAddress] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(user?.address[0]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { fetchCartData } = useCart();

  const validPincodes = [
    "411057",
    "411033",
    "411028",
    "411013",
    "410506",
    "412303",
    "412108",
    "411014",
    "411009",
    "411001",
  ];

  const [address, setAddress] = useState({
    name: "",
    mobileNo: "",
    street: "",
    city: "Pune", // Prefill with "Pune"
    state: "Maharashtra", // Prefill with "Maharashtra"
    zip: "",
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the state is Maharashtra (it should always be)
    if (address.state !== "Maharashtra") {
      alert("Please enter an address in Maharashtra");
      return;
    }

    if (!validPincodes.includes(address.zip)) {
      alert("Delivery is not available for this pincode.");
      return;
    }

    // Here, you can update the user data with the new address
    try {
      await uploadAddress(address, setUserData, authToken); // Upload the new address

      // After uploading, fetch the updated user data with the latest addresses
      const updatedUser = { ...user, address: [...user.address, address] }; // Add the new address to the user's address array locally

      setUser(updatedUser); // Update the user in context to trigger a re-render
    } catch (error) {
      console.error("Error uploading address:", error);
    }

    // Close the address form after submission
    setShowAddressForm(false);
  };

  // Fetch street suggestions from Nominatim for Maharashtra
  const fetchStreetSuggestions = async (query) => {
    if (query.length < 3) return; // Avoid too many API calls for short queries
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?street=${query}&state=Maharashtra&countrycodes=IN&format=json`
      );
      setStreetSuggestions(response.data.map((item) => item.display_name));
    } catch (error) {
      console.error("Error fetching street suggestions:", error);
    }
  };

  // Fetch city suggestions for Maharashtra only
  const fetchCitySuggestions = async (query) => {
    if (query.length < 3) return;
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?city=${query}&state=Maharashtra&countrycodes=IN&format=json`
      );
      setCitySuggestions(response.data.map((item) => item.display_name));
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  };

  // Update street input and fetch suggestions
  const handleStreetChange = (e) => {
    const { value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, street: value }));
    fetchStreetSuggestions(value);
  };

  // Update city input and fetch suggestions
  const handleCityChange = (e) => {
    const { value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, city: value }));
    fetchCitySuggestions(value);
  };

  const handlePincodeChange = (e) => {
    const newPincode = e.target.value;

    setAddress((prev) => ({ ...prev, zip: newPincode }));

    // Check if the pincode is valid
    if (!validPincodes.includes(newPincode)) {
      setErrorMessage("Delivery is not available for this pincode");
    } else {
      setErrorMessage("");
    }
  };

  // Toggle the address form
  const handleAddNewAddress = () => {
    setShowAddressForm((prevState) => !prevState);

    if (!showAddressForm) {
      setAddress({
        name: "",
        mobileNo: "",
        street: "",
        city: "Pune",
        state: "Maharashtra",
        zip: "",
      });
    }
  };

  const deleteAddress = async (id, userId) => {
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
        setShowAllAddresses(false); // Hide form once an address is selected
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete address");
    }
  };

  // Handle address selection
  const handleSelectAddress = (addres) => {
    setSelectedAddress(addres);
    setShowAllAddresses(false); // Hide form once an address is selected
  };

  const fetchData = async (authToken) => {
    try {
      let cartData;

      if (authToken) {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
          method: SummaryApi.addToCartProductView.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const responseData = await response.json();
        if (responseData.success) {
          cartData = responseData.data;
          console.log("Cart fetched from server:", cartData);
        } else {
          console.error("Failed to fetch cart data from server");
          cartData = [];
        }
      } else {
        const localCartData = localStorage.getItem("guestCart");
        cartData = localCartData ? JSON.parse(localCartData) : [];
        console.log("Cart fetched from localStorage:", cartData);
      }

      // Important: Force new reference
      setData(Array.isArray(cartData) ? [...cartData] : []);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setHasAddress(!!user.address);
      setSelectedAddress(user?.address[0]);
    }
    fetchData(authToken); // Fetch cart data
  }, [user, authToken]);

  useEffect(() => {
    if (!loading && data.length > 0) {
      const validProducts = data.filter(
        (product) =>
          product.productId &&
          product.productId.quantity > 0 &&
          product.productId.quantity >= product.quantity
      );
      const total = validProducts.reduce((previousValue, currentValue) => {
        return (
          previousValue +
          currentValue.quantity * currentValue.productId.sellingPrice
        );
      }, 0);
      setTotalPrice(total);
      setFinalAmount(total);
    }
  }, [data, loading]);

  const totalQty = data
    .filter(
      (product) =>
        product.productId &&
        product.productId.quantity > 0 &&
        product.quantity > 0
    )
    .reduce(
      (previousValue, currentValue) => previousValue + currentValue.quantity,
      0
    );

  const increaseQty = async (id, qty, prdId) => {
    const response = await fetch(SummaryApi.updateCartProduct.url, {
      method: SummaryApi.updateCartProduct.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        _id: id,
        quantity: qty + 1,
        productId: prdId,
      }),
    });

    const responseData = await response.json();
    if (responseData.success) {
      fetchData(authToken); // Refresh the cart data
      await fetchCartData();
    } else {
      toast.error(responseData.message);
    }
  };

  const decreaseQty = async (id, qty, prdId) => {
    if (qty > 1) {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          _id: id,
          quantity: qty - 1,
          productId: prdId,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        fetchData(authToken); // Refresh the cart data
        await fetchCartData();
      } else {
        toast.error(responseData.message);
      }
    }
  };

  const deleteCartProduct = async (id) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ _id: id }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        toast.success("Product removed from cart!");
        fetchData(authToken);
        await fetchCartData();
        // updateCartProductCount(authToken);
      } else {
        toast.error(responseData.message || "Failed to remove product.");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product.");
      console.error("Delete Cart Product Error:", error);
    }
  };

  const handlePayment = async (finalAddress) => {
    if (!validPincodes.includes(selectedAddress.zip)) {
      toast.error("Delivery is not available for this pincode.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please add a delivery address.");
      return;
    }

    try {
      const validProducts = data.filter(
        (product) =>
          product.productId.quantity > 0 &&
          product.productId.quantity >= product.quantity
      );

      if (validProducts.length === 0) {
        toast.error("No valid products in your cart.");
        return;
      }

      const totalAmount = validProducts.reduce((prev, curr) => {
        return prev + curr.quantity * curr.productId.sellingPrice;
      }, 0);

      const response = await fetch(SummaryApi.createOrder.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          products: validProducts,
          userId: data[0].userId,
          deliveryAddress: finalAddress,
        }),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        toast.error("Unable to create order.");
        return;
      }

      const options = {
        key: "rzp_test_g1IWuCLSlC4Bqs",
        amount: responseData.order.amount,
        currency: responseData.order.currency,
        name: "YML Mart",
        description: "Payment for Order",
        image: "/logo.png",
        order_id: responseData.order.id,
        handler: async function (response) {
          const paymentResponse = await fetch(SummaryApi.payment_Success.url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              userId: data[0].userId,
              products: validProducts,
              amount: totalAmount,
              currency: "INR",
            }),
          });

          const paymentResult = await paymentResponse.json();

          if (paymentResult.success) {
            toast.success("Payment successful!", { duration: 5000 });
            setData([]);
            setShowModal(true);

            if (paymentResult.invoiceUrl) {
              window.open(paymentResult.invoiceUrl, "_blank");
            }

            try {
              const response = await fetch(SummaryApi.clear_cart.url, {
                method: SummaryApi.clear_cart.method,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
              });

              const result = await response.json();
              if (result.success) {
                toast.success("Cart cleared successfully.");
              } else {
                toast.error("Failed to clear cart on server.");
              }
            } catch (error) {
              console.error("Error while clearing cart:", error);
              toast.error("An error occurred while clearing the cart.");
            }
          } else {
            toast.error("Payment successful, but order failed to save.");
          }
        },
        prefill: {
          name: user?.name || "Your Name",
          email: user?.email || "Your Email",
          contact: user?.contact || "Your No.",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function (response) {
        toast.error("Payment Failed");
      });
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An unexpected error occurred during payment.");
    }
  };

  // Calculate percentage off
  const calculateDiscountPercentage = (price, sellingPrice) => {
    if (price > 0) {
      return Math.round(((price - sellingPrice) / price) * 100);
    }
    return 0;
  };

  return (
    <div className="container mx-auto flex flex-col lg:flex-row gap-8 py-10">
      {/*** Left Column - LOGIN, Delivery Address, Payment ***/}
      <div className="w-full lg:w-[70%] bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        {/* LOGIN Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <RiLoginCircleFill className="text-2xl" />
              Login
            </h3>{" "}
            <MdCheckCircle className="text-green-500 text-xl" />
          </div>
          {isLoggedIn ? (
            <p className="text-gray-700 mt-2">{user?.name}</p>
          ) : (
            <p className="text-red-500 mt-2">
              First, Please log in to proceed.
            </p>
          )}
        </div>

        {/* Delivery Address */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <FaLocationCrosshairs className="text-2xl" />
              Delivery Address
            </h3>{" "}
            <MdCheckCircle className="text-green-500 text-xl" />
          </div>
          {selectedAddress ? (
            <div className="text-gray-700 space-y-1 mb-4">
              <p>
                <strong>{selectedAddress.name}</strong>,{" "}
                {selectedAddress.mobileNo}
              </p>
              <p>
                {selectedAddress.street}, {selectedAddress.city}
              </p>
              <p>
                {selectedAddress.state}, <strong>{selectedAddress.zip}</strong>
              </p>
            </div>
          ) : (
            <p className="text-red-500">No address provided.</p>
          )}

          {/* Address Actions */}
          <div className="flex items-center flex-wrap gap-4 shadow-sm">
            {/* Toggle Address Visibility Button */}
            <button
              className="flex items-center gap-2 text-sky-700 hover:text-white hover:bg-sky-600 border border-sky-600 px-3 py-1.5 rounded-md font-medium transition-all duration-300"
              onClick={() => setShowAllAddresses(!showAllAddresses)}
            >
              {showAllAddresses ? (
                <>
                  <FaChevronUp className="text-lg" />
                  Hide Addresses
                </>
              ) : (
                <>
                  <FaMapMarkedAlt className="text-lg" />
                  Change Address
                </>
              )}
            </button>

            {/* Add New Address Button */}
            <button
              className="flex items-center gap-2 text-green-700 hover:text-white hover:bg-green-600 border border-green-600 px-3 py-1.5 rounded-md font-medium transition-all duration-300"
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
          {/* New Address Form */}
          {showAddressForm && (
            <form className="grid gap-4 mt-6 max-w-2xl" onSubmit={handleSubmit}>
              {/* Name and Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
                <input
                  type="text"
                  name="mobileNo"
                  placeholder="Mobile Number"
                  value={address.mobileNo}
                  onChange={(e) =>
                    setAddress({ ...address, mobileNo: e.target.value })
                  }
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
              </div>

              {/* Street and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={address.street}
                    onChange={handleStreetChange}
                    className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                    required
                  />
                  {streetSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-md max-h-40 overflow-auto">
                      {streetSuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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

                <div className="relative">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={address.city}
                    onChange={handleCityChange}
                    className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-sky-400"
                    readOnly
                    required
                  />
                  {citySuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-md max-h-40 overflow-auto">
                      {citySuggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setAddress((prev) => ({
                              ...prev,
                              city: suggestion,
                            }));
                            setCitySuggestions([]);
                          }}
                        >
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* State and Pincode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
                <input
                  type="number"
                  name="zip"
                  placeholder="PIN Code"
                  value={address.zip}
                  onChange={handlePincodeChange}
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
                  required
                />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md w-max mt-2"
              >
                Add New Address
              </button>
            </form>
          )}
          {/* Show All Addresses */}
          {showAllAddresses && (
            <div className="mt-6 space-y-4">
              {user?.address?.length > 0 ? (
                user.address.map((addr, index) => (
                  <div
                    key={index}
                    className="p-4 border border-sky-700 rounded-md bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center"
                  >
                    <div className="text-gray-700">
                      <p>
                        <strong>{addr.name}</strong>, {addr.mobileNo}
                      </p>
                      <p>
                        {addr.street}, {addr.city}
                      </p>
                      <p>
                        {addr.state} - <strong>{addr.zip}</strong>
                      </p>
                    </div>
                    <div className="flex gap-4 mt-2 md:mt-0">
                      <button
                        className="text-white font-medium text-sm bg-green-600 p-2 rounded-md"
                        onClick={() => handleSelectAddress(addr)}
                      >
                        Select
                      </button>
                      <button
                        className="text-red-500 hover:text-white hover:bg-red-600 rounded-full p-1 transition rounded-full"
                        onClick={() => deleteAddress(addr._id, user._id)}
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-500">No addresses available.</p>
              )}
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="p-6 bg-gray-50">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4">
            <MdPayments className="text-2xl" />
            Payment
          </h3>{" "}
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-md w-max"
            onClick={() => handlePayment(selectedAddress)}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      {/*** Right Column - My Cart Summary ***/}
      <div className="w-full lg:w-[30%] bg-white border border-gray-200 rounded-2xl shadow-xl p-6 space-y-6">
        {/* Cart Header */}
        <div className="flex justify-between items-center">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <IoMdCart className="text-3xl" />
            My Cart
          </h3>
          <span className="text-sm text-white bg-sky-700 px-2 py-1 rounded-md">
            {totalQty} item{totalQty > 1 ? "s" : ""}
          </span>
        </div>

        {/* Product List */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {loading ? (
            <Loader />
          ) : (
            data.map((product) => {
              if (!product.productId) return null;

              const isOutOfStock = product.productId.quantity === 0;
              const isPartialStock =
                product.productId.quantity < product.quantity;

              return (
                <div
                  key={product._id}
                  className={`flex gap-4 border-b pb-4 ${
                    isOutOfStock || isPartialStock ? "opacity-50" : ""
                  }`}
                >
                  {/* Image & Stock Label */}
                  <div className="relative w-20 h-20 border rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    <img
                      src={product.productId.productImage[0]}
                      alt={product.productId.productName}
                      className="w-full h-full object-contain"
                    />
                    {isOutOfStock && (
                      <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-xs font-semibold text-center py-1">
                        Out of Stock
                      </div>
                    )}
                    {isPartialStock && !isOutOfStock && (
                      <div className="absolute top-0 left-0 w-full bg-yellow-500 text-white text-xs font-semibold text-center py-1">
                        Only {product.productId.quantity} left
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      {/* Product Name */}
                      <p className="text-sm font-semibold text-gray-800">
                        {product.productId.productName}
                      </p>

                      {/* MRP and Discount Badge */}
                      {product.productId.price >
                        product.productId.sellingPrice && (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 line-through">
                            {displayINRCurrency(
                              product.quantity * product.productId.price
                            )}
                          </p>
                          <span className="text-xs text-red-600 font-semibold">
                            {calculateDiscountPercentage(
                              product.productId.price,
                              product.productId.sellingPrice
                            )}
                            % OFF
                          </span>
                        </div>
                      )}

                      {/* If no discount, show MRP only */}
                      {product.productId.price <=
                        product.productId.sellingPrice && (
                        <p className="text-xs text-gray-400">
                          {displayINRCurrency(
                            product.quantity * product.productId.price
                          )}
                        </p>
                      )}

                      {/* Selling Price */}
                      <p className="text-sm text-green-600 font-bold">
                        {displayINRCurrency(
                          product.quantity * product.productId.sellingPrice
                        )}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="w-6 h-6 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
                        onClick={() =>
                          decreaseQty(
                            product?._id,
                            product?.quantity,
                            product.productId._id
                          )
                        }
                        disabled={isOutOfStock}
                      >
                        -
                      </button>
                      <span className="text-sm">{product?.quantity}</span>
                      <button
                        className="w-6 h-6 rounded-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center"
                        onClick={() =>
                          increaseQty(
                            product?._id,
                            product?.quantity,
                            product.productId._id
                          )
                        }
                        disabled={isOutOfStock || isPartialStock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delete */}
                  <div className="flex items-start">
                    <button
                      className="text-red-600 hover:bg-red-600 hover:text-white p-1 rounded-full"
                      onClick={() => deleteCartProduct(product?._id)}
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delivery Notice */}
        <div className="flex items-center p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-700 text-sm">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"
            ></path>
          </svg>
          This delivery is available in{" "}
          <strong className="ml-1">Pune Location Only</strong>
        </div>

        {/* Cart Summary */}
        <div className="space-y-2 border-t pt-4">
          {/* Notice about delivery condition */}
          <div className="text-xs text-red-500 italic pl-1 font-medium">
            {totalPrice < 500
              ? "Free delivery on orders above ₹500"
              : "You’ve unlocked free delivery!"}
          </div>
          {/* Delivery Charges */}
          <div className="flex justify-between text-sm">
            <span
              className={
                totalPrice < 500
                  ? "text-gray-800 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              Delivery Charges
            </span>
            <span
              className={
                totalPrice < 500
                  ? "text-gray-800 font-semibold"
                  : "text-green-600 font-semibold"
              }
            >
              {totalPrice < 500 ? "₹40" : "Free"}
            </span>
          </div>

          {/* Discount */}
          <div className="flex justify-between text-sm text-gray-800 font-semibold">
            <span>Discount</span>
            <span>{displayINRCurrency(0)}</span>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total</span>
            <span>{displayINRCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>

      <OrderSuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Cart;
