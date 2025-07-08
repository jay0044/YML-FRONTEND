import React, { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";
import displayINRCurrency from "../helpers/displayCurrency";

const AdminProductCard = ({ data, fetchdata, onEditClick  }) => {
  const [editProduct, setEditProduct] = useState(false);

  return (
   <div className="bg-white p-4 rounded-md shadow-md w-full max-w-sm mx-auto">
      {/* Product Image */}
      <div className="w-full flex justify-center mb-4">
        <div className="w-28 h-28">
          <img
            src={data?.productImage?.[0]}
            alt={data?.productName || "Product Image"}
            className="object-cover h-full w-full rounded-md"
          />
        </div>
      </div>

      {/* Product Name */}
      <h1 className="font-bold text-md text-gray-800 line-clamp-2 mb-2 text-center">
        {data.productName}
      </h1>

      {/* Price & Edit */}
      <div className="flex items-center justify-between mt-2">
        <p className="font-semibold text-sky-800 text-base">
          {displayINRCurrency(data.sellingPrice)}
        </p>
        <button
          onClick={() => setEditProduct(true)}
          className="p-2 bg-green-700 hover:bg-orange-700 rounded-full text-white"
          title="Edit Product"
        >
          <MdModeEditOutline />
        </button>
      </div>

      {/* Modal */}
      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
