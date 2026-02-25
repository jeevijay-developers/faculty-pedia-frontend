import API_CLIENT from "./config";

/**
 * Toggle video completion status for a student
 * @param {string} studentId - Student ID
 * @param {string} courseId - Course ID
 * @param {string} videoId - Video ID (can be _id or URL)
 * @param {boolean} [isCompleted] - Optional: explicitly set completion status
 * @returns {Promise<{success: boolean, data: {videoId: string, isCompleted: boolean, completedAt: string}}>}
 */
export const toggleVideoComplete = async (studentId, courseId, videoId, isCompleted) => {
  const response = await API_CLIENT.post("/api/progress/video/complete", {
    studentId,
    courseId,
    videoId,
    ...(typeof isCompleted === "boolean" ? { isCompleted } : {}),
  });
  return response?.data || response;
};

/**
 * Get course progress for a student
 * @param {string} courseId - Course ID
 * @param {string} studentId - Student ID
 * @returns {Promise<{success: boolean, data: {courseId: string, studentId: string, completedVideos: Object, completedCount: number}}>}
 */
export const getCourseProgress = async (courseId, studentId) => {
  const response = await API_CLIENT.get(
    `/api/progress/course/${courseId}/student/${studentId}`
  );
  return response?.data || response;
};

const progressRoutes = {
  toggleVideoComplete,
  getCourseProgress,
};

export default progressRoutes;
