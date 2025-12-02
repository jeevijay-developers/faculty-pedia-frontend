"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiX, FiUser, FiMail, FiPhone, FiCamera, FiCheckCircle, FiSave, FiLoader } from 'react-icons/fi';

const EditEducatorProfileModal = ({ isOpen, onClose, educatorData, onSave }) => {
  // Handle both image and profileImage fields for compatibility
  const initialImage = educatorData?.image || educatorData?.profileImage;
  
  const [formData, setFormData] = useState({
    firstName: educatorData?.firstName || "",
    lastName: educatorData?.lastName || "",
    email: educatorData?.email || "",
    mobileNumber: educatorData?.mobileNumber || "",
    bio: educatorData?.bio || "",
    introVideoLink: educatorData?.introVideoLink || "",
    image: initialImage || null,
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [imagePreview, setImagePreview] = useState(initialImage?.url || null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: "Please select a valid image file"
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: "Image size should be less than 5MB"
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ""
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters long";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters long";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = "Bio must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess("");
    try {
      // Prepare form data for API
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName.trim());
      submitData.append('lastName', formData.lastName.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('mobileNumber', formData.mobileNumber.trim());
      submitData.append('bio', formData.bio.trim());
      if (formData.introVideoLink) {
        submitData.append('introVideoLink', formData.introVideoLink.trim());
      }
      
      if (formData.image && typeof formData.image !== 'string') {
        submitData.append('image', formData.image);
      }

      const result = await onSave(submitData);
      
      // Update localStorage with new educator data (same as login)
      if (result && result.educator) {
        localStorage.setItem(
          "faculty-pedia-educator-data",
          JSON.stringify(result.educator)
        );
      }
      
      setSuccess("Profile updated successfully!");
      
      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Profile update failed:', error);
      
      // Handle different types of errors
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error.response) {
        // Server responded with error status
        const serverMessage = error.response.data?.message;
        if (serverMessage) {
          errorMessage = serverMessage;
        }
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message;
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens/closes
  const handleClose = () => {
    const initialImage = educatorData?.image || educatorData?.profileImage;
    
    setFormData({
      firstName: educatorData?.firstName || "",
      lastName: educatorData?.lastName || "",
      email: educatorData?.email || "",
      mobileNumber: educatorData?.mobileNumber || "",
      bio: educatorData?.bio || "",
      introVideoLink: educatorData?.introVideoLink || "",
      image: initialImage || null,
    });
    setImagePreview(initialImage?.url || null);
    setErrors({});
    setLoading(false);
    onClose();
  };

  // Lock/unlock body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent layout shift
    } else {
      // Unlock body scroll
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, loading]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8 max-h-[calc(100vh-2rem)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm flex items-center">
                <FiCheckCircle className="w-4 h-4 mr-2" />
                {success}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg relative">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  disabled={loading}
                >
                  <FiCamera className="w-3 h-3" />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-2">{errors.image}</p>
              )}
            </div>

            {/* First Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="w-4 h-4 inline mr-2" />
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.firstName ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="Enter your first name"
                disabled={loading}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="w-4 h-4 inline mr-2" />
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.lastName ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="Enter your last name"
                disabled={loading}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="w-4 h-4 inline mr-2" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.mobileNumber ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="Enter your mobile number"
                disabled={loading}
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.bio ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="Tell us about yourself..."
                disabled={loading}
              />
              {errors.bio && (
                <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
              )}
            </div>

            {/* Intro Video Link Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intro Video Link (Optional)
              </label>
              <input
                type="url"
                name="introVideoLink"
                value={formData.introVideoLink}
                onChange={handleChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                  errors.introVideoLink ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="https://youtube.com/watch?v=..."
                disabled={loading}
              />
              {errors.introVideoLink && (
                <p className="text-red-500 text-xs mt-1">{errors.introVideoLink}</p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEducatorProfileModal;