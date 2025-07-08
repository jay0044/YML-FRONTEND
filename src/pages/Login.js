// Login.js
import React, { useContext, useState } from "react";
import loginIcons from "../assest/loginProfile1.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
// import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";
import Context from "../context/index";
import { FaArrowRightLong } from "react-icons/fa6";
import profile from "../assest/loginProfile1.png";
import Footer from "../components/Footer";
import { ImSpinner8 } from "react-icons/im"; // Spinner icon
import toast from "react-hot-toast";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const { saveAuthToken } = useContext(Context);
  const { fetchUserDetails } = useUser(); // Use UserContext
  const { authToken } = useContext(Context); // Get the authToken from Context
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!data.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validate()) {
      setLoading(false); // ❗ Add this line
      return;
    }
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
        toast.success(result.message);

        const token = result.data;

        if (token) {
          saveAuthToken(token); // Save the token to context and localStorage
          await fetchUserDetails(token); // Fetch user details

          // Merge guest cart with user's cart
          const mergeGuestCart = async () => {
            const guestCart =
              JSON.parse(localStorage.getItem("guestCart")) || [];
            if (guestCart.length > 0 && token) {
              const response = await fetch(SummaryApi.mergeCart.url, {
                method: SummaryApi.mergeCart.method,
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ cart: guestCart }),
              });
              // Clear localStorage after merging
              localStorage.removeItem("guestCart");
            }
          };

          await mergeGuestCart(); // Call the function to merge the cart

          navigate("/"); // Redirect to home page
        } else {
          toast.error("Token is undefined.");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <>
      <section
        id="login"
        className="flex items-center justify-center px-6 py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200"
      >
        <div className="w-full max-w-sm bg-white shadow-2xl rounded-xl p-6 border-2 border-sky-600">
          <div className="flex items-center justify-between mb-6">
            {/* Text Block */}
            <div>
              <h2 className="text-2xl font-bold text-sky-700 mb-2">
                Welcome back!
              </h2>
              <p className="text-base text-gray-600">
                Please sign in to your account
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

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5 font-medium text-sm text-gray-700"
          >
            {/* Email */}
            <div className="space-y-1">
              <label>Email</label>
              <div className="bg-slate-100 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-sky-500">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={handleOnChange}
                  className="bg-slate-100 w-full px-3 py-2 outline-none"
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
              <Link
                to="/forgot-password"
                className="block text-right text-sm text-sky-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700 transition duration-200 font-semibold disabled:opacity-60"
            >
              {loading ? (
                <>
                  <ImSpinner8 className="animate-spin" />
                  <span className="sr-only" aria-live="polite">
                    Logging in...
                  </span>
                  Logging in...
                </>
              ) : (
                <>
                  <FaArrowRightLong />
                  Login
                </>
              )}
            </button>

            {/* T&C */}
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
          </form>

          {/* Sign Up Prompt */}
          <p className="mt-6 text-sm text-center">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
