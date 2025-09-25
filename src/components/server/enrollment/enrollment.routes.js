import API_CLIENT from "../server/config";

/**
 * Enrollment API functions
 */

export const subscribeToCourse = async (studentId, courseId) => {
  try {
    const response = await API_CLIENT.post("/api/subscribe-course", {
      studentId,
      courseId,
    });
    return response.data;
  } catch (error) {
    console.error("Error subscribing to course:", error);
    throw error;
  }
};

export const subscribeToTestSeries = async (studentId, testSeriesId) => {
  try {
    const response = await API_CLIENT.post("/api/subscribe-testseries", {
      studentId,
      testSeriesId,
    });
    return response.data;
  } catch (error) {
    console.error("Error subscribing to test series:", error);
    throw error;
  }
};

export const subscribeToWebinar = async (studentId, webinarId) => {
  try {
    const response = await API_CLIENT.post("/api/subscribe-webinar", {
      studentId,
      webinarId,
    });
    return response.data;
  } catch (error) {
    console.error("Error subscribing to webinar:", error);
    throw error;
  }
};

export const subscribeToLiveClass = async (studentId, liveClassId) => {
  try {
    const response = await API_CLIENT.post("/api/subscribe-liveclass", {
      studentId,
      liveClassId,
    });
    return response.data;
  } catch (error) {
    console.error("Error subscribing to live class:", error);
    throw error;
  }
};

// Legacy enrollment function for backward compatibility
export const enrollStudentInCourse = async (studentId, courseId) => {
  try {
    const response = await API_CLIENT.post(
      `/api/live-courses/enroll-student/${studentId}/course/${courseId}/enroll`
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling student in course:", error);
    throw error;
  }
};