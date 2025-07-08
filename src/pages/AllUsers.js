import React, { useEffect, useState } from "react";
import SummaryApi from "../common";
import toast from "react-hot-toast";
import moment from "moment";
import { MdModeEdit, MdDelete } from "react-icons/md";
import ChangeUserRole from "../components/ChangeUserRole";
import * as XLSX from "xlsx"; // Import xlsx for Excel manipulation
import Loader from "../components/Loader";
import { FaUser, FaUserTie } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6"; // if using Font Awesome 6 icons


const AllUsers = () => {
  const [allUser, setAllUsers] = useState([]);
  const [openUpdateRole, setOpenUpdateRole] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading

  const [updateUserDetails, setUpdateUserDetails] = useState({
    email: "",
    name: "",
    role: "",
    phone: "", // Add phone field here
    _id: "",
  });

  // Function to export data to Excel
  const exportToExcel = (users) => {
    const worksheetData = [];

    // Prepare data for Excel
    users.forEach((user, index) => {
      worksheetData.push({
        "Sr. No.": index + 1,
        Name: user.name || "No name available",
        Email: user.email || "No email available",
        Phone: user.mobileNo || "No phone number available", // Add phone number
        Role: user.role || "No role available",
        "Created Date":
          moment(user.createdAt).format("LL") || "No date available",
      });
    });

    // Create a new workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, "user_list.xlsx");
  };

  const fetchAllUsers = async () => {
    setLoading(true); // Set loading to true when fetching starts

    try {
      const fetchData = await fetch(SummaryApi.allUser.url, {
        method: SummaryApi.allUser.method,
        credentials: "include",
      });

      const dataResponse = await fetchData.json();

      if (dataResponse.success) {
        setAllUsers(dataResponse.data);
      }
      console.log(dataResponse);
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const fetchResponse = await fetch(`/api/delete-user/${userId}`, {
          method: "DELETE",
          credentials: "include",
        });

        const responseData = await fetchResponse.json();

        if (responseData.success) {
          toast.success("User deleted successfully");
          fetchAllUsers(); // Refresh the user list after deletion
        } else {
          toast.error("Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("An error occurred while deleting the user");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">All Users</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-200"
          onClick={() => exportToExcel(allUser)}
        >
          Get Excel Sheet
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-full h-64">
          <Loader />
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Sr.
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allUser.map((el, index) => (
                <tr key={el._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-800 font-semibold">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                    {el?.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                    {el?.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                    {el?.mobileNo || (
                      <span className="text-gray-400 italic">
                        No phone number
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md font-semibold text-white text-xs
                        ${
                            el?.role === "SUPER_ADMIN"
                            ? "bg-sky-700"
                            : el?.role === "ADMIN"
                            ? "bg-green-700"
                            : "bg-orange-700"
                        }`}
                    >
                      {el?.role === "SUPER_ADMIN" && <FaUserTie />}
                      {el?.role === "ADMIN" && <FaClipboardUser />}
                      {el?.role === "GENERAL" && <FaUser />}
                      {el?.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 font-semibold">
                    {moment(el?.createdAt).format("LL")}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      title="Edit Role"
                      className="p-2 bg-green-100 hover:bg-green-500 hover:text-white text-green-600 rounded-full transition"
                      onClick={() => {
                        setUpdateUserDetails(el);
                        setOpenUpdateRole(true);
                      }}
                    >
                      <MdModeEdit size={18} />
                    </button>
                    <button
                      title="Delete User"
                      className="p-2 bg-red-100 hover:bg-red-500 hover:text-white text-red-600 rounded-full transition"
                      onClick={() => deleteUser(el._id)}
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {openUpdateRole && (
        <ChangeUserRole
          onClose={() => setOpenUpdateRole(false)}
          name={updateUserDetails.name}
          email={updateUserDetails.email}
          phone={updateUserDetails.mobileNo}
          role={updateUserDetails.role}
          userId={updateUserDetails._id}
          callFunc={fetchAllUsers}
        />
      )}
    </div>
  );
};

export default AllUsers;
