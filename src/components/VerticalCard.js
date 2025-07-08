import React, { useContext, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import displayINRCurrency from "../helpers/displayCurrency";
import addToCart from "../helpers/addToCart";
import Context from "../context/index";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const VerticalCard = ({ loading, data = [] }) => {
  const loadingList = new Array(13).fill(null);
  const { authToken } = useContext(Context); // Get the authToken from Context
  const { fetchCartData } = useCart();
  const params = useParams();

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
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [params]);

  // Utility function to check token validity
  const isValidToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      return payload.exp * 1000 > Date.now(); // Check expiration
    } catch {
      return false; // Invalid token
    }
  };

  // Function to calculate percentage discount
  const calculateDiscount = (price, sellingPrice) => {
    if (price && sellingPrice) {
      const discount = ((price - sellingPrice) / price) * 100;
      return Math.round(discount); // Round the value to the nearest integer
    }
    return 0;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 justify-center md:justify-between overflow-x-auto transition-all ">
      {loading
        ? loadingList.map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg">
              <div className="bg-slate-200 h-40 p-4 flex justify-center items-center animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))
        : data.map((product, index) => {
            const discount = calculateDiscount(
              product?.price,
              product?.sellingPrice
            );

            return (
              <Link
                key={index}
                to={`/product/${product?._id}`}
                className="shadow-xl hover:shadow-2xl transition-shadow duration-300 items-center border border-sky-700 hover:border-green-700 rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ minWidth: "160px", maxWidth: "200px" }}
              >
                <div className="relative bg-white h-36 p-4 flex justify-center rounded-t-lg">
                  <img
                    src={product.productImage[0]}
                    className="object-contain h-full w-full transition-transform duration-300 hover:scale-105"
                    alt={product?.productName}
                  />
                  {/* {discount > 0 && (
                    <span className="absolute top-0 left-0 text-white font-bold bg-green-700 text-xs px-2 py-1 rounded-md">
                      {discount}% OFF
                    </span>
                  )} */}
                  {discount > 0 && (
                    <div className="absolute top-2 -left-6 transform -rotate-45  bg-red-600 text-white text-[12px] font-bold px-6 py-1 shadow-xl z-10">
                      {discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2 bg-white rounded-b-lg">
                  {/* Product Name */}
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                    {product?.productName}
                  </h3>

                  {/* Price Section */}
                  <div className="flex items-center gap-2 justify-between">
                    <span className="text-base font-bold text-green-900">
                      {displayINRCurrency(product?.sellingPrice)}
                    </span>
                    {discount > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        {displayINRCurrency(product?.price)}
                      </span>
                    )}
                  </div>
                  {/* Pricing */}
                  {/* <div className="flex justify-between items-center mt-1">
                    <p className="text-green-700 font-bold text-md">
                      ₹{product?.sellingPrice}
                    </p>
                    <p className="text-gray-400 text-md line-through font-bold">
                      ₹{product?.price}
                    </p>
                  </div> */}
                  {/* Add to Cart / Stock Info */}
                  <div className="pt-2">
                    {product?.quantity > 0 ? (
                      <button
                        onClick={(e) => handleAddToCart(e, product?._id)}
                        className="w-full bg-sky-700 hover:bg-green-700 text-white text-xs font-semibold py-1.5 rounded-md transition duration-200"
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
            );
          })}
    </div>
  );
};

export default VerticalCard;
