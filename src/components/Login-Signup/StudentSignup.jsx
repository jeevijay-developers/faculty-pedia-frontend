"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createStudent } from "@/components/server/student/student.routes";
import { LuLoaderCircle, LuUser, LuGraduationCap } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SPECIALIZATION_OPTIONS = ["IIT-JEE", "NEET", "CBSE"];
const CLASS_OPTIONS = [
  { label: "Class 6th", value: "class-6th" },
  { label: "Class 7th", value: "class-7th" },
  { label: "Class 8th", value: "class-8th" },
  { label: "Class 9th", value: "class-9th" },
  { label: "Class 10th", value: "class-10th" },
  { label: "Class 11th", value: "class-11th" },
  { label: "Class 12th", value: "class-12th" },
  { label: "Dropper", value: "dropper" },
];

const StudentSignup = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    specialization: "",
    classLevel: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === "username") {
      nextValue = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    }

    if (name === "mobileNumber") {
      nextValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (!/^[a-z0-9_]{3,30}$/.test(formData.username.trim())) {
      newErrors.username =
        "Username must be 3-30 characters and use lowercase letters, numbers, or underscores";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.specialization) {
      newErrors.specialization = "Select a specialization";
    }

    if (!formData.classLevel) {
      newErrors.classLevel = "Select a class";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter and one number";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
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
    setErrors({});
    setSuccessMessage("");

    try {
      // Create JSON object (exclude confirmPassword as it's not in schema)
      const submitData = {
        name: formData.name.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        mobileNumber: formData.mobileNumber.trim(),
        specialization: formData.specialization,
        class: formData.classLevel,
      };

      const response = await createStudent(submitData);
      const createdStudent = response?.data ?? response?.student ?? response;

      setSuccessMessage(
        response?.message ||
          "Registration successful! Welcome to Faculty Pedia!"
      );

      if (createdStudent?._id) {
        localStorage.setItem(
          "faculty-pedia-student-data",
          JSON.stringify(createdStudent)
        );
        localStorage.setItem("user-role", "student");
      }

      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
        specialization: "",
        classLevel: "",
      });

      setTimeout(() => {
        if (createdStudent?._id) {
          router.push(`/profile/student/${createdStudent._id}`);
        } else {
          router.push(
            "/login?message=Registration successful! Please login to continue."
          );
        }
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle API errors based on the validation chain structure
      if (error.response?.status === 400) {
        // Handle validation errors from express-validator
        if (error.response.data?.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach((err) => {
            const field = err.path || err.param;
            const mappedField = field === "class" ? "classLevel" : field;
            serverErrors[mappedField] = err.msg;
          });
          setErrors(serverErrors);
        } else if (error.response.data?.message) {
          setErrors({ submit: error.response.data.message });
        } else {
          setErrors({ submit: "Please check your input and try again." });
        }
      } else if (error.response?.status === 500) {
        setErrors({ submit: "Server error. Please try again later." });
      } else if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: "Registration failed. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join as Student
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start your learning journey with the best educators
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 pl-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                <LuUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                  errors.username ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="choose a unique handle"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email and Mobile Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobileNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                    errors.mobileNumber ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="9876543210"
                />
                {errors.mobileNumber && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.mobileNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Academic Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="specialization"
                  className="block text-sm font-medium text-gray-700"
                >
                  Specialization *
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                    errors.specialization
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>
                    Select your target exam
                  </option>
                  {SPECIALIZATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.specialization && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.specialization}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="classLevel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Class *
                </label>
                <select
                  id="classLevel"
                  name="classLevel"
                  value={formData.classLevel}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                    errors.classLevel
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                >
                  <option value="" disabled>
                    Select your current class
                  </option>
                  {CLASS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.classLevel && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.classLevel}
                  </p>
                )}
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password *
                </label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <LuGraduationCap className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Redirecting you now...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || successMessage}
                className={`w-full flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl ${
                  successMessage
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LuLoaderCircle className="animate-spin w-5 h-5" />
                    <span>Creating Your Account...</span>
                  </div>
                ) : successMessage ? (
                  <div className="flex items-center space-x-2">
                    <LuGraduationCap className="w-5 h-5" />
                    <span>Account Created Successfully!</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LuGraduationCap className="w-5 h-5" />
                    <span>Start Learning Journey</span>
                  </div>
                )}
              </button>

              {errors.submit && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 text-red-400">⚠️</div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        Registration Failed
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        {errors.submit}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What you'll get:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>1-on-1 Live Classes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Study Material</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Live classes and webinars</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Online Tests and series</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Learn from your favourite teachers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>24/7 doubt resolution</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
