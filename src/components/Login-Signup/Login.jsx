"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuLoaderCircle } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginUser } from "@/components/server/auth/auth.routes";
import { setAuthToken } from "@/utils/auth";
import DebugInfo from "@/components/Common/DebugInfo";

const Login = ({
  title = "Welcome",
  onSubmit = null,
  forgotPasswordLink = "/forgot-password",
  signupLink = "/signup",
  onLoginSuccess = null, // Callback for handling successful login with user role
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (onSubmit) {
        // Use the provided onSubmit function for custom logic
        await onSubmit(formData);
      } else {
        // Default generic login logic
        console.log("Attempting login with:", {
          email: formData.email,
        });

        try {
          // Call the generic loginUser API
          const response = await loginUser(formData.email, formData.password);
          // Store token using auth utility
          if (response.TOKEN) {
            setAuthToken(response.TOKEN);
            console.log("Token stored successfully");
          }

          // Store user data based on user type
          if (response.userType === "student") {
            localStorage.setItem(
              "faculty-pedia-student-data",
              JSON.stringify(response.userData)
            );
          } else if (response.userType === "educator") {
            localStorage.setItem(
              "faculty-pedia-educator-data",
              JSON.stringify(response.userData)
            );
          }

          // Store user role for easy access
          localStorage.setItem("user-role", response.userType);

          // Call success callback with user data and role
          if (onLoginSuccess) {
            await onLoginSuccess(response.userData, response.userType);
          } else {
            // Default redirect based on user type
            const defaultRedirect = response.userType === "student" ? "/exams" : "/educator/dashboard";
            router.push(defaultRedirect);
          }
          
        } catch (loginError) {
          console.error("Login API error:", loginError);
          console.error("Error details:", {
            status: loginError.response?.status,
            data: loginError.response?.data,
            message: loginError.message,
            config: {
              url: loginError.config?.url,
              baseURL: loginError.config?.baseURL,
              method: loginError.config?.method,
            },
          });
          throw loginError;
        }
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different types of errors
      let errorMessage = "Login failed. Please try again.";

      if (error.code === "NETWORK_ERROR" || !navigator.onLine) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint not found. Please contact support.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid email or password.";
      } else if (error.response?.status === 403) {
        errorMessage = "Account access denied. Please contact support.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message && error.message !== "Network Error") {
        errorMessage = error.message;
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Connection failed. Please check if the server is running.";
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 px-4 shadow-lg sm:rounded-lg sm:px-8 sm:py-8 border border-gray-200">
          <div className="w-full">
            <div className="sm:mx-auto sm:w-full sm:max-w-md mb-3">
              {/* Header */}
              <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                {title}
              </h2>
              <p className="text-center text-sm text-gray-600">
                Please enter your credentials to log in.
              </p>
            </div>
            {/* Removed duplicate container div */}
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
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
                    className={`appearance-none block w-full px-3 py-3 sm:py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-sm transition-colors ${
                      errors.email
                        ? "border-red-300 text-red-900 placeholder-red-300"
                        : "border-gray-300 text-gray-900"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
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
                    className={`appearance-none block w-full px-3 py-3 sm:py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-sm transition-colors ${
                      errors.password
                        ? "border-red-300 text-red-900 placeholder-red-300"
                        : "border-gray-300 text-gray-900"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg sm:text-xl text-gray-400 hover:text-blue-600 focus:text-blue-600 cursor-pointer focus:outline-none transition-colors p-1"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible />
                    ) : (
                      <AiOutlineEye />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-sm float-end">
                <Link
                  href={forgotPasswordLink}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 sm:py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LuLoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>

                {errors.submit && (
                  <p className="mt-2 text-sm text-red-600 text-center">
                    {errors.submit}
                  </p>
                )}
              </div>
            </form>

            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href={signupLink}
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up here
              </Link>
            </p>

            {/* Additional Info */}
            <div className="mt-4 sm:mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Secure login portal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Component - Only show in development or when needed */}
      {process.env.NODE_ENV === "development" && <DebugInfo />}
    </div>
  );
};

export default Login;
