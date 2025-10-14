"use client";
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Upload,
  User,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Link,
  Star,
} from "lucide-react";

const EducatorForm = () => {
  const [activeExpTab, setActiveExpTab] = useState(0);
  const [activeQualTab, setActiveQualTab] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    image: { public_id: "", url: "" },
    bio: "",
    workExperience: [{ title: "", company: "", startDate: "", endDate: "" }],
    introVideoLink: "",
    qualification: [{ title: "", institute: "", startDate: "", endDate: "" }],
    socials: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
    rating: 0,
    specialization: "IIT-JEE",
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: {
          ...prev.image,
          file: file,
          url: previewUrl,
        },
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (section, defaultItem) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultItem],
    }));

    // Set active tab to the new item
    if (section === "workExperience") {
      setActiveExpTab(formData[section].length);
    } else if (section === "qualification") {
      setActiveQualTab(formData[section].length);
    }
  };

  const removeArrayItem = (section, index) => {
    if (formData[section].length > 1) {
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      }));

      // Adjust active tab if needed
      if (section === "workExperience") {
        if (activeExpTab >= formData[section].length - 1) {
          setActiveExpTab(Math.max(0, activeExpTab - 1));
        }
      } else if (section === "qualification") {
        if (activeQualTab >= formData[section].length - 1) {
          setActiveQualTab(Math.max(0, activeQualTab - 1));
        }
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.bio.trim()) newErrors.bio = "Bio is required";
    if (!formData.specialization)
      newErrors.specialization = "Specialization is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Educator Registration
        </h1>
        <p className="text-gray-600">Complete your profile to get started</p>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <User className="mr-2" size={20} />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.mobileNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter mobile number"
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {formData.image.url ? (
                  <img
                    src={formData.image.url}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a profile image (JPG, PNG, GIF)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio *
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.bio ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Introduction Video Link
            </label>
            <input
              type="url"
              name="introVideoLink"
              value={formData.introVideoLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter video URL"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Briefcase className="mr-2" size={20} />
            Professional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization *
              </label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IIT-JEE">IIT-JEE</option>
                <option value="NEET">NEET</option>
                <option value="CBSE">CBSE</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
              />
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Briefcase className="mr-2" size={20} />
              Work Experience
            </h2>
            <button
              type="button"
              onClick={() =>
                addArrayItem("workExperience", {
                  title: "",
                  company: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Experience
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-200 mb-4">
            {formData.workExperience.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveExpTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 mr-2 mb-2 ${
                  activeExpTab === index
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Experience {index + 1}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">
                Experience {activeExpTab + 1}
              </h3>
              {formData.workExperience.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeArrayItem("workExperience", activeExpTab)
                  }
                  className="flex items-center px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded text-sm"
                >
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.workExperience[activeExpTab]?.title || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "workExperience",
                      activeExpTab,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.workExperience[activeExpTab]?.company || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "workExperience",
                      activeExpTab,
                      "company",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.workExperience[activeExpTab]?.startDate || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "workExperience",
                      activeExpTab,
                      "startDate",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.workExperience[activeExpTab]?.endDate || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "workExperience",
                      activeExpTab,
                      "endDate",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Qualifications */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <GraduationCap className="mr-2" size={20} />
              Qualifications
            </h2>
            <button
              type="button"
              onClick={() =>
                addArrayItem("qualification", {
                  title: "",
                  institute: "",
                  startDate: "",
                  endDate: "",
                })
              }
              className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              <Plus size={16} className="mr-1" />
              Add Qualification
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-200 mb-4">
            {formData.qualification.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveQualTab(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 mr-2 mb-2 ${
                  activeQualTab === index
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Qualification {index + 1}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">
                Qualification {activeQualTab + 1}
              </h3>
              {formData.qualification.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeArrayItem("qualification", activeQualTab)
                  }
                  className="flex items-center px-2 py-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded text-sm"
                >
                  <Trash2 size={14} className="mr-1" />
                  Remove
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.qualification[activeQualTab]?.title || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "qualification",
                      activeQualTab,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Qualification title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institute
                </label>
                <input
                  type="text"
                  value={formData.qualification[activeQualTab]?.institute || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "qualification",
                      activeQualTab,
                      "institute",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Institute name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.qualification[activeQualTab]?.startDate || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "qualification",
                      activeQualTab,
                      "startDate",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.qualification[activeQualTab]?.endDate || ""}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "qualification",
                      activeQualTab,
                      "endDate",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Link className="mr-2" size={20} />
            Social Media Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData.socials).map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={formData.socials[platform]}
                  onChange={(e) =>
                    handleNestedInputChange("socials", platform, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Enter ${platform} URL`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium text-lg"
          >
            Submit Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducatorForm;
