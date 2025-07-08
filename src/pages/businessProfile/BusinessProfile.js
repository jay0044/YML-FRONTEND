import React, { useState, useEffect, useContext } from "react";
import {
  FaUserFriends,
  FaListAlt,
  FaMoneyCheckAlt,
  FaTimes,
  FaBars,
  FaIdCard,
} from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import MyProfile from "./ProfileForm"; // Ensure this imports your KYC form
import moment from "moment";
import SummaryApi from "../../common";
import Context from "../../context/index";

const BusinessProfile = () => {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [activeSection, setActiveSection] = useState("My Team");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar open/close state
  const [userData, setUserData] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [orderData, setOrderData] = useState([]);

  const { authToken } = useContext(Context);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen); // Toggle the sidebar
  };

  useEffect(() => {
    fetchUserData(authToken); // Fetch user data
    fetchOrderData(authToken); // Fetch order data
  }, []);

  const fetchOrderData = async (authToken) => {
    try {
      const response = await fetch(SummaryApi.referralOrders.url, {
        method: SummaryApi.referralOrders.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      let totalBusiness = 0;

      if (Array.isArray(data.orders) && data.orders.length > 0) {
        data.orders.forEach((order) => {
          if (Array.isArray(order.products) && order.products.length > 0) {
            order.products.forEach((product) => {
              if (product.price) {
                totalBusiness += product.price;
              }
            });
          }
        });

        setOrderData(data.orders);
        setUsersData(data.users);
      } else {
        console.log("No orders found.");
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  const fetchUserData = async (authToken) => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

 const renderContent = () => {
  switch (activeSection) {
    case "Business":
      return (
        <div className="p-6 bg-white rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Summary</h2>
          <p className="text-gray-600">Business Content...</p>
        </div>
      );

    case "Your KYC":
      return (
        <div className="p-6 bg-white rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your KYC</h2>
          <MyProfile />
        </div>
      );

    case "My Team":
      return (
        <div className="p-6 bg-white rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Team</h2>
          {Array.isArray(userData?.data?.refferal.myrefferals) &&
          userData.data.refferal.myrefferals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usersData?.map((referral, index) => (
                    <tr
                      key={referral._id || index}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-800">{referral.name}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(referral.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-600">No referrals available.</div>
          )}
        </div>
      );

    default:
      return (
        <div className="p-6 bg-white rounded-lg shadow-md border text-gray-700">
          Select an item to view details.
        </div>
      );
  }
};


  return (
    <div className="relative max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden text-gray-700 z-50 mb-4 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-28" : ""
        }`}
      >
        {sidebarOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
      </button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div
          className={`fixed md:relative top-0 left-0 h-full md:h-auto md:w-1/4 z-40 bg-gradient-to-br from-sky-700 to-sky-500 shadow-lg p-5 rounded-lg transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          {/* Profile */}
          <div className="flex items-center mb-6 bg-white p-2 rounded-md">
            {userData?.profilePic ? (
              <img
                src={userData.profilePic}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover "
              />
            ) : (
              <FaRegCircleUser size={40} className="text-sky-700" />
            )}
            <div className="ml-4">
              <h2 className="text-lg font-bold text-sky-700">
                {userData?.data.name}
              </h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {[
              { label: "My Team", icon: <FaUserFriends />, section: "My Team" },
              { label: "Your KYC", icon: <FaIdCard />, section: "Your KYC" },
              {
                label: "Transaction",
                icon: <FaMoneyCheckAlt />,
                section: "Business",
              },
            ].map(({ label, icon, section }) => (
              <button
                key={label}
                onClick={() => {
                  setSidebarOpen(false);
                  setActiveSection(section);
                }}
                className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-semibold transition ${
                  activeSection === section
                    ? "bg-white text-sky-700"
                    : "text-white hover:bg-sky-100 hover:text-black"
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4 transition-opacity duration-300">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="p-5 bg-white shadow-md rounded-xl border hover:shadow-lg transition">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                My Purchasing
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{userData?.data?.businessPrices?.myPurchase}
              </p>
            </div>

            <div className="p-5 bg-white shadow-md rounded-xl border hover:shadow-lg transition">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                Total Purchasing
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{userData?.data?.businessPrices?.totalPurchase}
              </p>
            </div>

            <div className="p-5 bg-white shadow-md rounded-xl border hover:shadow-lg transition">
              <h3 className="text-sm font-semibold text-gray-500 mb-1">
                Business Incentive
              </h3>
              <p className="text-2xl font-bold text-green-600">
                ₹
                {Number(
                  userData?.data?.businessPrices?.totalIncentive || 0
                ).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Dynamic Content */}
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
