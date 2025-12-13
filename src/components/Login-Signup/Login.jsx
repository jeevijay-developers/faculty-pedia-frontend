"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LuLoaderCircle } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginUser } from "@/components/server/auth/auth.routes";
import { setAuthToken } from "@/utils/auth";

const Login = ({
  title = "Welcome",
  onSubmit = null,
  forgotPasswordLink = "/forgot-password",
  signupLink = "/signup",
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
      const storageKey = response.userType === "student" 
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
      toast.success(`Welcome back, ${response.userData.firstName || response.userData.name || "User"}!`);

      // Handle navigation
      if (onLoginSuccess) {
        await onLoginSuccess(response.userData, response.userType);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get("redirect");
        
        const destination = redirectUrl 
          ? decodeURIComponent(redirectUrl)
          : response.userType === "student" ? "/exams" : "/educator/dashboard";
        
        router.push(destination);
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please enter your credentials to log in.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="h-5 w-5" />
                  ) : (
                    <AiOutlineEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link
                href={forgotPasswordLink}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <LuLoaderCircle className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href={signupLink}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
