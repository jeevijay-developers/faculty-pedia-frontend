// import { API_CLIENT } from "../config";

import API_CLIENT from "../config";

// Get student profile by ID
export const getStudentProfile = async (studentId) => {
  try {
    const response = await API_CLIENT.get(`/api/students/profile/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

// Get student's enrolled courses
export const getStudentCourses = async (studentId) => {
  try {
    const response = await API_CLIENT.get(`/api/students/${studentId}/courses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student courses:", error);
    throw error;
  }
};

// Get student's test results
export const getStudentResults = async (studentId) => {
  try {
    const response = await API_CLIENT.get(`/api/students/${studentId}/results`);
    return response.data;
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw error;
  }
};

// Get student's following educators
export const getStudentFollowingEducators = async (studentId) => {
  try {
    const response = await API_CLIENT.get(
      `/api/students/${studentId}/following`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching following educators:", error);
    throw error;
  }
};

// Get complete student profile with all related data
export const getCompleteStudentProfile = async (studentId) => {
  try {
    // Fetch all data in parallel for better performance
    const [
      profileResponse,
      coursesResponse,
      resultsResponse,
      educatorsResponse,
    ] = await Promise.allSettled([
      getStudentProfile(studentId),
      getStudentCourses(studentId),
      getStudentResults(studentId),
      getStudentFollowingEducators(studentId),
    ]);

    console.log(
      profileResponse,
      coursesResponse,
      resultsResponse,
      educatorsResponse
    );
    // Extract data from successful responses
    const profile =
      profileResponse.status === "fulfilled" ? profileResponse.value : null;
    const courses =
      coursesResponse.status === "fulfilled"
        ? coursesResponse.value.courses
        : [];
    const results =
      resultsResponse.status === "fulfilled"
        ? resultsResponse.value.results
        : [];
    const educators =
      educatorsResponse.status === "fulfilled"
        ? educatorsResponse.value.educators
        : [];

    if (!profile) {
      throw new Error("Student profile not found");
    }

    return {
      ...profile,
      courses,
      results,
      followingEducators: educators,
    };
  } catch (error) {
    console.error("Error fetching complete student profile:", error);
    throw error;
  }
};

// Update student profile
export const updateStudentProfile = async (studentId, profileData) => {
  try {
    const response = await API_CLIENT.put(
      `/api/students/${studentId}`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error;
  }
};

// Follow an educator
export const followEducator = async (studentId, educatorId) => {
  try {
    const response = await API_CLIENT.post(
      `/api/students/${studentId}/follow`,
      {
        educatorId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error following educator:", error);
    throw error;
  }
};

// Unfollow an educator
export const unfollowEducator = async (studentId, educatorId) => {
  try {
    const response = await API_CLIENT.delete(
      `/api/students/${studentId}/follow/${educatorId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error unfollowing educator:", error);
    throw error;
  }
};

// Enroll in a course
export const enrollInCourse = async (studentId, courseId) => {
  try {
    const response = await API_CLIENT.post(
      `/api/students/${studentId}/enroll`,
      {
        courseId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};
