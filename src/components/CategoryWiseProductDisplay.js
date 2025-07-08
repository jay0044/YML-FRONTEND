import React, { useContext, useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context/index";
import SummaryApi from "../common";
import image from "../assest/products/approve.png";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const [data, setData] = useState([]); // Full product data
  const [visibleProducts, setVisibleProducts] = useState([]); // Products to show
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Number of items to display per page

  const { authToken } = useContext(Context); // Get the authToken from Context
  const { fetchCartData } = useCart();

  const handleAddToCart = async (e, id) => {
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

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data);
    setVisibleProducts(categoryProduct?.data.slice(0, itemsPerPage)); // Display first 12 items
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const newVisibleProducts = data.slice(0, startIndex + itemsPerPage);

    setVisibleProducts(newVisibleProducts);
    setCurrentPage(nextPage);
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (originalPrice, sellingPrice) => {
    if (!originalPrice || !sellingPrice) return 0;
    const discount = ((originalPrice - sellingPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-2">
        <img src={image} alt="Groceries Icon" className="w-14 h-14" />
        <h2 className="font-bold text-sky-800 text-lg sm:text-2xl">
          {heading}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-center md:justify-between overflow-x-auto scrollbar-none transition-all">
        {loading
          ? [...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg">
                <div className="bg-slate-200 h-40 p-4 flex justify-center items-center animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))
          : visibleProducts.map((product, index) => (
              <Link
                key={index}
                to={`/product/${product?._id}`}
                className="shadow-xl hover:shadow-2xl transition-shadow duration-300 items-center border border-sky-700 hover:border-green-700 rounded-lg overflow-hidden"
                style={{ minWidth: "160px", maxWidth: "200px" }} // Adjust card width for smaller screens
              >
                <div className="relative bg-white h-36 p-4 flex justify-center items-center">
                  <img
                    src={product.productImage[0]}
                    className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                    alt={product?.productName}
                  />
                  {product?.price > product?.sellingPrice && (
                    <span className="absolute top-2 -left-6 transform -rotate-45  bg-red-600 text-white text-[12px] font-bold px-6 py-1 shadow-xl z-10">
                      -
                      {calculateDiscountPercentage(
                        product.price,
                        product.sellingPrice
                      )}
                      % OFF
                    </span>
                  )}
                </div>
                <div className="p-3 space-y-2 bg-white rounded-b-lg">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {product?.productName}
                  </h3>
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-base font-bold text-green-900">
                      {displayINRCurrency(product?.sellingPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {displayINRCurrency(product?.price)}
                    </span>
                  </div>
                  <div className="flex justify-center pt-2">
                    {product?.quantity > 0 ? (
                      <button
                        className="w-full bg-sky-700 hover:bg-green-700 text-white text-xs font-semibold py-1.5 rounded-md transition duration-200"
                        onClick={(e) => handleAddToCart(e, product?._id)}
                      >
                        Add
                      </button>
                    ) : (
                      <span className="text-xs text-red-500 bg-red-100 px-3 py-1 rounded-full border border-red-400 font-semibold block text-center">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* Load more button */}
      {visibleProducts.length < data.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleNextPage}
            className="px-4 py-1 border border-sky-700 text-sky-700 rounded-full hover:bg-sky-500 hover:text-white"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
};

export default CategroyWiseProductDisplay;
