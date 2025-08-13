'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuLoaderCircle, LuUser, LuBriefcase, LuGraduationCap, LuShare2, LuCheck } from "react-icons/lu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";

const EducatorSignup = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobileNumber: '',
        bio: '',
        profileImage: null,
        introVideoLink: '',
        specialization: 'IIT-JEE',

        // Work Experience
        workExperience: [
            {
                title: '',
                company: '',
                startDate: '',
                endDate: ''
            }
        ],

        // Qualifications
        qualification: [
            {
                title: '',
                institute: '',
                startDate: '',
                endDate: ''
            }
        ],

        // Social Links
        socials: {
            instagram: '',
            facebook: '',
            twitter: '',
            linkedin: '',
            youtube: ''
        }
    });

    const steps = [
        { id: 1, title: 'Personal Info', icon: LuUser },
        { id: 2, title: 'Experience', icon: LuBriefcase },
        { id: 3, title: 'Education', icon: LuGraduationCap },
        { id: 4, title: 'Social Links', icon: LuShare2 }
    ];

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                [name]: file
            }));

            // Create preview for profile image
            if (file && name === 'profileImage') {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleNestedChange = (section, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleSocialChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            socials: {
                ...prev.socials,
                [platform]: value
            }
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            workExperience: [...prev.workExperience, {
                title: '',
                company: '',
                startDate: '',
                endDate: ''
            }]
        }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            workExperience: prev.workExperience.filter((_, i) => i !== index)
        }));
    };

    const addQualification = () => {
        setFormData(prev => ({
            ...prev,
            qualification: [...prev.qualification, {
                title: '',
                institute: '',
                startDate: '',
                endDate: ''
            }]
        }));
    };

    const removeQualification = (index) => {
        setFormData(prev => ({
            ...prev,
            qualification: prev.qualification.filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.firstName) newErrors.firstName = 'First name is required';
                if (!formData.lastName) newErrors.lastName = 'Last name is required';
                if (!formData.email) newErrors.email = 'Email is required';
                else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
                if (!formData.password) newErrors.password = 'Password is required';
                else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
                if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
                if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
                else if (!/^\d{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'Invalid mobile number';
                if (!formData.bio) newErrors.bio = 'Bio is required';
                if (!formData.specialization) newErrors.specialization = 'Specialization is required';
                break;
            case 2:
                formData.workExperience.forEach((exp, index) => {
                    if (!exp.title) newErrors[`workExperience.${index}.title`] = 'Job title is required';
                    if (!exp.company) newErrors[`workExperience.${index}.company`] = 'Company is required';
                });
                break;
            case 3:
                formData.qualification.forEach((qual, index) => {
                    if (!qual.title) newErrors[`qualification.${index}.title`] = 'Qualification title is required';
                    if (!qual.institute) newErrors[`qualification.${index}.institute`] = 'Institute is required';
                });
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep(currentStep)) {
            return;
        }

        setIsLoading(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (key === 'workExperience' || key === 'qualification') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key === 'socials') {
                    submitData.append(key, JSON.stringify(formData[key]));
                } else if (key !== 'confirmPassword') {
                    submitData.append(key, formData[key]);
                }
            });

            // API call would go here
            console.log('Educator registration data:', formData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Handle success (redirect to login or dashboard)
            alert('Registration successful! Please login to continue.');

        } catch (error) {
            setErrors({ submit: error.message || 'Registration failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const renderPersonalInfo = () => (
        <div className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    {previewImage ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                            <Image
                                src={previewImage}
                                alt="Profile preview"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center">
                            <FiUpload className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                    <label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <FiUpload className="w-4 h-4" />
                    </label>
                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                </div>
                <p className="text-sm text-gray-500">Upload your profile picture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name *
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.firstName ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Arav"
                    />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.lastName ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="Sinha"
                    />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>
            </div>

            <div className='flex flex-col justify-between md:flex-row gap-4'>
                {/* Email */}
                <div className='flex-1'>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="arav@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div className='flex-1'>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                        Mobile Number *
                    </label>
                    <input
                        type="tel"
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="XXXXXX9658"
                    />
                    {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password *
                    </label>
                    <div className="mt-1 relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="******"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password *
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                        placeholder="******"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
            </div>

            {/* Specialization */}
            <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                    Specialization *
                </label>
                <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.specialization ? 'border-red-300' : 'border-gray-300'
                        }`}
                >
                    <option value="IIT-JEE">IIT-JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="CBSE">CBSE</option>
                </select>
                {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
            </div>

            {/* Bio */}
            <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio *
                </label>
                <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.bio ? 'border-red-300' : 'border-gray-300'
                        }`}
                    placeholder="Tell us about yourself, your teaching philosophy, and experience..."
                />
                {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
            </div>

            {/* Intro Video Link */}
            <div>
                <label htmlFor="introVideoLink" className="block text-sm font-medium text-gray-700">
                    Introduction Video Link (Optional)
                </label>
                <input
                    type="url"
                    id="introVideoLink"
                    name="introVideoLink"
                    value={formData.introVideoLink}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                />
                <p className="mt-1 text-sm text-gray-500">Share a video introducing yourself to potential students</p>
            </div>
        </div>
    );

    const renderWorkExperience = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
                <button
                    type="button"
                    onClick={addExperience}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add Experience
                </button>
            </div>

            {formData.workExperience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">Experience #{index + 1}</h4>
                        {formData.workExperience.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleNestedChange('workExperience', index, 'title', e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`workExperience.${index}.title`] ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Senior Physics Teacher"
                            />
                            {errors[`workExperience.${index}.title`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`workExperience.${index}.title`]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Company/Institution *
                            </label>
                            <input
                                type="text"
                                value={exp.company}
                                onChange={(e) => handleNestedChange('workExperience', index, 'company', e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`workExperience.${index}.company`] ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., ABC Coaching Institute"
                            />
                            {errors[`workExperience.${index}.company`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`workExperience.${index}.company`]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={exp.startDate}
                                onChange={(e) => handleNestedChange('workExperience', index, 'startDate', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={exp.endDate}
                                onChange={(e) => handleNestedChange('workExperience', index, 'endDate', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Leave empty if currently working here</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderQualifications = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Educational Qualifications</h3>
                <button
                    type="button"
                    onClick={addQualification}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add Qualification
                </button>
            </div>

            {formData.qualification.map((qual, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700">Qualification #{index + 1}</h4>
                        {formData.qualification.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeQualification(index)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Remove
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Degree/Qualification *
                            </label>
                            <input
                                type="text"
                                value={qual.title}
                                onChange={(e) => handleNestedChange('qualification', index, 'title', e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`qualification.${index}.title`] ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., M.Sc. Physics"
                            />
                            {errors[`qualification.${index}.title`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`qualification.${index}.title`]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Institute/University *
                            </label>
                            <input
                                type="text"
                                value={qual.institute}
                                onChange={(e) => handleNestedChange('qualification', index, 'institute', e.target.value)}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`qualification.${index}.institute`] ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="e.g., Delhi University"
                            />
                            {errors[`qualification.${index}.institute`] && (
                                <p className="mt-1 text-sm text-red-600">{errors[`qualification.${index}.institute`]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Start Date
                            </label>
                            <input
                                type="date"
                                value={qual.startDate}
                                onChange={(e) => handleNestedChange('qualification', index, 'startDate', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <input
                                type="date"
                                value={qual.endDate}
                                onChange={(e) => handleNestedChange('qualification', index, 'endDate', e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <p className="mt-1 text-sm text-gray-500">Leave empty if currently pursuing</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderSocialLinks = () => (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Profiles (Optional)</h3>
            <p className="text-gray-600 mb-6">Connect your social media profiles to build trust with students</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                        LinkedIn Profile
                    </label>
                    <input
                        type="url"
                        id="linkedin"
                        value={formData.socials.linkedin}
                        onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                    />
                </div>

                <div>
                    <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                        YouTube Channel
                    </label>
                    <input
                        type="url"
                        id="youtube"
                        value={formData.socials.youtube}
                        onChange={(e) => handleSocialChange('youtube', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://youtube.com/c/yourchannel"
                    />
                </div>

                <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                        Twitter Profile
                    </label>
                    <input
                        type="url"
                        id="twitter"
                        value={formData.socials.twitter}
                        onChange={(e) => handleSocialChange('twitter', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://twitter.com/yourusername"
                    />
                </div>

                <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                        Instagram Profile
                    </label>
                    <input
                        type="url"
                        id="instagram"
                        value={formData.socials.instagram}
                        onChange={(e) => handleSocialChange('instagram', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://instagram.com/yourusername"
                    />
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                        Facebook Profile
                    </label>
                    <input
                        type="url"
                        id="facebook"
                        value={formData.socials.facebook}
                        onChange={(e) => handleSocialChange('facebook', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://facebook.com/yourprofile"
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Join as Educator
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Shape minds, inspire futures, and build your teaching legacy
                    </p>

                    {/* Progress Steps */}
                    <div className="flex justify-center space-x-8 mb-8">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center space-x-2 ${currentStep >= step.id
                                            ? 'text-blue-600'
                                            : 'text-gray-400'
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id
                                                ? 'bg-blue-600 border-blue-600 text-white'
                                                : 'border-gray-300 text-gray-400'
                                            }`}
                                    >
                                        {currentStep > step.id ? (
                                            <LuCheck className="w-5 h-5" />
                                        ) : (
                                            <Icon className="w-5 h-5" />
                                        )}
                                    </div>
                                    <span className="hidden sm:block font-medium">{step.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Step Content */}
                        <div className="mb-8">
                            {currentStep === 1 && renderPersonalInfo()}
                            {currentStep === 2 && renderWorkExperience()}
                            {currentStep === 3 && renderQualifications()}
                            {currentStep === 4 && renderSocialLinks()}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <LuLoaderCircle className="animate-spin w-5 h-5" />
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <span>Complete Registration</span>
                                    )}
                                </button>
                            )}
                        </div>

                        {errors.submit && (
                            <p className="mt-4 text-sm text-red-600 text-center">{errors.submit}</p>
                        )}
                    </form>

                    {/* Login Link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/educator-login"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducatorSignup;