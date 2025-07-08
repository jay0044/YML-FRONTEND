// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { FaRegCircleUser } from "react-icons/fa6";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import ROLE from "../common/role";
// import profile from "../assest/profile.png";

// const AdminPanel = () => {
//   const user = useSelector((state) => state?.user?.user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (user?.role !== ROLE.ADMIN) {
//       navigate("/");
//     }
//   }, [user, navigate]);

//   return (
//     <div className="min-h-screen flex">
//       <aside className="bg-gradient-to-br from-sky-700 to-sky-500 max-h-full w-64 max-w-70 customShadow">
//         <div className="h-32 flex justify-center items-center flex-col ">
//           <div className="text-3xl cursor-pointer relative flex justify-center mt-5">
//             {user?.profilePic ? (
//               <img
//                 src={user?.profilePic}
//                 className="w-20 h-20 rounded-full p-5"
//                 alt={user?.name}
//               />
//             ) : (
//               <img
//                 src={profile}
//                 className="w-14 h-14 rounded-full"
//                 alt={user?.name}
//               />
//               // <FaRegCircleUser className="text-white m-2" />
//             )}
//           </div>
//           <p className="capitalize text-lg font-semibold text-white mt-2">
//             {user?.name}
//           </p>
//           <p className="text-sm font-semibold text-white">
//             Role : {user?.role}
//           </p>
//         </div>
//         <hr className="border border-white mt-5" />

//         <nav className="p-4">
//           {/* Use NavLink instead of Link and apply active styling */}
//           <NavLink
//             to="all-products"
//             className={({ isActive }) =>
//               `block px-2 py-1 font-semibold rounded ${
//                 isActive
//                   ? "bg-sky-100 text-black hover:bg-sky-100 hover:text-black"
//                   : "hover:bg-sky-100 hover:text-black text-white"
//               }`
//             }
//           >
//             All Products
//           </NavLink>
//           <NavLink
//             to={"order-list"}
//             className={({ isActive }) =>
//               `block px-2 py-1 font-semibold rounded ${
//                 isActive
//                   ? "bg-sky-100 text-black hover:bg-sky-100 hover:text-black"
//                   : "hover:bg-sky-100 hover:text-black text-white"
//               }`
//             }
//           >
//             All Orders
//           </NavLink>
//           <NavLink
//             to={"all-banners"}
//             className={({ isActive }) =>
//               `block px-2 py-1 font-semibold rounded  ${
//                 isActive
//                   ? "bg-sky-100 text-black hover:bg-sky-100 hover:text-black"
//                   : "hover:bg-sky-100 hover:text-black text-white"
//               }`
//             }
//           >
//             Offer Banners
//           </NavLink>
//           <NavLink
//             to={"all-adbanners"}
//             className={({ isActive }) =>
//               `block px-2 py-1 font-semibold rounded ${
//                 isActive
//                   ? "bg-sky-100 text-black hover:bg-sky-100 hover:text-black"
//                   : "hover:bg-sky-100 hover:text-black text-white"
//               }`
//             }
//           >
//             Ad Banners
//           </NavLink>
//         </nav>
//       </aside>
//       <main className="flex-1 p-2">
//         <Outlet />
//       </main>
//     </div>
//   );
// };

// export default AdminPanel;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaBars, FaTimes } from "react-icons/fa";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ROLE from "../common/role";
import profile from "../assest/profile.png";
import { MdDashboard } from "react-icons/md";

const AdminPanel = () => {
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
    if (user?.role !== ROLE.ADMIN) {
      navigate("/");
    }
  }, [user, navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-br from-sky-700 to-sky-500 fixed z-40 w-64 min-h-screen  transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar header with toggle button */}
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-white font-bold text-lg">Admin</h2>
          <button onClick={toggleSidebar} className="text-white text-xl">
            <FaTimes />
          </button>
        </div>

        {/* Profile Section */}
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
          {[
            { to: "all-products", label: "All Products" },
            { to: "order-list", label: "All Orders" },
            { to: "all-banners", label: "Offer Banners" },
            { to: "all-adbanners", label: "Ad Banners" },
            { to: "user-details", label: "My Profile" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md font-semibold transition-colors ${
                  isActive
                    ? "bg-sky-100 text-black"
                    : "hover:bg-sky-100 hover:text-black text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ✅ Overlay when sidebar is open on small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Content area */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ease-in-out bg-cyan-900 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Toggle icon when sidebar is closed */}
        {!sidebarOpen && (
          <div className="p-4 flex justify-between items-center bg-sky-700 text-white">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="text-white text-2xl"
              title="Open Sidebar"
            >
              <FaBars />
            </button>
            {/* Date & Time - only visible on md and above */}
            <div className="hidden md:flex text-lg font-bold gap-2">
              <p>{currentTime.toLocaleDateString()}</p>
              <p>{currentTime.toLocaleTimeString()}</p>
            </div>

            {/* Title */}
            <h1 className="font-bold text-lg flex items-center gap-2">
              <MdDashboard className="text-2xl" />
              Admin Panel
            </h1>
          </div>
        )}
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
