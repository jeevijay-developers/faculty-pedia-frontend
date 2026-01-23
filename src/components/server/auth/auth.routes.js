import API_CLIENT from "../config";

const extractUserData = (payload = {}, type) => {
  if (!payload) return null;

  const directUser = payload.user || payload.data?.user;
  if (directUser) return directUser;

  if (type === "student") {
    return payload.student || payload.data?.student;
  }

  if (type === "educator") {
    return payload.educator || payload.data?.educator;
  }

  return payload;
};

const extractToken = (payload = {}) =>
  payload.TOKEN ||
  payload.token ||
  payload.accessToken ||
  payload.data?.token ||
  payload.data?.accessToken ||
  payload.data?.tokens?.accessToken ||
  payload.tokens?.accessToken;

const formatAuthResponse = (payload, type) => ({
  ...payload,
  TOKEN: extractToken(payload),
  refreshToken:
    payload?.refreshToken ||
    payload?.data?.refreshToken ||
    payload?.data?.tokens?.refreshToken ||
    payload?.tokens?.refreshToken,
  userType: type,
  userData: extractUserData(payload, type),
});

export const loginStudent = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/login-student", data);
    return response.data;
  } catch (error) {
    // Only log non-authentication errors
    const isAuthError =
      error.response?.status === 400 || error.response?.status === 401;
    if (!isAuthError) {
      console.error("Error during student login:", error);
    }
    throw error;
  }
};

export const signupStudent = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/signup-student", data);
    return response.data;
  } catch (error) {
    const isValidationError =
      error.response?.status === 400 || error.response?.status === 409;
    if (!isValidationError) {
      console.error("Error during student signup:", error);
    }
    throw error;
  }
};

export const signupAsEducator = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/ed-signup", data);
    return response.data;
  } catch (error) {
    // Only log non-validation errors
    const isValidationError =
      error.response?.status === 400 || error.response?.status === 409;
    if (!isValidationError) {
      console.error("Error during educator signup:", error);
    }
    throw error;
  }
};

export const requestEmailVerification = async (data) => {
  const response = await API_CLIENT.post(
    "/api/auth/request-email-verification",
    data
  );
  return response.data;
};

export const requestPreSignupVerification = async (data) => {
  const response = await API_CLIENT.post(
    "/api/auth/request-presignup-verification",
    data
  );
  return response.data;
};

export const resendEmailVerification = async (data) => {
  const response = await API_CLIENT.post(
    "/api/auth/resend-email-verification",
    data
  );
  return response.data;
};

export const verifyEmailCode = async (data) => {
  const response = await API_CLIENT.post("/api/auth/verify-email", data);
  return response.data;
};

// Generic login function that can handle both students and educators
export const loginUser = async (email, password) => {
  try {
    // First try to login as student
    try {
      const studentResponse = await API_CLIENT.post("/api/auth/login-student", {
        email,
        password,
      });

      return formatAuthResponse(studentResponse.data, "student");
    } catch (studentError) {
      // If student login fails with 400/401 (invalid credentials), try educator login
      const isAuthError =
        studentError.response?.status === 400 ||
        studentError.response?.status === 401;

      if (isAuthError) {
        try {
          const educatorResponse = await API_CLIENT.post("/api/auth/ed-login", {
            email,
            password,
          });

          return formatAuthResponse(educatorResponse.data, "educator");
        } catch (educatorError) {
          // Both failed - throw educator error (user is neither student nor educator)
          throw educatorError;
        }
      } else {
        // Network error or server error - throw immediately
        throw studentError;
      }
    }
  } catch (error) {
    // Only log non-authentication errors (network issues, server errors, etc.)
    const isAuthError =
      error.response?.status === 400 || error.response?.status === 401;
    if (!isAuthError) {
      console.error("Error during login:", error);
    }
    throw error;
  }
};

// Legacy functions for backward compatibility
export const loginEducator = async (data) => {
  try {
    const response = await API_CLIENT.post("/api/auth/ed-login", data);
    return response.data;
  } catch (error) {
    // Only log non-authentication errors
    const isAuthError =
      error.response?.status === 400 || error.response?.status === 401;
    if (!isAuthError) {
      console.error("Error during educator login:", error);
    }
    throw error;
  }
};
