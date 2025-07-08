import React, { useContext, useEffect, useState, useMemo } from "react";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdCheckCircle, MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import Context from "../context/";
import { useUser } from "../context/UserContext"; // Import the useUser hook
import { useCart } from "../context/CartContext";
import { uploadAddress } from "../helpers/uploadAddress";
import axios from "axios";
import Loader from "../components/Loader";
import { RiLoginCircleFill } from "react-icons/ri";

const GuestCart = () => {
  const { authToken } = useContext(Context); // Get the authToken from Context

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useUser(); // Assuming setUser is available to update user context
  const { updateCartProductCount } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const totalPrice = useMemo(() => {
    return data.reduce((acc, item) => {
      const price =
        item?.productDetails?.sellingPrice ??
        item?.productId?.sellingPrice ??
        0;
      return acc + item.quantity * price;
    }, 0);
  }, [data]);

  const totalQty = useMemo(() => {
    return data.reduce((acc, item) => acc + item.quantity, 0);
  }, [data]);

  const [hasAddress, setHasAddress] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(user?.address[0]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { fetchCartData } = useCart();

  // ✅ Fetch guest cart from localStorage
  const fetchData = () => {
    try {
      const localCartData = localStorage.getItem("guestCart");
      const parsed = localCartData ? JSON.parse(localCartData) : [];
      setData(parsed);
    } catch (error) {
      console.error("Error fetching guest cart:", error);
      setData([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update selected user & address when logged in
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setHasAddress(Array.isArray(user.address) && user.address.length > 0);
      setSelectedAddress(user.address?.[0]);
    }
  }, [user]);

  // ✅ Fetch cart on load
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && data.length > 0) {
      const validProducts = data.filter(
        (product) =>
          product.productDetails &&
          product.productDetails.quantity > 0 &&
          product.productDetails.quantity >= product.quantity
      );

      const total = validProducts.reduce((previousValue, currentValue) => {
        return (
          previousValue +
          currentValue.quantity * currentValue.productId.sellingPrice
        );
      }, 0);
    }
  }, [data, loading]);

  // ✅ Increase quantity
  const increaseQty = (id) => {
    const updated = data.map((item) =>
      item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setData(updated);
    localStorage.setItem("guestCart", JSON.stringify(updated));
    fetchCartData(); // ⬅️ This will re-sync the cart context
  };

  // ✅ Decrease quantity
  const decreaseQty = (id) => {
    const updated = data.map((item) =>
      item.productId === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setData(updated);
    localStorage.setItem("guestCart", JSON.stringify(updated));
    fetchCartData(); // ⬅️ Ensure cartProductCount updates
  };

  const deleteCartProduct = (id) => {
    const updated = data.filter((item) => item.productId !== id);
    setData(updated);
    localStorage.setItem("guestCart", JSON.stringify(updated));
    fetchCartData(); // ⬅️ Update cart count
  };

  useEffect(() => {
    if (!loading && data.length > 0) {
      const total = data.reduce(
        (acc, item) => acc + item.quantity * item.productId.sellingPrice,
        0
      );
      setFinalAmount(total);
    }
  }, [data, loading]);
  useEffect(() => {
    fetchData(); // Initialize cart for guest users
  }, []);

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
              First, please log in to proceed !
            </p>
          )}
        </div>
      </div>

      {/*** Right Column - My Cart Summary ***/}
      <div className="w-full lg:w-[30%] bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="p-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">My Cart</h3>
            <span className="text-gray-600">{totalQty} items</span>
          </div>

          <div className="mb-4">
            {loading ? (
              <Loader></Loader>
            ) : (
              data.map((product) => {
                // Ensure productId exists before accessing its properties
                if (!product.productDetails) {
                  return null; // Skip rendering this product if productId is null
                }

                // Check if product is out of stock (based on available stock)
                const isOutOfStock = product.productDetails.quantity === 0;
                const isPartialStock =
                  product.productDetails.quantity > 0 &&
                  product.productDetails.quantity < product.quantity;
                return (
                  <div
                    key={product.productId}
                    className={`flex justify-between mb-4 p-3 border-b border-gray-200 ${
                      isOutOfStock || isPartialStock ? "opacity-50" : ""
                    }`}
                  >
                    {/* Product Image and Quantity */}
                    <div className="flex flex-col items-center w-24">
                      <div className="w-16 h-16 bg-white flex items-center justify-center border-gray-300 rounded-lg overflow-hidden">
                        <div className="relative">
                          <div
                            className={`max-w-full max-h-full object-contain ${
                              isOutOfStock ? "grayscale" : ""
                            }`}
                          >
                            <img
                              src={
                                product.productDetails?.productImage?.[0] ||
                                "/fallback.jpg"
                              }
                              alt={
                                product.productDetails?.productName ||
                                "Product Image"
                              }
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>

                          {/* Show out-of-stock or partial stock warning */}
                          {isOutOfStock && (
                            <div className="absolute top-0 left-0 w-full bg-red-600 text-white text-center font-bold py-1">
                              Out of Stock
                            </div>
                          )}

                          {isPartialStock && !isOutOfStock && (
                            <div className="absolute top-0 left-0 w-full bg-yellow-600 text-white text-center font-bold py-1">
                              Only {product.productDetails.quantity} left
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-5 h-5 flex justify-center items-center rounded-full"
                          onClick={() => decreaseQty(product.productId)}
                          disabled={
                            isOutOfStock ||
                            (isPartialStock &&
                              product.productDetails.quantity <=
                                product.quantity)
                          }
                        >
                          -
                        </button>
                        <span className="text-gray-700">
                          {product.quantity}
                        </span>
                        <button
                          className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white w-5 h-5 flex justify-center items-center rounded-full"
                          onClick={() => increaseQty(product.productId)}
                          disabled={
                            isOutOfStock ||
                            (isPartialStock &&
                              product.productDetails.quantity <=
                                product.quantity)
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Product Details and Delete Button */}
                    <div className="flex flex-col flex-1 ml-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-800">
                          {product.productDetails.productName}
                        </p>
                        <p className="text-sm font-semibold text-gray-500 line-through">
                          {displayINRCurrency(
                            product.quantity * product.productDetails.price
                          )}
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {displayINRCurrency(
                            product.quantity *
                              product.productDetails.sellingPrice
                          )}
                        </p>
                      </div>
                      {/* Delete Button */}
                      <div className="flex justify-end mt-2">
                        <div
                          className="text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full cursor-pointer"
                          onClick={() => deleteCartProduct(product.productId)}
                        >
                          <MdDelete />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Summary */}
          <div className="border-t pt-4">
            <div className="flex items-center mb-4 p-2 bg-yellow-100 text-yellow-700 border border-yellow-500 rounded">
              <svg
                className="w-6 h-6 text-yellow-500 mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"
                ></path>
              </svg>
              <span className="text-sm font-medium">
                This delivery is available in Pune Location Only
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Delivery Charges:</span>
                <span>₹{totalPrice < 500 ? 40 : 0}</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Discount:</span>
                {displayINRCurrency(0)}
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total:</span>
                <span className="text-md">
                  {displayINRCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCart;
