// AdminLogin.js
import React, { useContext, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ImSpinner8 } from "react-icons/im";
import toast from "react-hot-toast";
import Context from "../../context/index";
import adminProfile from "../../assest/loginProfile1.png";
import SummaryApi from "../../common/index"; // Ensure admin login API is defined here
import Footer from "../../components/Footer"; // Import Footer component

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const { saveAuthToken } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    if (!data.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) return setLoading(false);

    try {
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        const token = result.data;
        saveAuthToken(token);
        toast.success("Admin login successful");
        navigate("/admin-panel"); // Redirect to admin dashboard
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      toast.error("Server error during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-blue-300 via-white to-blue-300">
      <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl p-6 border-2 border-sky-600">
        {/* Logo Box */}
        <div className="flex items-center justify-center p-5 bg-gradient-to-br from-sky-700 to-sky-500 mb-6 rounded-xl shadow-lg">
          <img
            src="YML-LOGO.jpg"
            alt="Logo"
            className="w-32 md:w-44 rounded-md"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-sky-700 mb-1">
              Admin Login!
            </h2>
            <p className="text-md text-gray-600">
              Enter your admin credentials
            </p>
          </div>
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={adminProfile}
              alt="Admin icon"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 text-sm text-gray-700 font-medium"
        >
          {/* Email */}
          <div className="space-y-1">
            <label>Email</label>
            <div className="bg-slate-100 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-sky-500">
              <input
                type="email"
                name="email"
                placeholder="Admin email"
                value={data.email}
                onChange={handleOnChange}
                className={`bg-slate-100 w-full px-3 py-2 rounded-md outline-none ${
                  errors.email ? "border border-red-500" : ""
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label>Password</label>
            <div
              className={`bg-slate-100 rounded-md flex items-center overflow-hidden focus-within:ring-2 focus-within:ring-sky-500 ${
                errors.password
                  ? "border border-red-500"
                  : "border border-transparent"
              }`}
            >
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleOnChange}
                className="w-full px-3 py-2 bg-transparent outline-none"
              />
              <div
                className="px-3 text-lg text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition duration-200 font-semibold disabled:opacity-60"
          >
            {loading ? (
              <>
                <ImSpinner8 className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login to Admin Panel"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLogin;
