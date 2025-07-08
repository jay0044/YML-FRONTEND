import React, { useEffect, useState } from "react";
import UploadProduct from "../components/UploadProduct";
import SummaryApi from "../common";
import AdminProductCard from "../components/AdminProductCard";
import Loader from "../components/Loader";
import productCategory from "../helpers/productCategory";
import { useSeller } from "../context/SellerContext";
import { MdInventory } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
// Assuming you export productCategory from a separate file

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [selectedCategory, setSelectedCategory] = useState(""); // State for the selected category
  const [currentPage, setCurrentPage] = useState(1); // State for the current page
  const itemsPerPage = 20; // Number of items to show per page
  const { seller } = useSeller(); // Get seller data from context

  // Fetch all products
  const fetchAllProduct = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(SummaryApi.allProduct.url);
      const dataResponse = await response.json();
      console.log("product data", dataResponse);
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  // Filter products based on the selected category
  const filteredProducts = selectedCategory
    ? allProduct.filter((product) => product.category === selectedCategory)
    : allProduct; // If no category is selected, show all products

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get the products for the current page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-sky-700 to-sky-500 rounded-md py-3 px-4 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <MdInventory className="text-2xl" />
          All Products
        </h2>

        <button
          className="bg-white text-sky-700 hover:bg-sky-100 border border-white font-semibold px-4 py-2 rounded-full transition flex items-center gap-2"
          onClick={() => setOpenUploadProduct(true)}
        >
          <FaCloudUploadAlt className="text-lg" />
          Upload Product
        </button>
      </div>

      {/* Category Selector for Small Devices */}
      <div className="md:hidden px-4 py-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded-md bg-white text-black mt-2"
        >
          <option value="">All Categories</option>
          {productCategory.map((category) => (
            <option key={category.id} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Buttons for Medium and Larger Devices */}
      <div className="hidden md:flex justify-center py-4 flex-wrap gap-2">
        <button
          className={`border-2 px-3 py-2 rounded-md text-sm ${
            selectedCategory === ""
              ? "text-white bg-green-700"
              : "text-white bg-green-500"
          }`}
          onClick={() => setSelectedCategory("")}
        >
          All Categories
        </button>

        {productCategory.map((category) => (
          <button
            key={category.id}
            className={`border-2 px-3 py-2 rounded-md text-sm ${
              selectedCategory === category.value
                ? "bg-orange-700 text-white"
                : "bg-sky-700 text-white"
            }`}
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center py-4 space-x-2">
        <button
          className="px-3 py-1 bg-green-700 rounded hover:bg-gray-400 text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-orange-700 text-white"
                : "bg-sky-700 text-white"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-green-700 rounded hover:bg-gray-400 text-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Display Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 py-4">
        {loading ? (
          <div className="flex justify-center items-center w-full h-full">
            <Loader />
          </div>
        ) : currentProducts.length > 0 ? (
          currentProducts.map((product, index) => (
            <AdminProductCard
              data={product}
              key={index + "allProduct"}
              fetchdata={fetchAllProduct}
            />
          ))
        ) : (
          <div className="w-full text-center text-gray-500">
            No products found in this category.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center py-4 space-x-2">
        <button
          className="px-3 py-1 bg-green-700 rounded hover:bg-gray-400 text-white"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-orange-700 text-white"
                : "bg-sky-700 text-white"
            }`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 bg-green-700 rounded hover:bg-gray-400 text-white"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Upload Product Modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
