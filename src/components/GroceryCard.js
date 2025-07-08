import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context/index";
import SummaryApi from "../common";
import toast from "react-hot-toast";
import Groceries from "../assest/CategoryImgs/Groceries.png";
import { useCart } from "../context/CartContext";

const GroceryCart = ({ category, heading }) => {
  const { authToken } = useContext(Context);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(15).fill(null); // Show up to 15 products initially
  const scrollElement = useRef();
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

  // Utility function to fetch product details by productId
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

  // Fetch limited data (15 products)
  const fetchData = async () => {
    setLoading(true);
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(
        Array.isArray(categoryProduct?.data)
          ? categoryProduct.data.slice(0, 15)
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

  // Scroll functionality
  const scrollRight = () => (scrollElement.current.scrollLeft += 300);
  const scrollLeft = () => (scrollElement.current.scrollLeft -= 300);

  // Navigate to the full grocery view
  const handleViewAll = () =>
    navigate(`/product-category?category=${category}`);

  // Calculate percentage off
  const calculateDiscountPercentage = (price, sellingPrice) => {
    if (price > 0) {
      return Math.round(((price - sellingPrice) / price) * 100);
    }
    return 0;
  };

  return (
    <div className="container px-5 my-6 relative w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <img src={Groceries} alt="Groceries Icon" className="w-12 h-12" />
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

      {/* Scroll buttons */}

      {/* Products Slider */}
      <div
        ref={scrollElement}
        className="flex gap-5 overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        <button
          className="bg-sky-700 hover:bg-green-700 text-white shadow-md rounded-full p-1 left-2 absolute top-1/2 transform -translate-y-1/2 text-lg md:flex justify-center items-center z-10"
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className="bg-sky-700 hover:bg-green-700 text-white rounded-full p-1 absolute right-2 top-1/2 transform -translate-y-1/2 text-lg md:flex justify-center items-center z-10"
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>
        {loading
          ? loadingList.map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg">
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
                className="relative bg-white shadow-md hover:shadow-xl border border-sky-700 hover:border-green-700 rounded-lg transition-all duration-300 overflow-hidden"
                style={{ minWidth: "170px", maxWidth: "170px" }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Discount Badge */}
                {product?.price > product?.sellingPrice && (
                  <span className="absolute top-2 -left-6 transform -rotate-45  bg-red-600 text-white text-[12px] font-bold px-6 py-1 shadow-xl z-10">
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
                <div className="px-3 py-2 flex flex-col gap-1">
                  {/* Name */}
                  <h3 className="text-md font-semibold text-sky-800 truncate">
                    {product?.productName}
                  </h3>

                  {/* Price section */}
                  <div className="flex items-center justify-between">
                    <span className="text-md font-bold text-green-900">
                      {displayINRCurrency(product?.sellingPrice)}
                    </span>
                    {product?.price > product?.sellingPrice && (
                      <span className="text-[14px] text-gray-500 line-through font-medium">
                        {displayINRCurrency(product?.price)}
                      </span>
                    )}
                  </div>

                  {/* ADD Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product?._id)}
                    className="mt-1 w-full bg-sky-700 hover:bg-green-700 text-white text-[11px] font-semibold py-[5px] rounded-md transition-all duration-200"
                  >
                    ADD
                  </button>
                </div>
              </Link>

              // <Link
              //   key={index}
              //   to={`/product/${product?._id}`}
              //   className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 w-[160px] sm:w-[180px] overflow-hidden"
              // >
              //   {/* Image Section */}
              //   <div className="h-28 flex items-center justify-center p-2">
              //     <img
              //       src={product.productImage[0]}
              //       alt={product?.productName}
              //       className="h-full object-contain transition-transform duration-300 hover:scale-105"
              //     />
              //   </div>

              //   {/* Content Section */}
              //   <div className="px-3 pb-3">
              //     {/* Product Name */}
              //     <h3 className="text-sm font-medium text-gray-800 truncate">
              //       {product?.productName}
              //     </h3>

              //     {/* Pricing */}
              //     <div className="flex justify-between items-center mt-1">
              //       <p className="text-green-700 font-bold text-sm">
              //         ₹{product?.sellingPrice}
              //       </p>
              //       <p className="text-gray-400 text-xs line-through">
              //         ₹{product?.price}
              //       </p>
              //     </div>

              //     {/* Discount and Button */}
              //     <div className="flex justify-between items-center mt-2">
              //       <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-1 rounded-full">
              //         {calculateDiscountPercentage(
              //           product?.price,
              //           product?.sellingPrice
              //         )}
              //         % OFF
              //       </span>

              //       <button
              //         onClick={(e) => handleAddToCart(e, product?._id)}
              //         className="text-xs font-semibold bg-sky-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
              //       >
              //         ADD
              //       </button>
              //     </div>
              //   </div>
              // </Link>
            ))}
      </div>
    </div>
  );
};

export default GroceryCart;
