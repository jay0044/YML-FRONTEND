import React, { useState } from "react";
import loginIcons from "../assest/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import toast from "react-hot-toast";
import profile from "../assest/loginProfile1.png";
import Footer from "../components/Footer";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    refferredbycode: "",
    confirmPassword: "",
    mobileNo: "",
    profilePic: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!data.mobileNo) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(data.mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10-digit mobile number";
    }
    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("name", data.name);
    formData.append("refferredbycode", data.refferredbycode);
    formData.append("mobileNo", data.mobileNo);

    try {
      const dataResponse = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method,
        body: formData,
      });

      const dataApi = await dataResponse.json();

      if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/login");
      } else {
        toast.error(dataApi.message);
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Signup failed. Please try again later.");
    }
  };

  return (
    <>
      <section
        id="signup"
        className="flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200"
      >
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-8 border-2 border-sky-600">
          <div className="flex items-center justify-between mb-6">
            {/* Text Block */}
            <div>
              <h2 className="text-2xl font-bold text-sky-700 mb-2">
                Create a new account!
              </h2>
              <p className="text-base text-gray-600">
                Fill in the details to create your account.
              </p>
            </div>

            {/* Profile Image */}
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img
                src={profile}
                alt="signup icon"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Responsive Grid Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700 font-medium "
          >
            {/* Name */}
            <div className="space-y-1 ">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={data.name}
                onChange={handleOnChange}
                className={`bg-slate-100 w-full px-3 py-2 rounded-md outline-none focus-within:ring-2 focus-within:ring-sky-500 ${
                  errors.name ? "border border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={data.email}
                onChange={handleOnChange}
                className={`bg-slate-100 w-full px-3 py-2 rounded-md outline-none focus-within:ring-2 focus-within:ring-sky-500 ${
                  errors.email ? "border border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Mobile No */}
            <div className="space-y-1">
              <label>Mobile No</label>
              <input
                type="number"
                name="mobileNo"
                placeholder="Enter mobile number"
                value={data.mobileNo}
                onChange={handleOnChange}
                className={`bg-slate-100 w-full px-3 py-2 rounded-md outline-none focus-within:ring-2 focus-within:ring-sky-500 ${
                  errors.mobileNo ? "border border-red-500" : ""
                }`}
              />
              {errors.mobileNo && (
                <p className="text-red-500 text-xs">{errors.mobileNo}</p>
              )}
            </div>

            {/* Referral Code */}
            <div className="space-y-1">
              <label>Referral Code (Optional)</label>
              <input
                type="text"
                name="refferredbycode"
                placeholder="Enter referral code"
                value={data.refferredbycode}
                onChange={handleOnChange}
                className="bg-slate-100 w-full px-3 py-2 rounded-md outline-none focus-within:ring-2 focus-within:ring-sky-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label>Password</label>
              <div
                className={`bg-slate-100 flex items-center rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-sky-500 ${
                  errors.password ? "border border-red-500" : ""
                }`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={data.password}
                  onChange={handleOnChange}
                  className="w-full px-3 py-2 bg-transparent outline-none "
                />
                <div
                  className="px-3 text-xl cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label>Confirm Password</label>
              <div
                className={`bg-slate-100 flex items-center rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-sky-500${
                  errors.confirmPassword ? "border border-red-500" : ""
                }`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  className="w-full px-3 py-2 bg-transparent outline-none"
                />
                <div
                  className="px-3 text-xl cursor-pointer text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button spans full width */}
            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-md transition duration-200 font-semibold"
              >
                Sign Up
              </button>
              <p className="text-sm text-center mt-3 text-gray-600">
                By clicking on Submit, I accept the{" "}
                <Link
                  to="/terms-and-condition"
                  className="text-sky-600 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                &{" "}
                <Link
                  to="/privacy-policy"
                  className="text-sky-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>

          {/* Login Prompt */}
          <p className="mt-6 text-sm text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SignUp;
