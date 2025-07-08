import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import SummaryApi from "../common";
import Footer from "../components/Footer";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const resetUrl = SummaryApi.resetpassword.url.replace(":token", token);

    try {
      const response = await fetch(resetUrl, {
        method: SummaryApi.resetpassword.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful");
        setMessage(data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Reset failed");
        setMessage(data.message || "Invalid or expired token");
      }
    } catch (error) {
      toast.error("Error occurred");
      setMessage("An error occurred");
    }
  };

  return (
    <>
      <section className="flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-100 via-white to-blue-200">
        <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8 border-2 border-sky-600">
          <h2 className="text-2xl font-bold text-sky-700 mb-2">
            Reset Password
          </h2>
          <p className="text-base text-gray-600 mb-6">
            Enter your registered email and we'll send you a link to reset your
            password.
          </p>
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full bg-slate-100 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-sky-500"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-slate-100 px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-2 rounded-md hover:bg-sky-700"
            >
              Reset Password
            </button>
          </form>
          {message && (
            <p className="mt-4 text-center text-red-600">{message}</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ResetPassword;
