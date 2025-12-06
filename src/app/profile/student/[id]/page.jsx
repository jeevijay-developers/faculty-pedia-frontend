"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StudentProfile from "@/components/Profile/StudentProfile";
import { getStudentById } from "@/components/server/student/student.routes";

const StudentProfilePage = () => {
  const params = useParams();
  const { id } = params; // Get ID from URL parameter
  
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const hydrateFromStorage = () => {
      try {
        const raw = localStorage.getItem("faculty-pedia-student-data");
        if (!raw) {
          return false;
        }

        const parsed = JSON.parse(raw);
        if (parsed?._id !== id) {
          return false;
        }

        setIsOwnProfile(true);
        // Don't set loading to false yet - we still need to fetch full data
        return true;
      } catch (err) {
        console.error("Error parsing localStorage data:", err);
        return false;
      }
    };

    const fetchStudentProfile = async (studentId) => {
      try {
        setLoading(true);
        setError(null);

        const profileData = await getStudentById(studentId);
        console.log("📊 Fetched student profile data:", profileData);
        console.log("📊 Following educators:", profileData?.followingEducators);
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

    if (!id) {
      setError("Invalid profile ID");
      setLoading(false);
      return;
    }

    // Check if it's own profile
    const isOwn = hydrateFromStorage();
    
    // Always fetch from API to get populated data (courses, educators, etc.)
    fetchStudentProfile(id);
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
        const raw = localStorage.getItem("faculty-pedia-student-data");
        if (raw) {
          try {
            setStudentData(JSON.parse(raw));
          } catch (parseError) {
            console.error("Error parsing stored student data:", parseError);
          }
        }
      } else {
        const profileData = await getStudentById(id);
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
