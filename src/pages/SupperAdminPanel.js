import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaTags,
  FaAd,
  FaIdCard,
  FaClipboardList,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import profile from "../assest/profile.png";
import { MdCategory, MdDashboard } from "react-icons/md";

const SuperAdminPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (user?.role !== ROLE.SUPER_ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const navLinks = [
    { path: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { path: "all-users", label: "User List", icon: <FaUsers /> },
    { path: "order-list", label: "Order List", icon: <FaClipboardList /> },
    { path: "all-products", label: "Product List", icon: <FaBoxOpen /> },
    {
      path: "all-categories",
      label: "Category List",
      icon: <MdCategory />,
    },
    { path: "all-banners", label: "Banner List", icon: <FaTags /> },
    { path: "all-adbanners", label: "Ad Banner List", icon: <FaAd /> },
    { path: "all-kyc", label: "KYC List", icon: <FaIdCard /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-br from-sky-700 to-sky-500 fixed z-40 w-72 min-h-screen transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-white font-bold text-lg">Super Admin</h2>
          <button onClick={toggleSidebar} className="text-white text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-4">
          <img
            src={user?.profilePic || profile}
            alt="profile"
            className="w-16 h-16 rounded-full mb-2"
          />
          <p className="text-white font-bold capitalize">{user?.name}</p>
          <p className="text-white text-sm">{user?.email}</p>
        </div>
        <hr className="border-white my-4" />

        {/* Navigation */}
        <nav className="px-4 mt-6 space-y-2">
          {navLinks.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full text-left px-4 py-2 rounded-md transition-all font-semibold duration-200 shadow-sm ${
                  isActive
                    ? "bg-gradient-to-r from-green-800 via-green-700 to-lime-800 text-white shadow-md ring-2 ring-lime-400"
                    : "bg-white text-sky-700 hover:bg-sky-100 hover:text-black"
                }`
              }
            >
              {icon} {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ✅ Overlay when sidebar is open on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Content Area */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        {/* Topbar */}
        {!sidebarOpen && (
          <div className="p-4 flex justify-between items-center bg-sky-700 text-white">
            <button
              onClick={toggleSidebar}
              className="text-white text-2xl"
              title="Open Sidebar"
            >
              <FaBars />
            </button>

            <div className="hidden md:flex text-lg font-bold gap-4">
              <p>{currentTime.toLocaleDateString()}</p>
              <p>{currentTime.toLocaleTimeString()}</p>
            </div>

            <h1 className="font-bold text-lg flex items-center gap-2">
              <MdDashboard className="text-2xl" />
              Super Admin Panel
            </h1>
          </div>
        )}

        {/* Routed View */}
        <main className="w-full h-full p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminPanel;
