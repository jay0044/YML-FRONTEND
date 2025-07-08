import React from "react";
import { FaCloudUploadAlt, FaEdit, FaTrash } from "react-icons/fa";
import { MdDelete, MdInventory, MdModeEdit } from "react-icons/md";

const AllCategories = () => {
  // Static hardcoded category data
  const categories = [
    {
      _id: "1",
      label: "Electronics",
      value: "electronics",
      image: "https://via.placeholder.com/50",
      parentLabel: "-",
    },
    {
      _id: "2",
      label: "Accessories",
      value: "accessories",
      image: "https://via.placeholder.com/50",
      parentLabel: "Electronics",
    },
    {
      _id: "3",
      label: "Groceries",
      value: "groceries",
      image: "",
      parentLabel: "-",
    },
  ];

  return (
    <div className="p-4">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-sky-700 to-sky-500 rounded-md py-3 px-4 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="font-bold text-xl flex items-center gap-2">
          <MdInventory className="text-2xl" />
          All Categories
        </h2>

        <button
          className="bg-white text-sky-700 hover:bg-sky-100 border border-white font-semibold px-4 py-2 rounded-full transition flex items-center gap-2"
          onClick={() => alert("Open upload category modal")}
        >
          <FaCloudUploadAlt className="text-lg" />
          Upload Category
        </button>
      </div>
      {/* Static Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border mt-10">
        <table className="min-w-full text-sm md:text-base border-collapse">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4 text-center">Image</th>
              <th className="p-4 text-center">Category</th>
              <th className="p-4 text-center">SubCategories</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat._id}
                className="border-b hover:bg-gray-50 text-center"
              >
                <td className="px-4 py-2">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-4 py-2">{cat.label}</td>
                <td className="px-4 py-2 text-gray-600">{cat.value}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    title="Edit Role"
                    className="p-2 bg-green-100 hover:bg-green-500 hover:text-white text-green-600 rounded-full transition"

                  >
                    <MdModeEdit size={18} />
                  </button>
                  <button
                    title="Delete User"
                    className="p-2 bg-red-100 hover:bg-red-500 hover:text-white text-red-600 rounded-full transition"
                  >
                    <MdDelete size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCategories;
