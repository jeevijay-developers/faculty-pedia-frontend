"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  LuMail,
  LuLockKeyhole,
  LuArrowLeft,
  LuArrowRight,
  LuLoaderCircle,
} from "react-icons/lu";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import API_CLIENT from "@/components/server/config";

const ForgotPassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    userType: "student",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackState, setFeedbackState] = useState(null); // 'success' | 'error' | null
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear feedback when user types
    if (feedbackState) {
      setFeedbackState(null);
      setFeedbackMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedbackState(null);
    setFeedbackMessage("");

    try {
      const response = await API_CLIENT.post("/api/auth/forgot-password", {
        email: formData.email,
        userType: formData.userType,
      });

      if (response.data.success) {
        setFeedbackState("success");
        setFeedbackMessage(
          response.data.message || "OTP sent successfully to your email!"
        );
        toast.success("OTP sent to your email!");

        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          router.push(
            `/reset-password?email=${encodeURIComponent(
              formData.email
            )}&userType=${formData.userType}`
          );
        }, 2000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";

      setFeedbackState("error");
      setFeedbackMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-linear-to-b from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col items-center justify-center p-4">
      {/* Main Card Container */}
      <main className="w-full max-w-105 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 overflow-hidden relative z-20">
        {/* Decorative Top Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-blue-400 to-blue-600"></div>

        <div className="p-8 pt-10 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="mb-6 h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800">
            <LuLockKeyhole className="text-[28px]" />
          </div>

          {/* Header Section */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Forgot your password?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-[90%]">
            Enter your registered email to receive a verification code
          </p>

          {/* Feedback States */}
          {feedbackState === "error" && (
            <div className="w-full mt-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-lg p-3 flex items-start gap-2 text-left animate-in fade-in slide-in-from-top-2 duration-300">
              <FaExclamationCircle className="text-red-500 text-sm mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                {feedbackMessage}
              </p>
            </div>
          )}

          {feedbackState === "success" && (
            <div className="w-full mt-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3 flex items-start gap-2 text-left animate-in fade-in slide-in-from-top-2 duration-300">
              <FaCheckCircle className="text-green-600 dark:text-green-500 text-sm mt-0.5 shrink-0" />
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                {feedbackMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form
            className="w-full mt-8 flex flex-col gap-5"
            onSubmit={handleSubmit}
          >
            {/* User Type Selection */}
            <div className="flex flex-col gap-1.5 text-left">
              <label
                className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 ml-1"
                htmlFor="userType"
              >
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, userType: "student" }))
                  }
                  className={`h-11 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                    formData.userType === "student"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  disabled={isLoading}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, userType: "educator" }))
                  }
                  className={`h-11 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                    formData.userType === "educator"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                  disabled={isLoading}
                >
                  Educator
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5 text-left group">
              <label
                className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                  <LuMail className="text-[20px]" />
                </div>
                <input
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-600/10 transition-all duration-200 outline-none h-12 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  id="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="group relative w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(36,99,235,0.2)] flex items-center justify-center overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {!isLoading && (
                <>
                  <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                  <span className="flex items-center gap-2 relative z-10">
                    <span>Send OTP</span>
                    <LuArrowRight className="text-[18px] transition-transform group-hover:translate-x-0.5" />
                  </span>
                </>
              )}
              {isLoading && (
                <span className="flex items-center gap-2">
                  <LuLoaderCircle className="animate-spin h-5 w-5" />
                  <span>Sending...</span>
                </span>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <LuArrowLeft className="text-[16px] transition-transform group-hover:-translate-x-0.5" />
              Back to login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
        <p> {new Date().getFullYear()} Facultypedia. All rights reserved.</p>
      </footer>

      {/* Shimmer Animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
