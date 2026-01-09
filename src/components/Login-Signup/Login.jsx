"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuLoaderCircle, LuMail, LuLock } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginUser } from "@/components/server/auth/auth.routes";
import { setAuthToken } from "@/utils/auth";
import Image from "next/image";

const Login = ({
  title = "Welcome",
  onSubmit = null,
  forgotPasswordLink = "/forgot-password",
  signupLink = "/join-as-student",
  onLoginSuccess = null,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getErrorMessage = (error) => {
    if (error.code === "NETWORK_ERROR" || !navigator.onLine) {
      return "Network error. Please check your internet connection.";
    }

    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;

    if (backendMessage) return backendMessage;

    switch (status) {
      case 400:
      case 401:
        return "Invalid email or password.";
      case 403:
        return "Account access denied. Please contact support.";
      case 404:
        return "Service not available. Please contact support.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return "Login failed. Please try again.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
        return;
      }

      // Call login API
      const response = await loginUser(formData.email, formData.password);

      // Store authentication token
      if (response.TOKEN) {
        setAuthToken(response.TOKEN);
      }

      // Store user data based on type
      const storageKey =
        response.userType === "student"
          ? "faculty-pedia-student-data"
          : "faculty-pedia-educator-data";

      localStorage.setItem(storageKey, JSON.stringify(response.userData));
      localStorage.setItem("user-role", response.userType);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new Event(
            response.userType === "student"
              ? "student-data-updated"
              : "educator-data-updated"
          )
        );
      }

      // Show success toast
      toast.success(
        `Welcome back, ${
          response.userData.firstName || response.userData.name || "User"
        }!`
      );

      // Handle navigation
      if (onLoginSuccess) {
        await onLoginSuccess(response.userData, response.userType);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect");

        const destination = redirectUrl
          ? decodeURIComponent(redirectUrl)
          : response.userType === "student"
          ? "/exams"
          : "/educator/dashboard";

        router.replace(destination);
      }
    } catch (error) {
      // Error is already logged in auth.routes.js if it's a network/server error
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Centered Split Container */}
      <div className="w-full max-w-225 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-160 border border-slate-100">
        {/* Left Panel - Brand/Welcome */}
        <div className="relative w-full md:w-5/12 bg-linear-to-br from-blue-50 to-indigo-50 p-10 flex flex-col justify-between">
          {/* Brand Label */}
          {/* <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <LuGraduationCap className="h-5 w-5" />
            </div>
            <span className="text-slate-900 text-sm font-bold tracking-tight">
              Facultypedia
            </span>
          </div> */}

          {/* Welcome Content */}
          <div className="my-auto relative z-10 pt-8">
            <h2 className="text-[#0e121b] tracking-tight text-[28px] font-bold leading-tight mb-3">
              Welcome Back
            </h2>
            <p className="text-slate-600 text-base font-normal leading-relaxed">
              Continue your learning journey with us. Master new skills and
              track your progress.
            </p>

            {/* Abstract Illustration Area */}
            <div className="mt-8 relative h-40 w-full rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-transparent">
                <Image
                  src="/images/placeholders/login_page_image.png"
                  alt="Abstract Illustration"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-blue-100/50 to-transparent"></div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-medium">
              © {new Date().getFullYear()} Facultypedia
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="mb-8">
              <h3 className="text-[#0e121b] tracking-tight text-2xl font-bold leading-tight mb-2">
                {title}
              </h3>
              <p className="text-slate-500 text-sm">
                Enter your credentials to continue
              </p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuMail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-2.5 h-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LuLock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="block w-full pl-10 pr-10 py-2.5 h-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={isLoading}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="h-5 w-5" />
                    ) : (
                      <AiOutlineEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <Link
                  href={forgotPasswordLink}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center h-12.5 border border-transparent text-sm font-bold rounded-[14px] text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all duration-200 mt-2 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LuLoaderCircle className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    <span className="relative z-10">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Sign in</span>
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center pt-2 border-t border-slate-50">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  href={signupLink}
                  className="font-semibold text-blue-600 hover:text-blue-700 relative group/link inline-block transition-colors"
                >
                  Create one
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover/link:w-full"></span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
