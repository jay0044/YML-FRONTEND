// // src/components/Header.js
// import React, { useState, useEffect, useContext, useRef } from "react";
// import { GrSearch } from "react-icons/gr";
// import { FaShoppingCart } from "react-icons/fa";
// import SummaryApi from "../common";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import ROLE from "../common/role";
// import { useCart } from "../context/CartContext";
// import ProfileIcon from "../assest/loginProfile1.png";
// import { MdAccountBalance, MdLocationPin } from "react-icons/md";
// import { MdShare } from "react-icons/md";
// import { ImProfile } from "react-icons/im";
// import { useSeller } from "../context/SellerContext"; // Import the useSeller hook
// import { BiSolidLogInCircle, BiSolidLogOutCircle } from "react-icons/bi";
// import { useUser } from "../context/UserContext";

// const Header = () => {
//   const { seller } = useSeller(); // Get the seller data from context

//   console.log(seller);

//   // const user = useSelector((state) => state?.user?.user);
//   const { user } = useUser();
//   const { clearUserSession } = useUser(); // Import clearUserSession from UserContext
//   console.log("Header user after login :", user);
//   const dispatch = useDispatch();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
//   const navigate = useNavigate();
//   const searchInput = useLocation();
//   const URLSearch = new URLSearchParams(searchInput?.search);
//   const searchQuery = URLSearch.getAll("q");
//   const [search, setSearch] = useState(searchQuery);
//   const [menuDisplay, setMenuDisplay] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [isSupersale, setIsSupersale] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedAddress, setSelectedAddress] = useState(user?.address?.[0]);

//   const handleAddressSelect = (address) => {
//     setSelectedAddress(address);
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     if (user?.address?.length > 0) {
//       setSelectedAddress(user.address[0]);
//     }
//   }, [user]);

//   // Use cart context
//   const { cartProductCount } = useCart();

//   const dropdownRef = useRef(null); // Ref for dropdown

//   // Click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setMenuOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // const handleLogout = async () => {
//   //   const fetchData = await fetch(SummaryApi.logout_user.url, {
//   //     method: SummaryApi.logout_user.method,
//   //     credentials: "include",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //   });

//   //   const data = await fetchData.json();

//   //   if (data.success) {
//   //     toast.success(data.message);
//   //     dispatch(setUserDetails(null));
//   //     localStorage.removeItem("authToken");
//   //     localStorage.removeItem("sellerToken");

//   //     navigate("/");
//   //   } else if (data.error) {
//   //     toast.error(data.message);
//   //   }
//   // };

//   const handleLogout = async () => {
//     const fetchData = await fetch(SummaryApi.logout_user.url, {
//       method: SummaryApi.logout_user.method,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await fetchData.json();

//     if (data.success) {
//       toast.success(data.message);

//       clearUserSession(); // ✅ Clears authToken, user, Redux

//       navigate("/");
//     } else if (data.error) {
//       toast.error(data.message);
//     }
//   };

//   const handleSearch = (e) => {
//     const { value } = e.target;
//     setSearch(value);
//     navigate(value ? `/search?q=${value}` : "/search");
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen((prev) => !prev);
//   };

//   return (
//     <header className="h-16 shadow-md bg-gradient-to-br from-sky-700 to-sky-500 fixed w-full z-40">
//       <div className="h-full container mx-auto flex items-center justify-between p-5 md:p-0">
//         {/* Logo */}
//         <Link to="/">
//           <img
//             src="/YML-Logo.jpg"
//             alt="Logo"
//             className="w-32 md:w-40 rounded-md"
//           />
//         </Link>

//         {/* Search Bar */}
//         <div className="hidden lg:flex items-center w-full max-w-md bg-white border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-sky-500 overflow-hidden">
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
//             onChange={handleSearch}
//             value={search}
//           />
//           <button className="p-2 bg-sky-700 hover:bg-sky-800 text-white flex items-center justify-center">
//             <GrSearch className="text-xl" />
//           </button>
//         </div>

//         {/* Become a Seller */}
//         {/* <Link
//           to={seller ? "/sellerdashboard" : "/sellerhome"}
//           className="hidden lg:inline-flex items-center gap-2 px-4 py-2 text-md font-semibold text-white bg-green-700 rounded-md hover:bg-sky-700 hover:text-white transition-colors duration-200"
//         >
//           <BsShop className="text-lg" />
//           <span>Become a Seller</span>
//         </Link> */}

//         {/* Supersale Switch */}
//         {/* <div className="hidden lg:flex items-center gap-4 bg-gradient-to-r from-green-800 via-green-700 to-lime-800 p-2 rounded-full shadow-xl ring-2 ring-lime-400">
//           <span
//             className={`flex items-center gap-2 font-semibold text-sm tracking-wide transition-all duration-300 ${
//               isSupersale
//                 ? "text-yellow-300 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]"
//                 : "text-white"
//             }`}
//           >
//             <TbRosetteDiscountCheckFilled className="text-xl text-yellow-400" />
//             SUPER SAVE 25% OFF
//           </span>

//           <label className="relative inline-flex items-center cursor-pointer">
//             <input
//               type="checkbox"
//               className="sr-only peer"
//               checked={isSupersale}
//               onChange={() => setIsSupersale((prev) => !prev)}
//             />
//             <div className="w-12 h-6 bg-gray-100 peer-checked:bg-lime-500 rounded-full transition duration-300" />
//             <div className="absolute left-1 top-0.5 w-5 h-5 rounded-full  bg-yellow-400 peer-checked:bg-white transition-all duration-300 transform peer-checked:translate-x-full shadow-lg" />
//           </label>
//         </div> */}

//         {/* Right Icons */}
//         <div className="flex items-center gap-5">
//           {/* User Location Info */}
//           <Link
//             to="#"
//             onClick={() => setIsModalOpen(true)}
//             className="hidden lg:flex items-center gap-1 text-white text-sm font-medium hover:text-green-300 transition-colors"
//           >
//             <MdLocationPin className="text-2xl text-white italic" />
//             <div className="flex flex-col leading-tight">
//               {selectedAddress ? (
//                 <>
//                   <span className="text-xs">
//                     {selectedAddress.street}, {selectedAddress.city},{" "}
//                     {selectedAddress.state}
//                   </span>
//                   <span className="text-xs">PIN : {selectedAddress.zip}</span>
//                 </>
//               ) : (
//                 <span className="text-md text-white italic">
//                   Select Address
//                 </span>
//               )}
//             </div>
//           </Link>

//           {/* Cart */}
//           <Link
//             to={user?._id ? "/cart" : "/guestcart"}
//             className="relative text-2xl text-white"
//           >
//             <FaShoppingCart />
//             <span className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 text-xs rounded-full flex items-center justify-center">
//               {cartProductCount}
//             </span>
//           </Link>
//           {/* Profile & Dropdown */}
//           {user?._id ? (
//             <div className="relative" ref={dropdownRef}>
//               <img
//                 src={ProfileIcon}
//                 alt={user?.name}
//                 className="w-10 h-10 rounded-full object-cover bg-white cursor-pointer"
//                 onClick={() => setMenuOpen((prev) => !prev)}
//               />
//               {menuOpen && (
//                 <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-md z-50 p-2 text-sm">
//                   <nav className="flex flex-col">
//                     {user.role === ROLE.SUPER_ADMIN && (
//                       <Link
//                         to="/super-admin-panel/dashboard"
//                         className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 hover:text-white p-2 items-center rounded font-semibold"
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         <ImProfile className="mr-2 text-lg" /> Super Admin Panel
//                       </Link>
//                     )}
//                     {user.role === ROLE.ADMIN && (
//                       <Link
//                         to="/admin-panel/all-products"
//                         className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 hover:text-white p-2 items-center rounded font-semibold"
//                         onClick={() => setMenuOpen(false)}
//                       >
//                         <ImProfile className="mr-2 text-lg" /> Admin Panel
//                       </Link>
//                     )}
//                     <Link
//                       to="/user-details"
//                       className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 text-md hover:text-white p-2 items-center rounded font-semibold"
//                       onClick={() => setMenuOpen(false)}
//                     >
//                       <ImProfile className="mr-2 text-lg" /> Profile
//                     </Link>
//                     <Link
//                       to="/businessprofile"
//                       className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 text-md hover:text-white p-2 items-center rounded font-semibold"
//                       onClick={() => setMenuOpen(false)}
//                     >
//                       <MdAccountBalance className="mr-2 text-lg" /> Account
//                     </Link>
//                     <Link
//                       to="/refer"
//                       className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 text-md hover:text-white p-2 items-center rounded font-semibold"
//                       onClick={() => setMenuOpen(false)}
//                     >
//                       <MdShare className="mr-2 text-lg" /> Refer
//                     </Link>
//                     <hr />
//                     <button
//                       onClick={() => {
//                         handleLogout();
//                         setMenuOpen(false);
//                       }}
//                       className="flex whitespace-nowrap text-red-600 hover:text-white hover:bg-red-600 p-2 items-center rounded font-semibold text-md"
//                     >
//                       <BiSolidLogOutCircle className="mr-2 text-lg" /> Logout
//                     </button>
//                   </nav>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link
//                 to="/login"
//                 className="inline-flex items-center gap-2 px-4 py-1 text-md font-bold bg-white text-sky-600 rounded-md hover:bg-sky-700 hover:text-white transition-colors duration-200"
//               >
//                 <BiSolidLogInCircle className="text-xl sm:text-2xl text-inherit" />
//                 <span className="hidden sm:inline">LOGIN</span>
//               </Link>

//               {/* <Link
//                 to="/otp-login"
//                 className="inline-flex items-center gap-2 px-5 py-1 md:py-2 text-md font-bold text-sky-600 bg-white rounded-md hover:bg-sky-700 hover:text-white transition-colors duration-200"
//               >
//                 <BiSolidLogInCircle className="text-2xl" />
//                 OTP-LOGIN
//               </Link> */}
//             </>
//           )}
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//           <div className="bg-white rounded-lg p-4 w-full max-w-md">
//             <h2 className="text-lg font-bold mb-4">Select Delivery Address</h2>

//             {user?.address?.length > 0 ? (
//               <form>
//                 {user.address.map((addr) => (
//                   <label
//                     key={addr._id}
//                     className={`flex items-start gap-3 p-3 rounded cursor-pointer border ${
//                       selectedAddress?._id === addr._id
//                         ? "border-green-500 bg-green-50"
//                         : "border-gray-300"
//                     } hover:bg-sky-50 transition-all mb-2`}
//                   >
//                     <input
//                       type="radio"
//                       name="address"
//                       checked={selectedAddress?._id === addr._id}
//                       onChange={() => setSelectedAddress(addr)}
//                       className="mt-1 accent-green-600"
//                     />
//                     <div>
//                       <div className="font-semibold">{addr.name}</div>
//                       <div className="text-sm text-gray-700">
//                         {addr.street}, {addr.city}, {addr.state} - {addr.zip}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         Mobile: {addr.mobileNo}
//                       </div>
//                     </div>
//                   </label>
//                 ))}
//               </form>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-600 mb-3">No addresses found.</p>
//                 <Link
//                   to="/user-details"
//                   className="text-blue-600 underline font-medium hover:text-blue-800"
//                 >
//                   Add a new address
//                 </Link>
//               </div>
//             )}

//             <div className="mt-4 text-right">
//               {selectedAddress && (
//                 <button
//                   className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Confirm
//                 </button>
//               )}

//               <button
//                 className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

// src/components/Header.js
import React, { useState, useEffect, useContext, useRef } from "react";
import { GrSearch } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import SummaryApi from "../common";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import ROLE from "../common/role";
import { useCart } from "../context/CartContext";
import ProfileIcon from "../assest/loginProfile1.png";
import { MdAccountBalance, MdLocationPin } from "react-icons/md";
import { MdShare } from "react-icons/md";
import { ImProfile } from "react-icons/im";
import { useSeller } from "../context/SellerContext";
import { BiSolidLogInCircle, BiSolidLogOutCircle } from "react-icons/bi";
import { useUser } from "../context/UserContext";
import { FaLocationCrosshairs } from "react-icons/fa6";

const Header = () => {
  const { seller } = useSeller();
  const { user, clearUserSession } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null);

  const { cartProductCount } = useCart();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.address?.length > 0) {
      setSelectedAddress(user.address[0]);
      setTempSelectedAddress(user.address[0]);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await fetchData.json();
    if (data.success) {
      toast.success(data.message);
      clearUserSession();
      navigate("/");
    } else {
      toast.error(data.message);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    navigate(value ? `/search?q=${value}` : "/search");
  };

  const handleOpenModal = () => {
    setTempSelectedAddress(selectedAddress);
    setIsModalOpen(true);
  };

  const handleConfirmAddress = () => {
    setSelectedAddress(tempSelectedAddress);
    setIsModalOpen(false);
  };

  return (
    <header className="h-16 shadow-md bg-gradient-to-br from-sky-700 to-sky-500 fixed w-full z-40">
      <div className="h-full container mx-auto flex items-center justify-between p-5 md:p-0">
        <Link to="/">
          <img
            src="/YML-Logo.jpg"
            alt="Logo"
            className="w-32 md:w-40 rounded-md"
          />
        </Link>

        <div className="hidden lg:flex items-center w-full max-w-md bg-white border border-gray-300 rounded-md shadow-sm overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-4 py-2 text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
            onChange={handleSearch}
            value={search}
          />
          <button className="p-2 bg-sky-700 hover:bg-sky-800 text-white">
            <GrSearch className="text-xl" />
          </button>
        </div>

        <div className="flex items-center gap-5">
          {/* Location Button */}
          {user && (
            <button
              onClick={handleOpenModal}
              className="hidden lg:flex items-start gap-1 text-white text-sm font-medium hover:text-green-300 transition"
            >
              <MdLocationPin className="text-2xl text-white italic" />
              <div className="flex flex-col leading-tight text-left">
                {selectedAddress ? (
                  <>
                    <span className="text-sm">
                      {selectedAddress.street}, {selectedAddress.city},{" "}
                      {selectedAddress.state}
                    </span>
                    <span className="text-xs text-end">
                      PIN : {selectedAddress.zip}
                    </span>
                  </>
                ) : (
                  <span className="text-sm italic">Select Address</span>
                )}
              </div>
            </button>
          )}

          {/* Cart */}
          <Link
            to={user?._id ? "/cart" : "/guestcart"}
            className="relative text-2xl text-white"
          >
            <FaShoppingCart />
            <span className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 text-xs rounded-full flex items-center justify-center">
              {cartProductCount}
            </span>
          </Link>

          {/* Profile Dropdown */}
          {user?._id ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={ProfileIcon}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover bg-white cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
              />
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-md z-50 p-2 text-sm">
                  <nav className="flex flex-col">
                    {user.role === ROLE.SUPER_ADMIN && (
                      <Link
                        to="/super-admin-panel/dashboard"
                        className="menu-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ImProfile className="mr-2 text-lg" /> Super Admin Panel
                      </Link>
                    )}
                    {user.role === ROLE.ADMIN && (
                      <Link
                        to="/admin-panel/all-products"
                        className="menu-link"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ImProfile className="mr-2 text-lg" /> Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/user-details"
                      className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 text-md hover:text-white p-2 items-center rounded font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ImProfile className="mr-2 text-lg" /> Profile
                    </Link>
                    <Link
                      to="/businessprofile"
                      className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 text-md hover:text-white p-2 items-center rounded font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      <MdAccountBalance className="mr-2 text-lg" /> Account
                    </Link>
                    <Link
                      to="/refer"
                      className="flex whitespace-nowrap hover:bg-gradient-to-br from-sky-700 to-sky-500 text-md hover:text-white p-2 items-center rounded font-semibold"
                      onClick={() => setMenuOpen(false)}
                    >
                      <MdShare className="mr-2 text-lg" /> Refer
                    </Link>
                    <hr />
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex text-red-600 hover:bg-red-600 hover:text-white p-2 rounded font-semibold"
                    >
                      <BiSolidLogOutCircle className="mr-2 text-lg" /> Logout
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-1 text-md font-bold bg-white text-sky-600 rounded-md hover:bg-sky-700 hover:text-white"
            >
              <BiSolidLogInCircle className="text-xl" />
              <span className="hidden sm:inline">LOGIN</span>
            </Link>
          )}
        </div>
      </div>

      {/* Address Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md relative">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
              <FaLocationCrosshairs className="text-2xl" />
              Select Delivery Address
            </h2>

            {user?.address?.length > 0 ? (
              <form>
                {user.address.map((addr) => (
                  <label
                    key={addr._id}
                    className={`flex items-start gap-3 p-3 rounded cursor-pointer border ${
                      tempSelectedAddress?._id === addr._id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300"
                    } hover:bg-sky-50 transition-all mb-2`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={tempSelectedAddress?._id === addr._id}
                      onChange={() => setTempSelectedAddress(addr)}
                      className="mt-1 accent-green-600"
                    />
                    <div>
                      <div className="font-semibold">{addr.name}</div>
                      <div className="text-sm text-gray-700">
                        {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mobile: {addr.mobileNo}
                      </div>
                    </div>
                  </label>
                ))}
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-3">No addresses found.</p>
                <Link
                  to="/user-details"
                  onClick={() => setIsModalOpen(false)}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Add a new address
                </Link>
              </div>
            )}

            <div className="mt-4 text-right">
              {tempSelectedAddress && (
                <button
                  className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 mr-2"
                  onClick={handleConfirmAddress}
                >
                  Confirm
                </button>
              )}
              <button
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
