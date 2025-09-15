"use client";

import { useState, useEffect } from "react";
import StudentProfile from "@/components/Profile/StudentProfile";
import { getCompleteStudentProfile } from "@/components/server/student/student.routes";

const StudentProfilePage = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const getUserFromStorage = () => {
      try {
        const userData = localStorage.getItem("faculty-pedia-student-data");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          console.log("User data from localStorage:", parsedUserData);

          if (parsedUserData._id) {
            setUserId(parsedUserData._id);
            return parsedUserData._id;
          } else {
            throw new Error("User ID not found in stored data");
          }
        } else {
          throw new Error("No user data found in localStorage");
        }
      } catch (err) {
        console.error("Error getting user from localStorage:", err);
        setError("Please login to view profile");
        setLoading(false);
        return null;
      }
    };

    const fetchStudentProfile = async (studentId) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching profile for student ID:", studentId);

        const profileData = await getCompleteStudentProfile(studentId);
        console.log("Student profile data:", profileData);

        setStudentData(profileData);
      } catch (err) {
        console.error("Error loading student profile:", err);

        let errorMessage = "Failed to load student profile";
        if (err.response?.status === 404) {
          errorMessage = "Student not found";
        } else if (err.response?.status === 403) {
          errorMessage = "Access denied";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Get user ID and fetch profile
    const userIdFromStorage = getUserFromStorage();
    if (userIdFromStorage) {
      fetchStudentProfile(userIdFromStorage);
    }
  }, []);

  // Refresh profile data function
  const refreshProfile = async () => {
    if (!userId) {
      setError("User ID not available");
      return;
    }

    try {
      setError(null);
      const profileData = await getCompleteStudentProfile(userId);
      setStudentData(profileData);
    } catch (err) {
      console.error("Error refreshing profile:", err);
      setError("Failed to refresh profile data");
    }
  };

  return (
    <div>
      <StudentProfile
        studentData={studentData}
        loading={loading}
        error={error}
        onRefresh={refreshProfile}
      />
    </div>
  );
};

export default StudentProfilePage;
