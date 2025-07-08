import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdOutlineShoppingCart } from "react-icons/md";

const SaleHighlight = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="container relative w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-4 py-6 shadow-lg animate-fade-in-down rounded-lg mt-8">
      {/* Close Button */}
      <button
        className="absolute top-2 right-4 text-white text-xl"
        onClick={() => setIsVisible(false)}
        title="Close"
      >
        <IoMdCloseCircle className="text-2xl" />
      </button>

      {/* Wrapper for content */}
      <div className="max-w-7xl mx-auto flex flex-col gap-3 mt-2">
        {/* 🛍️ Welcome Heading */}
        <h1 className="text-xl sm:text-3xl font-bold tracking-wide drop-shadow-sm text-center sm:text-left sm:pl-10 flex items-center justify-center sm:justify-start gap-2">
          Welcome to{" "}
          <span className="flex items-center gap-1">
            YML Mart®
            <MdOutlineShoppingCart className="text-3xl sm:text-5xl" />
          </span>
        </h1>

        {/* Offer Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <FaBolt size={32} className="animate-ping-slow " />
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">
                Limited Time Offer – Save Up to 25% on Selected Items!
              </h2>
              <p className="text-sm sm:text-base">
                Grab your essentials before the offer ends. Limited time only!
              </p>
            </div>
          </div>

          <Link
            to="/product-category?category=groceries&category=kitchenware&category=toys,%20games&category=beauty&category=stationary&category=electronics&category=home%20decor&category=personal%20care&category=gifts,%20hampers&category=fashion"
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SaleHighlight;
