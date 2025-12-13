"use client";
import API_CLIENT from "../../config";

// fetch educators of IIT JEE
export const fetchIITJEEEducators = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/educator/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// fetch educators of IIT JEE
export const fetchIITJEEOnlineCourses = async (specialization, params = {}) => {
  try {
    const queryParams = {
      limit: 100,
      ...params,
    };

    if (specialization && specialization !== "All") {
      queryParams.specialization = specialization;
    }

    const response = await API_CLIENT.get("/api/courses", {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
export const fetchIITJEEWebinars = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/webinars/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch webinars by specialization using GET with query params
export const fetchWebinarsBySpecialization = async (specialization, params = {}) => {
  try {
    const queryParams = {
      limit: 100,
      ...params
    };
    
    if (specialization && specialization !== "All") {
      queryParams.specialization = specialization;
    }
    
    const response = await API_CLIENT.get("/api/webinars", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching webinars:", error);
    throw error;
  }
};

// Fetch all webinars
export const fetchAllWebinars = async (params = {}) => {
  try {
    const queryParams = {
      limit: 100,
      ...params
    };
    const response = await API_CLIENT.get("/api/webinars", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching webinars:", error);
    throw error;
  }
};

// Fetch webinar by ID
export const fetchWebinarById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/webinars/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching webinar:", error);
    throw error;
  }
};
export const fetchIITJEETestSeries = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/test-series/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch test series by specialization using GET with query params
export const fetchTestSeriesBySpecialization = async (specialization, params = {}) => {
  try {
    const queryParams = {
      limit: 100,
      ...params
    };
    
    if (specialization && specialization !== "All") {
      queryParams.specialization = specialization;
    }
    
    const response = await API_CLIENT.get("/api/test-series", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching test series:", error);
    throw error;
  }
};

// Fetch all test series
export const fetchAllTestSeries = async (params = {}) => {
  try {
    const queryParams = {
      limit: 100,
      ...params
    };
    const response = await API_CLIENT.get("/api/test-series", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching test series:", error);
    throw error;
  }
};

// Fetch test series by ID
export const fetchTestSeriesById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/test-series/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test series:", error);
    throw error;
  }
};
export const fetchIITJEEBlogs = async (specialization = "IIT-JEE") => {
  try {
    const response = await API_CLIENT.get(
      `/api/posts/specialization/${specialization}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};
export const fetchOneToOneCourses = async (body) => {
  try {
    const response = await API_CLIENT.get("/api/course/available-oto");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch live classes by specialization
export const fetchLiveClassesBySpecialization = async (specialization, params = {}) => {
  try {
    const queryParams = {
      specification: specialization,
      limit: 100,
      ...params
    };
    const response = await API_CLIENT.get("/api/live-classes", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching live classes:", error);
    throw error;
  }
};

// Fetch all live classes
export const fetchAllLiveClasses = async (params = {}) => {
  try {
    const queryParams = {
      limit: 100,
      ...params
    };
    const response = await API_CLIENT.get("/api/live-classes", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching live classes:", error);
    throw error;
  }
};

// Fetch live class by ID
export const fetchLiveClassById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/live-classes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching live class:", error);
    throw error;
  }
};

// Fetch Pay Per Hour (OTO) courses by specialization
export const fetchPPHCoursesBySpecialization = async (specialization, params = {}) => {
  try {
    const queryParams = {
      courseType: "OTO", // One-to-One courses (Pay Per Hour)
      specialization: specialization,
      limit: 100,
      ...params
    };
    
    const response = await API_CLIENT.get("/api/courses", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching PPH courses:", error);
    throw error;
  }
};

// Fetch educators with Pay Per Hour availability by specialization
export const fetchPPHEducatorsBySpecialization = async (specialization, params = {}) => {
  try {
    const response = await API_CLIENT.get(`/api/educators/specialization/${specialization}`, {
      params: {
        limit: 100,
        ...params
      }
    });
    
    // Filter educators who have payPerHourFee set and greater than 0
    const educators = response.data?.data?.educators || [];
    const pphEducators = educators.filter(educator => educator.payPerHourFee && educator.payPerHourFee > 0);
    
    return {
      educators: pphEducators,
      pagination: response.data?.data?.pagination || {}
    };
  } catch (error) {
    console.error("Error fetching PPH educators:", error);
    throw error;
  }
};

// Fetch all OTO (Pay Per Hour) courses
export const fetchAllPPHCourses = async (params = {}) => {
  try {
    const queryParams = {
      courseType: "OTO",
      limit: 100,
      ...params
    };
    const response = await API_CLIENT.get("/api/courses", { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching all PPH courses:", error);
    throw error;
  }
};

// Fetch OTO course by ID
export const fetchPPHCourseById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching PPH course:", error);
    throw error;
  }
};

// Fetch educator by ID
export const fetchEducatorById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/educators/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching educator:", error);
    throw error;
  }
};

// Fetch post by ID
export const fetchPostById = async (id) => {
  try {
    const response = await API_CLIENT.get(`/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
};

