"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuLoaderCircle,
  LuUser,
  LuBriefcase,
  LuGraduationCap,
  LuShare2,
  LuCheck,
  LuPlusCircle,
  LuArrowLeft,
  LuArrowRight,
  LuHistory,
  LuBuilding2,
} from "react-icons/lu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiTrash2, FiVideo } from "react-icons/fi";
import toast from "react-hot-toast";
import { signupAsEducator } from "../server/auth/auth.routes";
import API_CLIENT from "../server/config";

const SUBJECT_OPTIONS = [
  "biology",
  "physics",
  "mathematics",
  "chemistry",
  "english",
  "hindi",
];

const EXAM_SUBJECTS = {
  "IIT-JEE": ["chemistry", "physics", "mathematics"],
  NEET: ["chemistry", "physics", "biology"],
  CBSE: ["chemistry", "physics", "mathematics", "biology", "hindi", "english"],
};

const SUBJECT_LIST_DISPLAY = SUBJECT_OPTIONS.map(
  (subject) => subject.charAt(0).toUpperCase() + subject.slice(1)
).join(", ");

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/;
const MIN_BIO_LENGTH = 20;

const parseSubjectInput = (value = "") => {
  const rawEntries = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const normalizedEntries = rawEntries.map((entry) => entry.toLowerCase());

  const valid = normalizedEntries.filter((entry) =>
    SUBJECT_OPTIONS.includes(entry)
  );

  const invalid = rawEntries.filter(
    (_entry, index) => !SUBJECT_OPTIONS.includes(normalizedEntries[index])
  );

  return { valid, invalid };
};

const EducatorSignup = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [introVideoFile, setIntroVideoFile] = useState(null);
  const [isUploadingIntroVideo, setIsUploadingIntroVideo] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    bio: "",
    introVideoLink: "",
    specialization: "IIT-JEE",
    subject: "",

    // Work Experience
    workExperience: [
      {
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrentRole: false,
      },
    ],

    // Qualifications
    qualification: [
      {
        title: "",
        institute: "",
        startDate: "",
        endDate: "",
      },
    ],

    // Social Links
    socials: {
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
  });

  const steps = [
    { id: 1, title: "Personal Info", icon: LuUser },
    { id: 2, title: "Experience", icon: LuBriefcase },
    { id: 3, title: "Education", icon: LuGraduationCap },
    { id: 4, title: "Social Links", icon: LuShare2 },
  ];

  const progressWidth = `${((currentStep - 1) / (steps.length - 1)) * 100}%`;

  const inputClass = (hasError = false) =>
    `w-full h-12 px-4 rounded-xl border bg-white shadow-sm text-[#0e121b] placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  const textareaClass = (hasError = false) =>
    `w-full p-4 rounded-xl border bg-white shadow-sm text-[#0e121b] placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors resize-none ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Reset subject if exam category changes
      if (name === "specialization") {
        updated.subject = "";
      }

      return updated;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleNestedChange = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSocialChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [platform]: value,
      },
    }));
  };

  const handleIntroVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error("Video must be under 500MB");
      return;
    }

    setIntroVideoFile(file);
    setFormData((prev) => ({ ...prev, introVideoLink: "" }));
    toast.success(`Selected: ${file.name}`);
  };

  const uploadIntroVideo = async () => {
    if (!introVideoFile) {
      toast.error("Select a video file first");
      return;
    }

    setIsUploadingIntroVideo(true);
    const toastId = toast.loading("Uploading intro video...");

    try {
      const payload = new FormData();
      payload.append("video", introVideoFile);
      const videoTitle = `${formData.firstName || "Educator"} Intro Video`;
      payload.append("title", videoTitle.trim() || "Intro Video");

      const response = await API_CLIENT.post(
        "/api/videos/upload-to-vimeo",
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 600000,
        }
      );

      const embedUrl =
        response?.data?.data?.vimeo?.embedUrl ||
        response?.data?.data?.video?.links?.[0];

      if (!embedUrl) {
        throw new Error("No video URL returned from server");
      }

      setFormData((prev) => ({ ...prev, introVideoLink: embedUrl }));
      setIntroVideoFile(null);
      toast.success("Intro Video uploaded", { id: toastId });
    } catch (error) {
      console.error("Intro video upload failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to upload intro video";
      toast.error(message, { id: toastId });
    } finally {
      setIsUploadingIntroVideo(false);
    }
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
          isCurrentRole: false,
        },
      ],
    }));
  };

  const removeExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const toggleCurrentRole = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((item, i) =>
        i === index
          ? {
              ...item,
              isCurrentRole: !item.isCurrentRole,
              endDate: !item.isCurrentRole ? "" : item.endDate,
            }
          : item
      ),
    }));
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualification: [
        ...prev.qualification,
        {
          title: "",
          institute: "",
          startDate: "",
          endDate: "",
        },
      ],
    }));
  };

  const removeQualification = (index) => {
    setFormData((prev) => ({
      ...prev,
      qualification: prev.qualification.filter((_, i) => i !== index),
    }));
  };

  const collectStepErrors = (step) => {
    const stepErrors = {};

    switch (step) {
      case 1: {
        const firstName = formData.firstName.trim();
        const lastName = formData.lastName.trim();
        const email = formData.email.trim();
        const mobile = formData.mobileNumber.trim();
        const bio = formData.bio.trim();

        if (!firstName) stepErrors.firstName = "First name is required";
        else if (firstName.length < 2)
          stepErrors.firstName = "First name must be at least 2 characters";

        if (!lastName) stepErrors.lastName = "Last name is required";

        if (!email) stepErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email))
          stepErrors.email = "Invalid email format";

        if (!formData.password) stepErrors.password = "Password is required";
        else if (!STRONG_PASSWORD_REGEX.test(formData.password))
          stepErrors.password =
            "Password must include uppercase, lowercase, and a number";

        if (formData.password !== formData.confirmPassword)
          stepErrors.confirmPassword = "Passwords do not match";

        if (!mobile) stepErrors.mobileNumber = "Mobile number is required";
        else if (!MOBILE_REGEX.test(mobile))
          stepErrors.mobileNumber =
            "Enter a valid 10-digit Indian mobile number starting with 6-9";

        if (!bio) stepErrors.bio = "Bio is required";
        else if (bio.length < MIN_BIO_LENGTH)
          stepErrors.bio = `Bio must be at least ${MIN_BIO_LENGTH} characters`;

        if (!formData.specialization)
          stepErrors.specialization = "Specialization is required";

        if (!formData.subject || !formData.subject.trim()) {
          stepErrors.subject = "Please select a subject";
        } else {
          const allowedSubjects = EXAM_SUBJECTS[formData.specialization] || [];
          if (!allowedSubjects.includes(formData.subject.toLowerCase())) {
            stepErrors.subject = `Invalid subject for ${formData.specialization}`;
          }
        }
        break;
      }
      case 2:
        formData.workExperience.forEach((exp, index) => {
          if (!exp.title)
            stepErrors[`workExperience.${index}.title`] =
              "Job title is required";
          if (!exp.company)
            stepErrors[`workExperience.${index}.company`] =
              "Company is required";
        });
        break;
      case 3:
        formData.qualification.forEach((qual, index) => {
          if (!qual.title)
            stepErrors[`qualification.${index}.title`] =
              "Qualification title is required";
          if (!qual.institute)
            stepErrors[`qualification.${index}.institute`] =
              "Institute is required";
        });
        break;
      default:
        break;
    }

    return stepErrors;
  };

  const validateStep = (step) => {
    const stepErrors = collectStepErrors(step);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateAllSteps = () => {
    const combinedErrors = {};
    let firstInvalidStep = null;

    [1, 2, 3].forEach((step) => {
      const stepErrors = collectStepErrors(step);
      if (!firstInvalidStep && Object.keys(stepErrors).length > 0) {
        firstInvalidStep = step;
      }
      Object.assign(combinedErrors, stepErrors);
    });

    const isValid = Object.keys(combinedErrors).length === 0;
    setErrors(combinedErrors);
    return { isValid, firstInvalidStep };
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const { isValid, firstInvalidStep } = validateAllSteps();
    if (!isValid) {
      setCurrentStep(firstInvalidStep || 1);
      return;
    }

    setIsLoading(true);
    setErrors({});

    const sanitizeEntries = (entries = []) =>
      entries
        .map((entry) => ({
          title: entry.title?.trim() || "",
          company: entry.company?.trim() || "",
          institute: entry.institute?.trim() || "",
          startDate: entry.startDate || "",
          endDate: entry.endDate || "",
          description: entry.description?.trim() || "",
        }))
        .filter(
          (entry) =>
            entry.title ||
            entry.company ||
            entry.institute ||
            entry.startDate ||
            entry.endDate ||
            entry.description
        );

    const sanitizeSocialLinks = (links = {}) =>
      Object.entries(links).reduce((acc, [platform, value]) => {
        if (typeof value === "string" && value.trim()) {
          acc[platform] = value.trim();
        }
        return acc;
      }, {});

    const trimmedFirstName = formData.firstName.trim();
    const trimmedLastName = formData.lastName.trim();
    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedMobile = formData.mobileNumber.trim();
    const trimmedBio = formData.bio.trim();
    const normalizedSubjects = formData.subject
      ? [formData.subject.toLowerCase()]
      : [];

    const submitData = {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      password: formData.password,
      mobileNumber: trimmedMobile,
      bio: trimmedBio,
      specialization: [formData.specialization].filter(Boolean),
      subject: normalizedSubjects,
      workExperience: sanitizeEntries(formData.workExperience).map(
        ({ institute, ...rest }) => rest
      ),
      qualification: sanitizeEntries(formData.qualification).map(
        ({ company, ...rest }) => rest
      ),
      socials: sanitizeSocialLinks(formData.socials),
    };

    if (formData.introVideoLink) {
      submitData.introVideoLink = formData.introVideoLink.trim();
    }

    try {
      const response = await signupAsEducator(submitData);
      const createdEducator =
        response?.data?.educator || response?.educator || response?.data;
      const educatorId = createdEducator?._id || createdEducator?.id;

      alert("Registration successful! Redirecting to your profile.");

      if (educatorId) {
        router.push(`/profile/educator/${educatorId}`);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const backendErrors = error.response?.data?.errors;
      let submitError =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        submitError = backendErrors
          .map((err) => err?.msg || err?.message || err)
          .join(", ");
      }

      setErrors((prev) => ({ ...prev, submit: submitError }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            First Name
          </span>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={inputClass(Boolean(errors.firstName))}
            placeholder="e.g. Arav"
          />
          {errors.firstName && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.firstName}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Last Name
          </span>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={inputClass(Boolean(errors.lastName))}
            placeholder="e.g. Sinha"
          />
          {errors.lastName && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.lastName}
            </span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Email Address
          </span>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={inputClass(Boolean(errors.email))}
            placeholder="arav@example.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.email}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Mobile Number
          </span>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            className={inputClass(Boolean(errors.mobileNumber))}
            placeholder="XXXXXX9658"
          />
          {errors.mobileNumber && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.mobileNumber}
            </span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Password
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${inputClass(Boolean(errors.password))} pr-12`}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.password}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Confirm Password
          </span>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={inputClass(Boolean(errors.confirmPassword))}
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.confirmPassword}
            </span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Exam Category
          </span>
          <select
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className={`${inputClass(
              Boolean(errors.specialization)
            )} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b7280\' viewBox=\'0 0 20 20\'%3E%3Cpath d=\'M5.23 7.21a.75.75 0 011.06.02L10 11.177l3.71-3.946a.75.75 0 111.08 1.04l-4.243 4.51a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z\'/%3E%3C/svg%3E')] bg-no-repeat bg-position-[right_0.75rem_center]`}
          >
            <option value="IIT-JEE">IIT-JEE</option>
            <option value="NEET">NEET</option>
            <option value="CBSE">CBSE</option>
          </select>
          {errors.specialization && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.specialization}
            </span>
          )}
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Specialised Subject
          </span>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`${inputClass(
              Boolean(errors.subject)
            )} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'%236b7280\' viewBox=\'0 0 20 20\'%3E%3Cpath d=\'M5.23 7.21a.75.75 0 011.06.02L10 11.177l3.71-3.946a.75.75 0 111.08 1.04l-4.243 4.51a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z\'/%3E%3C/svg%3E')] bg-no-repeat bg-position-[right_0.75rem_center]`}
          >
            <option value="">Select a subject</option>
            {EXAM_SUBJECTS[formData.specialization]?.map((subj) => (
              <option key={subj} value={subj}>
                {subj.charAt(0).toUpperCase() + subj.slice(1)}
              </option>
            ))}
          </select>
          {errors.subject && (
            <span className="text-xs text-red-500 font-medium mt-1">
              {errors.subject}
            </span>
          )}
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Professional Bio
        </span>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          value={formData.bio}
          onChange={handleInputChange}
          className={textareaClass(Boolean(errors.bio))}
          placeholder="Briefly describe your teaching philosophy and experience..."
        />
        {errors.bio && (
          <span className="text-xs text-red-500 font-medium mt-1">
            {errors.bio}
          </span>
        )}
      </label>

      <div className="space-y-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Introduction Video
        </span>
        <div className="border-2 border-dashed rounded-xl border-slate-200 bg-slate-50 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-100 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-blue-500">
              <FiVideo className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-slate-900">
                Upload introduction video
              </p>
              <p className="text-xs text-slate-500">MP4/MOV up to 500MB</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="file"
              id="introVideoFile"
              accept="video/*"
              onChange={handleIntroVideoFileChange}
              className="hidden"
            />
            <label
              htmlFor="introVideoFile"
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
            >
              Browse Files
            </label>
            <button
              type="button"
              onClick={uploadIntroVideo}
              disabled={isUploadingIntroVideo || !introVideoFile}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {isUploadingIntroVideo ? "Uploading..." : "Upload"}
            </button>
            {introVideoFile && (
              <span className="text-xs text-slate-600 truncate max-w-60">
                {introVideoFile.name}
              </span>
            )}
          </div>
        </div>

        {formData.introVideoLink && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            Intro video ready. Video will be added with your form.
          </p>
        )}

        <p className="text-sm text-slate-500">
          Upload your introduction video. After upload we store the Vimeo link
          for your profile.
        </p>
      </div>
    </div>
  );

  const renderWorkExperience = () => (
    <div className="space-y-6">
      {formData.workExperience.map((exp, index) => (
        <div
          key={index}
          className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <LuHistory className="text-blue-500 h-5 w-5" />
              Experience #{index + 1}
            </h3>
            {formData.workExperience.length > 1 && (
              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Remove Experience"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Title */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) =>
                  handleNestedChange(
                    "workExperience",
                    index,
                    "title",
                    e.target.value
                  )
                }
                className={`w-full h-12 px-4 rounded-lg bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  errors[`workExperience.${index}.title`]
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                }`}
                placeholder="e.g. Senior Mathematics Teacher"
              />
              {errors[`workExperience.${index}.title`] && (
                <p className="mt-2 text-xs text-red-500 font-medium">
                  {errors[`workExperience.${index}.title`]}
                </p>
              )}
            </div>

            {/* Company/Institution */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                School / Institution
              </label>
              <div className="relative">
                <LuBuilding2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) =>
                    handleNestedChange(
                      "workExperience",
                      index,
                      "company",
                      e.target.value
                    )
                  }
                  className={`w-full h-12 pl-11 pr-4 rounded-lg bg-white border text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all ${
                    errors[`workExperience.${index}.company`]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                  }`}
                  placeholder="e.g. Springfield High School"
                />
              </div>
              {errors[`workExperience.${index}.company`] && (
                <p className="mt-2 text-xs text-red-500 font-medium">
                  {errors[`workExperience.${index}.company`]}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="col-span-1">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) =>
                  handleNestedChange(
                    "workExperience",
                    index,
                    "startDate",
                    e.target.value
                  )
                }
                className="w-full h-12 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
              />
            </div>

            {/* End Date */}
            <div className="col-span-1">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  type="month"
                  value={exp.isCurrentRole ? "" : exp.endDate}
                  onChange={(e) =>
                    handleNestedChange(
                      "workExperience",
                      index,
                      "endDate",
                      e.target.value
                    )
                  }
                  disabled={exp.isCurrentRole}
                  className="w-full h-12 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`currentRole${index}`}
                    checked={exp.isCurrentRole}
                    onChange={() => toggleCurrentRole(index)}
                    className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label
                    htmlFor={`currentRole${index}`}
                    className="text-sm text-slate-600 font-medium cursor-pointer select-none"
                  >
                    Present
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">
                Key Responsibilities (Optional)
              </label>
              <textarea
                value={exp.description || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "workExperience",
                    index,
                    "description",
                    e.target.value
                  )
                }
                className="w-full p-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all resize-none h-24"
                placeholder="Briefly describe your role and achievements..."
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add More Button */}
      <button
        type="button"
        onClick={addExperience}
        className="w-full py-4 border-2 border-dashed border-blue-500/30 rounded-xl flex items-center justify-center gap-2 text-blue-500 font-semibold hover:bg-blue-500/5 hover:border-blue-500/50 transition-all group"
      >
        <LuPlusCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
        Add Another Position
      </button>
    </div>
  );

  const renderQualifications = () => (
    <div className="space-y-6">
      {formData.qualification.map((qual, index) => (
        <div
          key={index}
          className="group border border-gray-200 bg-white rounded-2xl p-6 transition-all hover:border-blue-500/30 hover:shadow-sm"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <LuGraduationCap className="text-blue-500 h-5 w-5" />
              Education #{index + 1}
            </h3>
            {formData.qualification.length > 1 && (
              <button
                type="button"
                onClick={() => removeQualification(index)}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Remove Entry"
              >
                <FiTrash2 className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Degree/Qualification */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wide mb-2">
                Degree / Qualification
              </label>
              <input
                type="text"
                value={qual.title}
                onChange={(e) =>
                  handleNestedChange(
                    "qualification",
                    index,
                    "title",
                    e.target.value
                  )
                }
                className={`w-full h-11 px-4 rounded-xl border bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors[`qualification.${index}.title`]
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
                }`}
                placeholder="e.g. Master of Science in Physics"
              />
              {errors[`qualification.${index}.title`] && (
                <p className="mt-2 text-xs text-red-500 font-medium">
                  {errors[`qualification.${index}.title`]}
                </p>
              )}
            </div>

            {/* Institute/University */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wide mb-2">
                Institute / University
              </label>
              <div className="relative">
                <LuBuilding2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
                <input
                  type="text"
                  value={qual.institute}
                  onChange={(e) =>
                    handleNestedChange(
                      "qualification",
                      index,
                      "institute",
                      e.target.value
                    )
                  }
                  className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    errors[`qualification.${index}.institute`]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-gray-200 focus:ring-blue-500 focus:border-transparent"
                  }`}
                  placeholder="e.g. Indian Institute of Technology, Bombay"
                />
              </div>
              {errors[`qualification.${index}.institute`] && (
                <p className="mt-2 text-xs text-red-500 font-medium">
                  {errors[`qualification.${index}.institute`]}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wide mb-2">
                Start Date
              </label>
              <input
                type="month"
                value={qual.startDate}
                onChange={(e) =>
                  handleNestedChange(
                    "qualification",
                    index,
                    "startDate",
                    e.target.value
                  )
                }
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wide mb-2">
                End Date (or Expected)
              </label>
              <input
                type="month"
                value={qual.endDate}
                onChange={(e) =>
                  handleNestedChange(
                    "qualification",
                    index,
                    "endDate",
                    e.target.value
                  )
                }
                className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add More Button */}
      <button
        type="button"
        onClick={addQualification}
        className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-4 text-blue-500 font-semibold hover:bg-blue-50 hover:border-blue-500 transition-all duration-200 flex justify-center items-center gap-2 group"
      >
        <LuPlusCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
        Add More Education
      </button>
    </div>
  );

  const renderSocialLinks = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Social Media Profiles (Optional)
      </h3>
      <p className="text-gray-600 mb-6">
        Connect your social media profiles to build trust with students
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="linkedin"
            className="block text-sm font-medium text-gray-700"
          >
            LinkedIn Profile
          </label>
          <input
            type="url"
            id="linkedin"
            value={formData.socials.linkedin}
            onChange={(e) => handleSocialChange("linkedin", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label
            htmlFor="youtube"
            className="block text-sm font-medium text-gray-700"
          >
            YouTube Channel
          </label>
          <input
            type="url"
            id="youtube"
            value={formData.socials.youtube}
            onChange={(e) => handleSocialChange("youtube", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://youtube.com/c/yourchannel"
          />
        </div>

        <div>
          <label
            htmlFor="twitter"
            className="block text-sm font-medium text-gray-700"
          >
            Twitter Profile
          </label>
          <input
            type="url"
            id="twitter"
            value={formData.socials.twitter}
            onChange={(e) => handleSocialChange("twitter", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://twitter.com/yourusername"
          />
        </div>

        <div>
          <label
            htmlFor="instagram"
            className="block text-sm font-medium text-gray-700"
          >
            Instagram Profile
          </label>
          <input
            type="url"
            id="instagram"
            value={formData.socials.instagram}
            onChange={(e) => handleSocialChange("instagram", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://instagram.com/yourusername"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="facebook"
            className="block text-sm font-medium text-gray-700"
          >
            Facebook Profile
          </label>
          <input
            type="url"
            id="facebook"
            value={formData.socials.facebook}
            onChange={(e) => handleSocialChange("facebook", e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://facebook.com/yourprofile"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-[#0e121b]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="flex items-center justify-between flex-wrap gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg">
              <LuUser className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Educator Onboarding</p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Join as Educator
              </h1>
            </div>
          </div>
          <div className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-500 hover:text-blue-700"
            >
              Log in
            </Link>
          </div>
        </header>

        <div className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8">
          <div className="mb-10">
            <div className="relative mb-6 h-1 bg-slate-200 rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-blue-500 rounded-full transition-all"
                style={{ width: progressWidth }}
              />
            </div>
            <div className="grid grid-cols-4 gap-3 text-sm">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isDone = currentStep > step.id;
                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-2"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 font-semibold shadow-sm ${
                        isDone
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : isActive
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}
                    >
                      {isDone ? (
                        <LuCheck className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`text-center ${
                        isActive
                          ? "text-blue-700 font-semibold"
                          : isDone
                          ? "text-slate-600 font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            {currentStep === 1 && renderPersonalInfo()}
            {currentStep === 2 && renderWorkExperience()}
            {currentStep === 3 && renderQualifications()}
            {currentStep === 4 && renderSocialLinks()}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="w-full sm:w-auto px-5 h-11 rounded-xl font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto px-6 h-11 rounded-xl bg-blue-500 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:bg-blue-700 transition-colors"
              >
                Continue to {steps[currentStep]?.title || "Experience"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto px-8 h-11 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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
            <p className="mt-4 text-sm text-red-600 text-center">
              {errors.submit}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EducatorSignup;
