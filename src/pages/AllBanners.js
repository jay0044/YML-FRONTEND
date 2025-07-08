import React, { useEffect, useState, useContext } from "react";
import SummaryApi from "../common";
import { FaTrashAlt } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import ROLE from "../common/role";
import Context from "../context/index";
import UploadBanner from "../components/UploadBanner";

const AllBanners = () => {
  const { user } = useUser(); // Get user details from context
  const [allBanner, setAllBanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openUploadBanner, setOpenUploadBanner] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { authToken } = useContext(Context);

  const fetchAllBanner = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.allBanner.url);
      const dataResponse = await response.json();
      const bannersArray = dataResponse?.data
        ? Object.values(dataResponse.data)
        : [];
      setAllBanner(bannersArray);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${SummaryApi.deleteBanner.url}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Banner deleted successfully");
        fetchAllBanner(); // Refresh the banners after deletion
      } else {
        alert("Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  const handleUploadBanner = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    if (!user || (user.role !== ROLE.ADMIN && user.role !== ROLE.SUPER_ADMIN)) {
      alert("You do not have permission to upload banners.");
      return;
    }

    const formData = new FormData();
    formData.append("banner", selectedFile);

    try {
      const response = await fetch(SummaryApi.uploadBanner.url, {
        method: "POST",
        credentials: "include", // Correct spelling
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, // Keep the auth token
        },
        body: formData, // Use formData directly without setting Content-Type
      });

      if (response.ok) {
        alert("Banner uploaded successfully");
        setOpenUploadBanner(false); // Close the form after successful upload
        fetchAllBanner(); // Refresh the banners after upload
      } else {
        alert("Failed to upload banner");
        const errorData = await response.json();
        console.error("Upload Error:", errorData);
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
    }
  };

  useEffect(() => {
    fetchAllBanner();
  }, []);

  if (loading) {
    return <p>Loading banners...</p>; // Display loading state
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pt-10 px-4">
      {/* Render existing banners */}
      {allBanner.length > 0 ? (
        allBanner.map((banner) => (
          <div
            key={banner._id}
            className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
          >
            <img
              src={banner.imageUrl || "/placeholder.jpg"}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow"
                title="Delete Banner"
              >
                <FaTrashAlt size={16} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500 text-lg italic">
          No banners available.
        </p>
      )}

      {/* Add New Banner Card */}
      <div
        className="relative w-full h-48 border-2 border-dashed border-sky-500 rounded-xl flex items-center justify-center text-sky-500 cursor-pointer hover:bg-sky-50 transition"
        onClick={() => setOpenUploadBanner(true)}
      >
        <div className="text-center">
          <p className="text-4xl font-bold">+</p>
          <p className="text-sm mt-1">Add New Banner</p>
        </div>
      </div>

      {/* Banner Upload Modal */}
      {openUploadBanner && (
        <UploadBanner
          onClose={() => setOpenUploadBanner(false)}
          fetchData={fetchAllBanner}
        />
      )}
    </div>
  );
};

export default AllBanners;
