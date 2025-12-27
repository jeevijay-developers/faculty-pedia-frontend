import API_CLIENT from "../config";

const extractWebinarPayload = (response) => {
  const data = response?.data ?? response;
  return data?.data || data?.webinar || data;
};

const extractPayload = (response) =>
  response?.data?.data ?? response?.data?.student ?? response?.data;

const createHttpError = (status, message) => {
  const error = new Error(message || "Request failed");
  error.response = {
    status,
    data: {
      success: false,
      message: message || "Request failed",
    },
  };
  return error;
};

const isStudentEnrolledInCourse = (student, courseId) => {
  if (!student || !Array.isArray(student.courses)) {
    return false;
  }

  const expectedId =
    typeof courseId === "string"
      ? courseId
      : typeof courseId === "object" &&
        courseId !== null &&
        "toString" in courseId
      ? courseId.toString()
      : `${courseId}`;

  return student.courses.some((enrollment) => {
    if (!enrollment) {
      return false;
    }

    const rawId =
      enrollment.courseId?._id ?? enrollment.courseId ?? enrollment._id;

    if (!rawId) {
      return false;
    }

    const normalizedId =
      typeof rawId === "string"
        ? rawId
        : typeof rawId === "object" && rawId !== null && "toString" in rawId
        ? rawId.toString()
        : `${rawId}`;

    return normalizedId === expectedId;
  });
};

const isStudentEnrolledInLiveClass = (liveClass, studentId) => {
  if (!liveClass || !studentId) return false;

  const list = liveClass.enrolledStudents;
  if (!Array.isArray(list)) return false;

  return list.some((entry) => {
    const idCandidates = [
      typeof entry === "string" ? entry : null,
      entry?.studentId,
      entry?.studentId?._id,
      entry?.studentId?.id,
      entry?.studentID,
      entry?.student,
      entry?.userId,
      entry?.user,
      entry?._id,
      entry?.id,
      entry?.student?._id,
      entry?.student?.id,
    ];

    return idCandidates.some(
      (candidate) => candidate && candidate.toString() === studentId.toString()
    );
  });
};

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

export const getStudentNotifications = async (studentId, params = {}) => {
  if (!studentId) {
    throw createHttpError(400, "Student ID is required");
  }

  try {
    const [listResponse, unreadResponse] = await Promise.all([
      API_CLIENT.get(`/api/notifications/${studentId}`, { params }),
      API_CLIENT.get(`/api/notifications/${studentId}/unread-count`),
    ]);

    const notificationsSource = listResponse?.data;
    const notifications = Array.isArray(notificationsSource?.notifications)
      ? notificationsSource.notifications
      : [];

    return {
      success: notificationsSource?.success ?? true,
      notifications,
      pagination: notificationsSource?.pagination ?? {},
      unreadCount: unreadResponse?.data?.unreadCount ?? 0,
    };
  } catch (error) {
    console.error("Error fetching student notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (studentId, notificationId) => {
  if (!studentId || !notificationId) {
    throw createHttpError(400, "Student ID and notification ID are required");
  }

  try {
    const response = await API_CLIENT.put(
      `/api/notifications/${notificationId}/read`,
      {
        studentId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

const isLikelyObjectId = (value) =>
  typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value.trim());

export const getCourseForStudent = async (studentId, courseIdentifier) => {
  if (!studentId || !courseIdentifier) {
    throw createHttpError(400, "Student ID and course ID are required");
  }

  try {
    const normalizedIdentifier = String(courseIdentifier).trim();
    const useSlugLookup = !isLikelyObjectId(normalizedIdentifier);
    const encodedIdentifier = encodeURIComponent(normalizedIdentifier);

    const [studentResponse, courseResponse] = await Promise.all([
      API_CLIENT.get(`/api/students/${studentId}`),
      useSlugLookup
        ? API_CLIENT.get(`/api/courses/slug/${encodedIdentifier}`)
        : API_CLIENT.get(`/api/courses/${encodedIdentifier}`),
    ]);

    const student = extractPayload(studentResponse);
    if (!student) {
      throw createHttpError(404, "Student not found");
    }

    const courseData =
      courseResponse?.data?.course ??
      courseResponse?.data?.data ??
      courseResponse?.data;
    if (!courseData) {
      throw createHttpError(404, "Course not found");
    }

    const effectiveCourseId =
      typeof courseData === "object" && courseData !== null
        ? courseData._id ?? courseData.id ?? courseData.courseId
        : null;

    if (!effectiveCourseId) {
      throw createHttpError(500, "Course response missing identifier");
    }

    const isEnrolled = isStudentEnrolledInCourse(student, effectiveCourseId);
    if (!isEnrolled) {
      throw createHttpError(403, "You are not enrolled in this course");
    }

    return courseData;
  } catch (error) {
    if (error?.response) {
      throw error;
    }

    throw createHttpError(500, error?.message || "Failed to fetch course");
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
    const response = await API_CLIENT.get(`/api/students/class/${className}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching students by class:", error);
    throw error;
  }
};

// ===================== Webinar helpers =====================

export const getWebinarById = async (webinarId) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(webinarId || "");
    const endpoint = isObjectId
      ? `/api/webinars/${webinarId}`
      : `/api/webinars/slug/${webinarId}`;

    const response = await API_CLIENT.get(endpoint);
    return extractWebinarPayload(response);
  } catch (error) {
    console.error("Error fetching webinar by ID/slug:", error);
    throw error;
  }
};

export const verifyWebinarAttendance = async (webinarId, studentId) => {
  try {
    const webinar = await getWebinarById(webinarId);

    const enrolledList =
      webinar?.studentEnrolled || webinar?.enrolledStudents || [];

    const isEnrolled = Array.isArray(enrolledList)
      ? enrolledList.some((entry) => {
          const id =
            typeof entry === "string"
              ? entry
              : entry?._id || entry?.id || entry?.studentId;
          return id && studentId && id.toString() === studentId.toString();
        })
      : false;

    if (!isEnrolled) {
      const err = new Error(
        "Please enroll in the webinar before accessing links"
      );
      err.response = {
        status: 400,
        data: { message: "Student not enrolled in this webinar" },
      };
      throw err;
    }

    return {
      success: true,
      enrolled: true,
      webinar,
    };
  } catch (error) {
    console.error("Error verifying webinar attendance:", error);
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

// ===================== Live Classes =====================

export const getEnrolledLiveClasses = async (studentId, params = {}) => {
  if (!studentId) {
    throw createHttpError(400, "Student ID is required");
  }

  try {
    const response = await API_CLIENT.get("/api/live-classes", {
      params: { limit: 200, studentId, ...params },
    });

    const rawList =
      response?.data?.data?.liveClasses ??
      response?.data?.liveClasses ??
      response?.data?.data ??
      response?.data ??
      [];

    const liveClasses = Array.isArray(rawList)
      ? rawList
      : Array.isArray(rawList.liveClasses)
      ? rawList.liveClasses
      : [];

    const enrolledLiveClasses = liveClasses
      .filter((item) => isStudentEnrolledInLiveClass(item, studentId))
      .sort((a, b) => {
        const aTime = Date.parse(a?.classTiming || "");
        const bTime = Date.parse(b?.classTiming || "");
        if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
        return aTime - bTime;
      });

    return {
      liveClasses: enrolledLiveClasses,
      total: enrolledLiveClasses.length,
      message: response?.data?.message,
    };
  } catch (error) {
    console.error("Error fetching enrolled live classes:", error);
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

export const getTestSeriesForStudent = async (testSeriesId) => {
  try {
    const response = await API_CLIENT.get(`/api/test-series/${testSeriesId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test series:", error);
    throw error;
  }
};
