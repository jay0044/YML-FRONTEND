import React, { useContext, useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { Link, useNavigate } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import SummaryApi from "../common";
import { FaAngleRight, FaChevronRight } from "react-icons/fa";
import { useCart } from "../context/CartContext.js";
import Context from "../context/index.js";
import toast from "react-hot-toast";

const Column = ({ category, heading, image }) => {
  const { authToken } = useContext(Context);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(12).fill(null); // Show up to 12 loading placeholders
  const { fetchCartData } = useCart();
  const navigate = useNavigate();

  // Handle Add to Cart

  const handleAddToCart = async (e, id) => {
    // Retrieve authToken (e.g., from localStorage or cookies)
    const authToken = localStorage.getItem("authToken") || null;

    // Check if the token is valid
    const isLoggedIn = authToken && isValidToken(authToken);

    if (isLoggedIn) {
      e.stopPropagation();
      await addToCart(e, id, authToken); // This adds the product to the cart (logged-in user)
      fetchCartData && fetchCartData();
    } else {
      // Guest user flow: Fetch product details
      const localCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const productDetails = await fetchProductDetails(id); // Fetch product details from the server or a local file

      const isProductInCart = localCart.some((item) => item.productId === id);

      if (isProductInCart) {
        toast.error("Product already exists in cart");
      } else {
        localCart.push({
          productId: id,
          quantity: 1,
          productDetails: productDetails, // Store full product details in localStorage
        });
        localStorage.setItem("guestCart", JSON.stringify(localCart));
        toast.success("Product added to cart");
        fetchCartData(); // ✅ Force update context for guest cart count
      }
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(
        `${SummaryApi.productDetail.url}/${productId}`,
        {
          method: SummaryApi.productDetail.method,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.product; // Return the full product data
      } else {
        console.error("Failed to fetch product details");
        return {};
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      return {};
    }
  };

  // Utility function to check token validity
  const isValidToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.exp * 1000 > Date.now(); // Check expiration
    } catch {
      return false; // Invalid token
    }
  };

  // Fetch data and limit it to 12 products
  const fetchData = async () => {
    setLoading(true);
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(
        Array.isArray(categoryProduct?.data)
          ? categoryProduct.data.slice(0, 12)
          : []
      );
    } catch (error) {
      console.error("Failed to fetch category-wise products:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  // Calculate percentage off
  const calculateDiscountPercentage = (price, sellingPrice) => {
    if (price > 0) {
      return Math.round(((price - sellingPrice) / price) * 100);
    }
    return 0;
  };

  // Navigate to the full grocery view
  const handleViewAll = () =>
    navigate(`/product-category?category=${category}`);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 my-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <img src={image} alt="Groceries Icon" className="w-12 h-12" />
          <h2 className="font-bold text-sky-800 text-lg sm:text-2xl">
            {heading}
          </h2>
        </div>

        <button
          className="bg-sky-700 text-white text-xs font-bold border-2 border-black-200 px-3 py-1 rounded-md transition-colors duration-300 hover:bg-green-700 hover:text-white"
          onClick={handleViewAll}
        >
          SEE ALL
        </button>
      </div>

      {/* Two-row layout with responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-xl"
                style={{ minWidth: "150px" }}
              >
                <div className="bg-slate-200 h-36 flex justify-center items-center animate-pulse"></div>
                <div className="p-2 space-y-2">
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))
          : data.map((product, index) => (
              <Link
                key={index}
                to={`/product/${product?._id}`}
                className="relative bg-white shadow-sm hover:shadow-xl border border-sky-700 hover:border-green-700 rounded-lg transition-all duration-200 overflow-hidden"
                style={{ minWidth: "150px" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Discount Badge - Diagonal */}
                {product?.price > product?.sellingPrice && (
                  <span className="absolute top-3 -left-6 rotate-[-45deg] bg-red-600 text-white text-[14px] font-bold px-6 py-[2px] shadow-xl z-10">
                    {calculateDiscountPercentage(
                      product?.price,
                      product?.sellingPrice
                    )}
                    % OFF
                  </span>
                )}

                {/* Product Image */}
                <div className="h-28 flex items-center justify-center p-2">
                  <img
                    src={product.productImage[0]}
                    alt={product?.productName}
                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Product Info */}
                <div className="px-3 pb-3 flex flex-col gap-1">
                  {/* Name */}
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem]">
                    {product?.productName}
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-800">
                      {displayINRCurrency(product?.sellingPrice)}
                    </span>
                    {product?.price > product?.sellingPrice && (
                      <span className="text-md text-gray-500 line-through font-medium">
                        {displayINRCurrency(product?.price)}
                      </span>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product?._id)}
                    className="mt-1 w-full bg-sky-700 hover:bg-green-700 text-white text-[11px] font-semibold py-[5px] rounded-md transition-colors duration-200"
                  >
                    ADD
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Column;
