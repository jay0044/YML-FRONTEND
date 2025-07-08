// OtpLogin.js
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowRightLong } from "react-icons/fa6";
import { ImSpinner8 } from "react-icons/im";
import otpprofile from "../assest/loginProfile1.png";
import login from "../assest/shop.png";
import Footer from "../components/Footer";
import SummaryApi from "../common";
import Context from "../context/index";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";

const OtpLogin = () => {
  const [identity, setIdentity] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = enter OTP
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // seconds for resend timer
  const { saveAuthToken } = useContext(Context);
  const { fetchUserDetails } = useUser();
  const firstInputRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    if (step === 2 && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [step]);

  // Cooldown timer effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!identity.trim()) return toast.error("Please enter email or mobile.");
    setLoading(true);

    try {
      const res = await fetch(SummaryApi.sendOtp.url, {
        method: SummaryApi.sendOtp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identity }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        setStep(2);
        setCooldown(30); // start 30 sec cooldown
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("Please enter OTP.");
    setLoading(true);

    try {
      const res = await fetch(SummaryApi.verifyOtp.url, {
        method: SummaryApi.verifyOtp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identity, otp }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success(result.message);
        const token = result.token;
        saveAuthToken(token);
        await fetchUserDetails(token);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      toast.error("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = () => {
    if (cooldown === 0) {
      handleSendOtp(new Event("submit")); // trigger send
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="flex flex-col lg:flex-row w-full max-w-4xl rounded-lg overflow-hidden shadow-lg border border-sky-600 bg-white">
          {/* Left – Info Section */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-sky-700 to-sky-500 text-white p-6 sm:p-8 flex flex-col justify-between items-start">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Login to YML Mart ®
            </h2>
            <p className="text-sm sm:text-base mb-4 leading-relaxed">
              <span className="font-semibold">YML Mart</span> is your one-stop
              destination for all your shopping needs.<span>😀</span>
            </p>

            {/* Image aligned to bottom right and responsive */}
            <div className="flex-1 flex flex-col justify-end md:justify-between items-end w-full">
              <img
                src={login}
                alt="Login Illustration"
                className="w-32 sm:w-40 md:w-60 lg:w-60 xl:w-60 object-contain"
              />
            </div>
          </div>

          {/* Right – Form Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 flex justify-center items-center">
            <div className="w-full">
              {/* Top Info */}
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <img
                    src={otpprofile}
                    alt="OTP Icon"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-sky-700 text-center mb-2">
                  Welcome Back!
                </h2>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                  {step === 1
                    ? "Enter your email or mobile to continue"
                    : "Please enter the OTP sent to"}
                </p>
                {step === 2 && (
                  <div className="text-sky-700 font-semibold text-sm text-center mt-1">
                    {identity}
                    <button
                      className="ml-2 text-red-600 underline text-xs"
                      onClick={() => setStep(1)}
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Form */}
              <form
                onSubmit={step === 1 ? handleSendOtp : handleVerifyOtp}
                className="space-y-5 font-medium text-sm text-gray-700"
              >
                {step === 1 && (
                  <div className="space-y-2">
                    <label className="text-sky-700">
                      Enter Email or Mobile Number
                    </label>
                    <div className="flex">
                      <input
                        required
                        ref={inputRef}
                        type="text"
                        value={identity}
                        onChange={(e) => setIdentity(e.target.value)}
                        placeholder="e.g, example@mail.com or 901XXXXXXX"
                        className="w-full px-4 py-2 bg-slate-100 border-2 rounded-md  text-base outline-none focus:ring-2 focus:ring-sky-500 transition duration-150"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-center">
                      Enter OTP
                    </label>

                    {/* ✅ Centered and limited width container */}
                    <div className="flex justify-center">
                      <div className="flex justify-between gap-2 w-[280px]">
                        {[...Array(6)].map((_, i) => (
                          <input
                            ref={i === 0 ? firstInputRef : null} // 👈 Auto-focus first input
                            key={i}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[i] || ""}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/, "");
                              const newOtp = otp.split("");
                              newOtp[i] = val;
                              setOtp(newOtp.join(""));
                              if (val && e.target.nextSibling)
                                e.target.nextSibling.focus();
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                !otp[i] &&
                                e.target.previousSibling
                              ) {
                                e.target.previousSibling.focus();
                              }
                            }}
                            className="w-10 h-10 text-center text-xl border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-800 transition duration-200 font-semibold disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <ImSpinner8 className="animate-spin" />
                      Processing...
                    </>
                  ) : step === 1 ? (
                    <>
                      <FaArrowRightLong />
                      Request OTP
                    </>
                  ) : (
                    <>
                      <FaArrowRightLong />
                      Verify & Login
                    </>
                  )}
                </button>
              </form>

              {/* Resend */}
              {step === 2 && (
                <p className="mt-4 text-center text-sm text-gray-700">
                  Didn't receive the code?{" "}
                  <button
                    className="text-red-600 font-semibold disabled:opacity-60 text-sm"
                    onClick={handleResend}
                    disabled={cooldown > 0}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                  </button>
                </p>
              )}
              <Link
                to="/forgot-password"
                className="block text-right text-sm text-sky-600 hover:underline"
              >
                Forgot password?
              </Link>
              {/* Terms */}
              <p className="text-sm text-center mt-4 text-gray-600">
                By continuing, you accept the{" "}
                <Link
                  to="/terms-and-condition"
                  className="text-sky-600 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy-policy"
                  className="text-sky-600 hover:underline"
                >
                  Privacy Policy
                </Link>
              </p>

              {/* Sign Up */}
              <p className="mt-6 text-sm text-center">
                Don’t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-sky-600 hover:text-sky-700 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default OtpLogin;
