import React, { useState, useContext } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory"; // Include subcategories in this import
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import { MdAddShoppingCart, MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import toast from "react-hot-toast";
import AWS from "aws-sdk";
import Context from "../context/index";
import { useSeller } from "../context/SellerContext";

const UploadProduct = ({ onClose, fetchData }) => {
  const { seller } = useSeller(); // Get seller data from context
  const { authToken } = useContext(Context); // Get the authToken from Context

  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    subcategory: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
    quantity: "",
    soldBy: "",
    features: "",
    productInfo: "",
    percentOff: "",
    sellerId: seller ? seller._id : null, // Default to null if no seller
  });

  const [subcategories, setSubcategories] = useState([]);
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");
  const [subSubcategories, setSubSubcategories] = useState([]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value,
      };

      // If either price or sellingPrice changes, calculate the percentOff
      if (updatedData.price && updatedData.sellingPrice) {
        const priceValue = parseFloat(updatedData.price);
        const sellingPriceValue = parseFloat(updatedData.sellingPrice);

        if (priceValue > 0 && sellingPriceValue > 0) {
          const discount =
            ((priceValue - sellingPriceValue) / priceValue) * 100;
          updatedData.percentOff = discount.toFixed(2); // Calculate and set percent off
        }
      }

      return updatedData;
    });
  };

  // Handle category change and update subcategories
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const selected = productCategory.find(
      (cat) => cat.value === selectedCategory
    );
    setData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: "", // Reset subcategory
      subSubcategory: "", // Reset sub-subcategory
    }));
    setSubcategories(selected ? selected.subcategories : []);
    setSubSubcategories([]); // Clear sub-subcategories
  };

  const handleSubcategoryChange = (e) => {
    const selectedSubcategory = e.target.value;
    const selected = subcategories.find(
      (subcat) => subcat.value === selectedSubcategory
    );
    setData((prev) => ({
      ...prev,
      subcategory: selectedSubcategory,
      subSubcategory: "", // Reset sub-subcategory
    }));
    // Safely set sub-subcategories if they exist
    setSubSubcategories(selected?.subcategories || []);
  };

  // Configure AWS
  console.log(
    "Access Key:",
    process.env.REACT_APP_ACCESS_KEY,
    "Secret:",
    process.env.REACT_APP_SECRET_ACCESS_KEY,
    "Region:",
    process.env.REACT_APP_BUCKET_REGION,
    "Bucket:",
    process.env.REACT_APP_BUCKET_NAME
  );

  // AWS.config.update({
  //     accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  //     secretAccessKey:process.env.REACT_APP_SECRET_ACCESS_KEY,
  //     region: process.env.REACT_APP_BUCKET_REGION
  // });

  AWS.config.update({
    credentials: new AWS.Credentials(
      process.env.REACT_APP_ACCESS_KEY,
      process.env.REACT_APP_SECRET_ACCESS_KEY
    ),
    region: process.env.REACT_APP_BUCKET_REGION,
  });

  const s3 = new AWS.S3();

  const handleUploadProduct = async (e) => {
    const files = e.target.files; // Get all selected files
    const uploadedImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);
      try {
        const url = await uploadImageToS3(file);
        uploadedImages.push(url); // Store the uploaded image URL
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    // Update the state with the uploaded images
    setData((prev) => ({
      ...prev,
      productImage: [...prev.productImage, ...uploadedImages], // Add new images to existing ones
    }));
  };

  const uploadImageToS3 = async (file) => {
    const params = {
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      Key: `products/${Date.now()}_${file.name}`, // you can change the path as per your structure
      Body: file,
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

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: [...newProductImage],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
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
      fetchData();
    } else {
      toast.error(responseData?.message);
    }
  };

  // Function to split text into bullet points (each line is treated as a new bullet point)
  const handleBulletPoints = (text) => {
    return text.split("\n").map((item, index) => <li key={index}>{item}</li>);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 bg-opacity-60 flex items-center justify-center z-50  ">
      <div className="bg-white p-4 rounded-xl w-[95%] max-w-3xl h-[90%] md:h-[85%] shadow-lg border border-sky-700 flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center bg-gradient-to-br from-sky-700 to-sky-500 text-white px-5 py-3 rounded-tl-xl rounded-tr-xl">
          <h2 className="text-lg font-semibold flex items-center gap-x-2">
            <MdAddShoppingCart className="text-2xl" />
            Add New Product
          </h2>

          <button
            onClick={onClose}
            className="text-2xl hover:text-red-300 transition"
          >
            <CgClose />
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-sky-400 scrollbar-track-slate-100"
        >
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              placeholder="Enter product name"
              value={data.productName}
              onChange={handleOnChange}
              required
              className="w-full p-2 border rounded bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand Name */}
            <div>
              <label htmlFor="brandName" className="block font-medium mb-1">
                Brand Name
              </label>
              <input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="Enter brand name"
                value={data.brandName}
                onChange={handleOnChange}
                required
                className="w-full p-2 border rounded bg-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block font-medium mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={data.category}
                onChange={handleCategoryChange}
                required
                className="w-full p-2 border rounded bg-slate-100"
              >
                <option value="">Select Category</option>
                {productCategory.map((el, i) => (
                  <option key={i} value={el.value}>
                    {el.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Subcategory */}
          {subcategories.length > 0 && (
            <div>
              <label htmlFor="subcategory" className="block font-medium mb-1">
                Subcategory
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={data.subcategory}
                onChange={handleSubcategoryChange}
                required
                className="w-full p-2 border rounded bg-slate-100"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub, i) => (
                  <option key={i} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sub-Subcategory */}
          {subSubcategories.length > 0 && (
            <div>
              <label
                htmlFor="subSubcategory"
                className="block font-medium mb-1"
              >
                Sub-Subcategory
              </label>
              <select
                id="subSubcategory"
                name="subSubcategory"
                value={data.subSubcategory}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    subSubcategory: e.target.value,
                  }))
                }
                required
                className="w-full p-2 border rounded bg-slate-100"
              >
                <option value="">Select Sub-Subcategory</option>
                {subSubcategories.map((sub, i) => (
                  <option key={i} value={sub.value}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Upload Image */}
          <div>
            <label
              htmlFor="uploadImageInput"
              className="block font-medium mb-1"
            >
              Product Image
            </label>
            <label
              htmlFor="uploadImageInput"
              className="block cursor-pointer p-4 border border-dashed bg-slate-100 rounded text-center hover:bg-slate-200 transition"
            >
              <div className="text-slate-500 flex flex-col items-center gap-2">
                <FaCloudUploadAlt className="text-4xl" />
                <p className="text-sm">Click to upload images</p>
              </div>
              <input
                id="uploadImageInput"
                type="file"
                multiple
                onChange={handleUploadProduct}
                className="hidden"
              />
            </label>
            {data?.productImage?.length > 0 && (
              <div className="mt-2 flex gap-3 flex-wrap">
                {data.productImage.map((img, i) => (
                  <div className="relative group" key={i}>
                    <img
                      src={img}
                      alt="Product"
                      className="w-20 h-20 object-cover border rounded cursor-pointer"
                      onClick={() => {
                        setFullScreenImage(img);
                        setOpenFullScreenImage(true);
                      }}
                    />
                    <div
                      className="absolute bottom-0 right-0 p-1 bg-red-600 text-white text-sm rounded-full hidden group-hover:block cursor-pointer"
                      onClick={() => handleDeleteProductImage(i)}
                    >
                      <MdDelete />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price, Selling Price, etc. */}
            {[
              { id: "price", label: "Price", type: "number" },
              { id: "sellingPrice", label: "Selling Price", type: "number" },
              {
                id: "percentOff",
                label: "Percent Off",
                type: "text",
                readOnly: true,
              },
              { id: "quantity", label: "Quantity", type: "number" },
            ].map(({ id, label, type, readOnly }) => (
              <div key={id}>
                <label htmlFor={id} className="block font-medium mb-1">
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  type={type}
                  readOnly={readOnly}
                  value={data[id]}
                  onChange={handleOnChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full p-2 border rounded bg-slate-100"
                  required={!readOnly}
                />
              </div>
            ))}

            {/* Description, Sold By, Features, Product Info */}
            {[
              { id: "description", label: "Description" },
              { id: "soldBy", label: "Sold By" },
              { id: "features", label: "Features (one per line)" },
              { id: "productInfo", label: "Product Info (one per line)" },
            ].map(({ id, label }) => (
              <div key={id}>
                <label htmlFor={id} className="block font-medium mb-1">
                  {label}
                </label>
                <textarea
                  id={id}
                  name={id}
                  value={data[id]}
                  onChange={handleOnChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full p-2 border rounded bg-slate-100 resize-none h-20"
                />
              </div>
            ))}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg font-semibold transition mt-4"
          >
            Upload Product
          </button>
        </form>

        {/* Fullscreen Image Viewer */}
        {openFullScreenImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
            <div className="relative">
              <img
                src={fullScreenImage}
                alt="Fullscreen"
                className="max-w-full max-h-screen object-contain"
              />
              <button
                className="absolute top-2 right-2 text-white text-3xl"
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

export default UploadProduct;
