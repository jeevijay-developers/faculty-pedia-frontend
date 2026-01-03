"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));

    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("mobileNumber", formData.mobileNumber);
      if (formData.profileImage) {
        submitData.append("profileImage", formData.profileImage);
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Student registered successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        mobileNumber: "",
        profileImage: null,
      });

      // Reset image preview and file input
      setImagePreview(null);
      const fileInput = document.getElementById("profileImage");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error registering student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Student Registration
          </h2>
        </div>

        <div className="px-6 py-8 space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Mobile Number Field */}
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mobile Number *
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${
                errors.mobileNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your 10-digit mobile number"
              maxLength="10"
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Profile Image Field */}
          <div>
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Profile Image
            </label>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((prev) => ({ ...prev, profileImage: null }));
                      const fileInput = document.getElementById("profileImage");
                      if (fileInput) fileInput.value = "";
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition duration-200"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="profileImage"
                className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition duration-200 ${
                  imagePreview
                    ? "h-20 border-gray-300 bg-gray-50 hover:bg-gray-100"
                    : "h-32 border-gray-300 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {!imagePreview && (
                    <>
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </>
                  )}
                  {imagePreview && formData.profileImage && (
                    <p className="text-sm text-blue-600 font-medium">
                      Click to change image
                    </p>
                  )}
                </div>
                <input
                  id="profileImage"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </div>
            ) : (
              "Register Student"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;
