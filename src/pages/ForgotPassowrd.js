import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SummaryApi from "../common";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(SummaryApi.forgetpassword.url, {
        method: SummaryApi.forgetpassword.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Reset link sent to your email");
        setMessage(data.message || "Check your inbox for the reset link");
        setEmail("");
      } else {
        toast.error("Failed to send reset link");
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Server error");
      setMessage("Server error occurred");
    }
  };

  return (
    <>
      <section
        id="forgot-password"
        className="flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200"
      >
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border-2 border-sky-600">
          <h2 className="text-2xl font-bold text-sky-700 mb-2">
            Forgot your password?
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Enter your registered email and we'll send you a link to reset your
            password.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 text-gray-700 font-semibold text-sm"
          >
            <div className="space-y-1">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-100 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
            >
              Send Reset Link
            </button>
          </form>

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
            <Link to="/privacy-policy" className="text-sky-600 hover:underline">
              Privacy Policy
            </Link>
          </p>

          {message && (
            <p className="text-center text-red-600 mt-4">{message}</p>
          )}

          <p className="mt-6 text-sm text-end text-gray-600">
            Back to?{" "}
            <Link
              to="/login"
              className="text-sky-600 hover:text-sky-700 hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ForgotPassword;
