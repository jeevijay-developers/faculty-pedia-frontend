"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createStudent } from "@/components/server/student/student.routes";
import {
  LuLoaderCircle,
  LuUser,
  LuGraduationCap,
  LuMail,
  LuPhone,
  LuLock,
  LuSchool,
  LuBookOpen,
  LuVideo,
  LuFileText,
  LuCircleCheck,
  LuUsers,
  LuAtSign,
} from "react-icons/lu";
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
        response?.message || "Registration successful! Welcome to Facultypedia!"
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 lg:p-8 bg-linear-to-br from-[#F9FAFB] to-[#EEF2FF]">
      {/* Main Container */}
      <div className="w-full max-w-250 rounded-3xl bg-white shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col lg:flex-row min-h-175">
        {/* Left Panel - Benefits */}
        <div className="relative flex flex-col justify-between w-full lg:w-[40%] bg-blue-600 p-8 lg:p-10 text-white overflow-hidden">
          {/* Background Gradient Effects */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-white blur-[100px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-300 blur-[80px]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full gap-8">
            {/* Header */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <LuGraduationCap className="h-7 w-7" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Facultypedia
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
                Start Your <br /> Learning Journey
              </h1>
              <p className="text-blue-100 text-base lg:text-lg font-light leading-relaxed max-w-75">
                Unlock your potential with the best educators and structured
                learning paths.
              </p>
            </div>

            {/* Benefits List */}
            <div className="flex flex-col gap-6 mt-auto">
              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <LuVideo className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-white font-medium text-sm leading-snug">
                    Live Interactive Classes
                  </p>
                  <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                    Learn from the best in real-time with Q&A.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <LuFileText className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-white font-medium text-sm leading-snug">
                    Premium Study Material
                  </p>
                  <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                    Access high-quality notes and PDFs anytime.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <LuBookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-white font-medium text-sm leading-snug">
                    Real-time Tests & Series
                  </p>
                  <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                    Evaluate your progress effectively.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <LuCircleCheck className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-white font-medium text-sm leading-snug">
                    Expert Educators
                  </p>
                  <p className="text-blue-100 text-xs leading-relaxed opacity-80">
                    Guidance from top-tier mentors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-white p-8 lg:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="w-full max-w-lg mx-auto">
            {/* Form Header */}
            <div className="mb-8">
              <h2 className="text-[#0e121b] tracking-tight text-[28px] font-bold leading-tight">
                Create Student Account
              </h2>
              <p className="text-[#4d6599] text-base font-normal leading-normal mt-2">
                Join thousands of students learning smarter
              </p>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-6">
                <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 border border-green-100">
                  <LuCircleCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 text-sm font-medium">
                      {successMessage}
                    </p>
                    <p className="text-green-600 text-xs">
                      Redirecting to your dashboard...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Row 1: Name and Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Full Name
                  </span>
                  <div className="relative group">
                    <LuUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#94a3b8] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 ${
                        errors.name ? "border-red-300" : "border-[#d0d7e7]"
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.name}
                    </p>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Username
                  </span>
                  <div className="relative group">
                    <LuAtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#94a3b8] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 ${
                        errors.username ? "border-red-300" : "border-[#d0d7e7]"
                      }`}
                      placeholder="johndoe123"
                    />
                  </div>
                  {errors.username && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.username}
                    </p>
                  )}
                </label>
              </div>

              {/* Row 2: Email and Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Email Address
                  </span>
                  <div className="relative group">
                    <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#94a3b8] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 ${
                        errors.email ? "border-red-300" : "border-[#d0d7e7]"
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.email}
                    </p>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Mobile Number
                  </span>
                  <div className="relative group">
                    <LuPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#94a3b8] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 ${
                        errors.mobileNumber
                          ? "border-red-300"
                          : "border-[#d0d7e7]"
                      }`}
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.mobileNumber}
                    </p>
                  )}
                </label>
              </div>

              {/* Row 3: Specialization and Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Specialization
                  </span>
                  <div className="relative group">
                    <LuSchool className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors z-10" />
                    <select
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-10 text-sm outline-none transition-all text-[#0e121b] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 appearance-none cursor-pointer ${
                        errors.specialization
                          ? "border-red-300"
                          : "border-[#d0d7e7]"
                      }`}
                    >
                      <option value="" disabled>
                        Select Area
                      </option>
                      {SPECIALIZATION_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <LuUsers className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  </div>
                  {errors.specialization && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.specialization}
                    </p>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Class/Grade
                  </span>
                  <div className="relative group">
                    <LuGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors z-10" />
                    <select
                      id="classLevel"
                      name="classLevel"
                      value={formData.classLevel}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-10 text-sm outline-none transition-all text-[#0e121b] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 appearance-none cursor-pointer ${
                        errors.classLevel
                          ? "border-red-300"
                          : "border-[#d0d7e7]"
                      }`}
                    >
                      <option value="" disabled>
                        Select Class
                      </option>
                      {CLASS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <LuBookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  </div>
                  {errors.classLevel && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.classLevel}
                    </p>
                  )}
                </label>
              </div>

              {/* Row 4: Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Password
                  </span>
                  <div className="relative group">
                    <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-10 text-sm outline-none transition-all placeholder:text-[#94a3b8] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 ${
                        errors.password ? "border-red-300" : "border-[#d0d7e7]"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible className="h-5 w-5" />
                      ) : (
                        <AiOutlineEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.password}
                    </p>
                  )}
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[#0e121b] text-sm font-medium">
                    Confirm Password
                  </span>
                  <div className="relative group">
                    <LuLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full h-12 rounded-xl border bg-[#f8f9fc] pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#94a3b8] focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/10 ${
                        errors.confirmPassword
                          ? "border-red-300"
                          : "border-[#d0d7e7]"
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500 font-medium mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </label>
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-red-600">⚠️</div>
                    <div>
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || successMessage}
                  className="group relative w-full h-13 flex justify-center items-center rounded-xl bg-blue-600 text-white text-base font-semibold shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-600/30 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <LuLoaderCircle className="animate-spin w-5 h-5" />
                      <span>Creating Account...</span>
                    </div>
                  ) : successMessage ? (
                    <div className="flex items-center gap-2">
                      <LuCircleCheck className="w-5 h-5" />
                      <span>Account Created!</span>
                    </div>
                  ) : (
                    <>
                      <span className="group-hover:-translate-x-1 transition-transform">
                        Start Learning
                      </span>
                      <LuGraduationCap className="absolute right-6 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#4d6599]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
