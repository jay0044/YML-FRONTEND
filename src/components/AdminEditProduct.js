import React, { useState, useContext } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt, FaEdit } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import toast from "react-hot-toast";
import Context from "../context/index";
import AWS from "aws-sdk";

const AdminEditProduct = ({ onClose, productData, fetchdata }) => {
  const [data, setData] = useState({
    ...productData,
    productName: productData?.productName,
    brandName: productData?.brandName,
    category: productData?.category,
    productImage: productData?.productImage || [],
    description: productData?.description,
    price: productData?.price,
    sellingPrice: productData?.sellingPrice,
    description: productData?.description,
    soldBy: productData?.soldBy,
    features: productData?.features,
    _id: productData?._id,
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const { authToken } = useContext(Context); // Get the authToken from Context

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];

    try {
      // Upload to S3 instead of Cloudinary
      const uploadImageS3 = await uploadImageToS3(file);

      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadImageS3], // Store S3 URL instead of Cloudinary
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  const s3 = new AWS.S3();

  const uploadImageToS3 = async (file) => {
    const params = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: `products/${Date.now()}_${file.name}`, // you can change the path as per your structure
      Body: file,
      // ACL: 'public-read', // makes the file publicly readable
      ContentType: file.type,
    };

    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data.Location); // URL of the uploaded file
      });
    });
  };

  const handleDeleteProductImage = async (index) => {
    console.log("image index", index);

    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);

    setData((prev) => ({
      ...prev,
      productImage: [...newProductImage],
    }));
  };

  {
    /** Update Product */
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.updateProduct.url, {
      method: SummaryApi.updateProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchdata();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  {
    /** Delete Product */
  }
  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent form submission

    try {
      const response = await fetch(SummaryApi.deleteProduct.url, {
        method: SummaryApi.deleteProduct.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ _id: data._id }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.error(responseData.message); // Show the toast in red color
        fetchdata();
        onClose(); // Close the modal
      } else {
        toast.error(
          responseData.message ||
            "An error occurred while deleting the product."
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete the product.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl w-[95%] max-w-3xl h-[90%] md:h-[85%] shadow-lg border border-sky-700 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white px-5 py-3 rounded-tl-xl rounded-tr-xl">
          <h2 className="text-lg font-semibold flex items-center gap-x-2">
            <FaEdit className="text-2xl" />
            Edit Product
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-300 transition"
          >
            <CgClose />
          </button>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-slate-100"
        >
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block font-medium mb-1">
              Product Name:
            </label>
            <input
              id="productName"
              name="productName"
              value={data.productName}
              onChange={handleOnChange}
              type="text"
              required
              placeholder="Enter product name"
              className="w-full p-2 bg-slate-100 border rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand Name */}
            <div>
              <label htmlFor="brandName" className="block font-medium mb-1">
                Brand Name:
              </label>
              <input
                id="brandName"
                name="brandName"
                value={data.brandName}
                onChange={handleOnChange}
                type="text"
                required
                placeholder="Enter brand name"
                className="w-full p-2 bg-slate-100 border rounded"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block font-medium mb-1">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={data.category}
                onChange={handleOnChange}
                required
                className="w-full p-2 bg-slate-100 border rounded"
              >
                <option value="">Select Category</option>
                {productCategory.map((el, index) => (
                  <option key={el.value + index} value={el.value}>
                    {el.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Image Upload */}
          <div>
            <label
              htmlFor="uploadImageInput"
              className="block font-medium mb-1"
            >
              Product Image:
            </label>
            <label
              htmlFor="uploadImageInput"
              className="cursor-pointer block border border-dashed border-slate-400 bg-slate-100 rounded p-4 text-center"
            >
              <div className="text-slate-500 flex flex-col items-center gap-1">
                <FaCloudUploadAlt className="text-4xl" />
                <p className="text-sm">Click to upload image</p>
                <input
                  type="file"
                  id="uploadImageInput"
                  className="hidden"
                  onChange={handleUploadProduct}
                />
              </div>
            </label>

            {/* Preview Images */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {data?.productImage?.length > 0 ? (
                data.productImage.map((el, index) => (
                  <div className="relative group" key={index}>
                    <img
                      src={el}
                      alt={`product-${index}`}
                      className="w-20 h-20 object-cover rounded border cursor-pointer"
                      onClick={() => {
                        setOpenFullScreenImage(true);
                        setFullScreenImage(el);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteProductImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full text-xs hidden group-hover:block"
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-red-600 mt-1">
                  *Please upload product image
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label htmlFor="price" className="block font-medium mb-1">
                Price:
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={data.price}
                onChange={handleOnChange}
                placeholder="Enter price"
                required
                className="w-full p-2 bg-slate-100 border rounded"
              />
            </div>

            {/* Selling Price */}
            <div>
              <label htmlFor="sellingPrice" className="block font-medium mb-1">
                Selling Price:
              </label>
              <input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                value={data.sellingPrice}
                onChange={handleOnChange}
                placeholder="Enter selling price"
                required
                className="w-full p-2 bg-slate-100 border rounded"
              />
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block font-medium mb-1">
                Quantity:
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={data.quantity}
                onChange={handleOnChange}
                placeholder="Enter quantity"
                required
                className="w-full p-2 bg-slate-100 border rounded"
              />
            </div>

            {/* Description, SoldBy, Features, Product Info */}
            {["description", "soldBy", "features", "productInfo"].map(
              (field) => (
                <div key={field}>
                  <label htmlFor={field} className="block font-medium mb-1">
                    {field.replace(/([A-Z])/g, " $1")}:
                  </label>
                  <textarea
                    id={field}
                    name={field}
                    value={data[field]}
                    onChange={handleOnChange}
                    placeholder={`Enter ${field}`}
                    className="w-full p-2 bg-slate-100 border rounded min-h-[60px] resize-y"
                  />
                </div>
              )
            )}
          </div>
          {/* Action Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded font-semibold flex items-center justify-center gap-2"
            >
              <MdDelete className="text-2xl" />
              Delete Product
            </button>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded font-semibold flex items-center justify-center gap-2"
            >
              <FaEdit className="text-2xl" />
              Update Product
            </button>
          </div>
        </form>

        {/* Full Screen Image Viewer */}
        {openFullScreenImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative">
              <img
                src={fullScreenImage}
                alt="Full Image"
                className="max-w-full max-h-screen object-contain"
              />
              <button
                className="absolute top-2 right-2 text-white text-2xl"
                onClick={() => setOpenFullScreenImage(false)}
              >
                <CgClose />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEditProduct;
