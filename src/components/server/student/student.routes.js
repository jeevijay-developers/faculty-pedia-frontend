import API_CLIENT from "../config";

const extractPayload = (response) =>
  response?.data?.data ?? response?.data?.student ?? response?.data;

// ===================== Student CRUD =====================

export const createStudent = async (studentData) => {
  try {
    const response = await API_CLIENT.post("/api/students", studentData);
    return response.data;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
};

export const getStudents = async (params = {}) => {
  try {
    const response = await API_CLIENT.get("/api/students", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const response = await API_CLIENT.get(`/api/students/${studentId}`);
    return extractPayload(response);
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};

export const getStudentStatistics = async (studentId) => {
  try {
    const response = await API_CLIENT.get(
      `/api/students/${studentId}/statistics`
    );
    return extractPayload(response);
  } catch (error) {
    console.error("Error fetching student statistics:", error);
    throw error;
  }
};

export const updateStudentProfile = async (studentId, profileData) => {
  try {
    let payload = profileData;
    let imageFile = null;

    if (profileData instanceof FormData) {
      payload = {};
      profileData.forEach((value, key) => {
        const isFile =
          (typeof File !== "undefined" && value instanceof File) ||
          (typeof Blob !== "undefined" && value instanceof Blob);

        if (isFile) {
          if (key === "image" || key === "profileImage") {
            imageFile = value;
          }
          return;
        }

        payload[key] = value;
      });

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const uploadResponse = await API_CLIENT.post(
          "/api/upload/image",
          uploadData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const imageUrl =
          uploadResponse.data?.imageUrl ||
          uploadResponse.data?.data?.imageUrl ||
          uploadResponse.data?.url;

        if (!imageUrl) {
          throw new Error("Image upload failed. Please try again.");
        }

        payload.image = imageUrl;
        const publicId =
          uploadResponse.data?.publicId || uploadResponse.data?.data?.publicId;
        if (publicId) {
          payload.imagePublicId = publicId;
        }
      }
    }

    const response = await API_CLIENT.put(
      `/api/students/${studentId}`,
      payload
    );

    return {
      success: response.data?.success,
      message: response.data?.message,
      student: response.data?.data,
    };
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error;
  }
};

export const deleteStudent = async (studentId) => {
  try {
    const response = await API_CLIENT.delete(`/api/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

// ===================== Student Relationships =====================

export const enrollInCourse = async (studentId, courseId) => {
  try {
    const response = await API_CLIENT.post(
      `/api/students/${studentId}/enroll`,
      { courseId }
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};

export const followEducator = async (studentId, educatorId) => {
  try {
    const response = await API_CLIENT.post(
      `/api/students/${studentId}/follow`,
      { educatorId }
    );
    return response.data;
  } catch (error) {
    console.error("Error following educator:", error);
    throw error;
  }
};

export const unfollowEducator = async (studentId, educatorId) => {
  try {
    const response = await API_CLIENT.delete(
      `/api/students/${studentId}/unfollow`,
      {
        data: { educatorId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error unfollowing educator:", error);
    throw error;
  }
};

export const registerForWebinar = async (studentId, webinarId) => {
  try {
    const response = await API_CLIENT.post(
      `/api/students/${studentId}/register-webinar`,
      { webinarId }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering for webinar:", error);
    throw error;
  }
};

// ===================== Student Filters =====================

export const getStudentsBySpecialization = async (
  specialization,
  params = {}
) => {
  try {
    const response = await API_CLIENT.get(
      `/api/students/specialization/${specialization}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching students by specialization:", error);
    throw error;
  }
};

export const getStudentsByClass = async (className, params = {}) => {
  try {
    const response = await API_CLIENT.get(
      `/api/students/class/${className}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching students by class:", error);
    throw error;
  }
};

// ===================== Discoverability Helpers =====================

export const getUpcomingWebinars = async (_studentId, params = {}) => {
  try {
    const response = await API_CLIENT.get("/api/webinars/upcoming", {
      params,
    });
    const webinars = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data?.upcomingWebinars)
        ? response.data.upcomingWebinars
        : Array.isArray(response.data)
          ? response.data
          : [];

    return {
      upcomingWebinars: webinars,
      message: response.data?.message,
    };
  } catch (error) {
    console.error("Error fetching upcoming webinars:", error);
    throw error;
  }
};

export const getUpcomingTestSeries = async (_studentId, params = {}) => {
  try {
    const response = await API_CLIENT.get("/api/test-series", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching test series:", error);
    throw error;
  }
};
