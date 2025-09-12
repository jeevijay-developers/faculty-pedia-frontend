import API_CLIENT from "../config";

export const signupAsStudent = async (data) => {
  try {
    console.log(data);

    const response = await API_CLIENT.post("/api/auth/signup-student", data);
    return response.data;
  } catch (error) {
    console.error("Error during student signup:", error);
    throw error;
  }
};
export const loginStudent = async (data) => {
  try {
    // console.log(data);

    const response = await API_CLIENT.post("/api/auth/login-student", data);
    return response.data;
  } catch (error) {
    console.error("Error during student signup:", error);
    throw error;
  }
};

export const signupAsEducator = async (data) => {
  try {
    console.log(data);

    const response = await API_CLIENT.post("/api/auth/signup-educator", data);
    return response.data;
  } catch (error) {
    console.error("Error during educator signup:", error);
    throw error;
  }
};
