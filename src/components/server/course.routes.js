import API_CLIENT from "./config";

export const getCourseById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/course/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    throw error;
  }
};

export const getCourseBySubject = async (subject) => {
  try {
    const response = await API_CLIENT.post(`/api/course/by-subject`, subject);
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by subject:", error);
    throw error;
  }
};
export const getCourseBySubjectOneToOne = async (subject) => {
  try {
    const response = await API_CLIENT.get(
      `/api/course/available-oto-by-subject/${subject}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses by subject:", error);
    throw error;
  }
};
