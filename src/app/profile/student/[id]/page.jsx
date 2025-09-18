"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StudentProfile from "@/components/Profile/StudentProfile";
import { getCompleteStudentProfile } from "@/components/server/student/student.routes";

const StudentProfilePage = () => {
  const params = useParams();
  const { id } = params; // Get ID from URL parameter
  
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    // Check if user is viewing their own profile
    const checkProfileOwnership = () => {
      try {
        const userData = localStorage.getItem("faculty-pedia-student-data");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          // Check if the URL ID matches the logged-in user's ID
          if (parsedUserData._id === id) {
            setIsOwnProfile(true);
            // For own profile, use localStorage data directly
            setStudentData({
              student: {
                _id: parsedUserData._id,
                name: parsedUserData.name,
                email: parsedUserData.email,
                mobileNumber: parsedUserData.mobileNumber,
                image: parsedUserData.image,
                role: parsedUserData.role,
                courses: parsedUserData.courses || [],
                tests: parsedUserData.tests || [],
                results: parsedUserData.results || [],
                followingEducators: parsedUserData.followingEducators || [],
                __v: parsedUserData.__v || 0
              }
            });
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Error parsing localStorage data:", err);
      }
      
      // If not own profile or no localStorage data, fetch from API
      fetchStudentProfile(id);
    };

    const fetchStudentProfile = async (studentId) => {
      try {
        setLoading(true);
        setError(null);

        const profileData = await getCompleteStudentProfile(studentId);
        setStudentData(profileData);
        setIsOwnProfile(false);
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

    // Check if it's own profile or fetch from API
    if (id) {
      checkProfileOwnership();
    } else {
      setError("Invalid profile ID");
      setLoading(false);
    }
  }, [id]);

  // Refresh profile data function
  const refreshProfile = async () => {
    if (!id) {
      setError("Profile ID not available");
      return;
    }

    try {
      setError(null);
      
      // If it's own profile, refresh from localStorage
      if (isOwnProfile) {
        const userData = localStorage.getItem("faculty-pedia-student-data");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setStudentData({
            student: {
              _id: parsedUserData._id,
              name: parsedUserData.name,
              email: parsedUserData.email,
              mobileNumber: parsedUserData.mobileNumber,
              image: parsedUserData.image,
              role: parsedUserData.role,
              courses: parsedUserData.courses || [],
              tests: parsedUserData.tests || [],
              results: parsedUserData.results || [],
              followingEducators: parsedUserData.followingEducators || [],
              __v: parsedUserData.__v || 0
            }
          });
        }
      } else {
        // Fetch from API for other profiles
        const profileData = await getCompleteStudentProfile(id);
        setStudentData(profileData);
      }
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
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

export default StudentProfilePage;
