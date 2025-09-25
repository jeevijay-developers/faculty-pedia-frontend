"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getAuthToken } from "@/utils/auth";
import { toast } from "react-hot-toast";

/**
 * Authentication-aware enrollment button component
 * Allows browsing without authentication but requires login for enrollment
 */
const EnrollButton = ({
  type = "course", // "course", "testseries", "webinar", "liveclass"
  itemId,
  studentId = null,
  price = 0,
  title = "Enroll Now",
  className = "",
  onEnrollmentSuccess = null,
  disabled = false,
  enrollmentEndpoint = null, // Custom API endpoint if needed
}) => {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

  // Map enrollment types to their respective API endpoints
  const getEnrollmentEndpoint = () => {
    if (enrollmentEndpoint) return enrollmentEndpoint;
    
    const endpoints = {
      course: "/api/subscribe-course",
      testseries: "/api/subscribe-testseries", 
      webinar: "/api/subscribe-webinar",
      liveclass: "/api/subscribe-liveclass"
    };
    
    return endpoints[type];
  };

  const handleEnrollment = async () => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast.error("Please login to enroll in this course");
      // Redirect to login with return URL
      const currentUrl = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // Get student ID from localStorage if not provided
    let actualStudentId = studentId;
    if (!actualStudentId) {
      try {
        const userData = JSON.parse(localStorage.getItem("faculty-pedia-student-data") || "{}");
        actualStudentId = userData._id || userData.id;
      } catch (error) {
        console.error("Error parsing student data:", error);
      }
    }

    if (!actualStudentId) {
      toast.error("Student information not found. Please login again.");
      router.push("/login");
      return;
    }

    if (!itemId) {
      toast.error("Course information missing. Please try again.");
      return;
    }

    setIsEnrolling(true);

    try {
      const token = getAuthToken();
      const endpoint = getEnrollmentEndpoint();
      
      if (!endpoint) {
        throw new Error("Invalid enrollment type");
      }

      // Prepare request body based on type
      const requestBody = {
        studentId: actualStudentId,
      };

      switch (type) {
        case "course":
          requestBody.courseId = itemId;
          break;
        case "testseries":
          requestBody.testSeriesId = itemId;
          break;
        case "webinar":
          requestBody.webinarId = itemId;
          break;
        case "liveclass":
          requestBody.liveClassId = itemId;
          break;
        default:
          throw new Error("Invalid enrollment type");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401 && data.requiresAuth) {
          toast.error("Please login to enroll");
          router.push("/login");
          return;
        }
        
        if (response.status === 409) {
          toast.success("You are already enrolled in this course!");
          if (onEnrollmentSuccess) onEnrollmentSuccess(data);
          return;
        }

        throw new Error(data.message || "Enrollment failed");
      }

      // Success
      toast.success(data.message || "Enrollment successful!");
      
      // Call success callback if provided
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess(data);
      } else {
        // Default success behavior - redirect to dashboard or course page
        setTimeout(() => {
          router.push("/profile?tab=courses");
        }, 1500);
      }

    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error(error.message || "Failed to enroll. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  const displayTitle = price > 0 ? `${title} - ₹${price}` : title;

  return (
    <button
      onClick={handleEnrollment}
      disabled={disabled || isEnrolling}
      className={`${className} ${
        disabled || isEnrolling
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg transform hover:scale-105"
      } transition-all duration-300`}
    >
      {isEnrolling ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Enrolling...</span>
        </div>
      ) : (
        displayTitle
      )}
    </button>
  );
};

export default EnrollButton;