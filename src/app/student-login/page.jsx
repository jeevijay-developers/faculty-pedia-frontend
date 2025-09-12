"use client";

import { loginStudent } from "@/components/server/auth/auth.routes";
import { setAuthToken } from "@/utils/auth";
import Login from "@/components/Login-Signup/Login";

const page = () => {
  const handleStudentLogin = async (formData, userType) => {
    try {
      console.log("Attempting student login with:", {
        email: formData.email,
        userType,
      });

      // Call the loginStudent API
      const response = await loginStudent({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response);

      // Store token using auth utility
      if (response.TOKEN) {
        setAuthToken(response.TOKEN);
        console.log("Token stored successfully");
      }

      // Show success message before redirect
      setTimeout(() => {
        // Redirect to student dashboard or appropriate page
        window.location.href = "/exams";
      }, 500);

      return response;
    } catch (error) {
      console.error("Login error:", error);

      // Handle API errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <Login
      userType="Student"
      onSubmit={handleStudentLogin}
      forgotPasswordLink="/forgot-password/student"
      signupLink="/join-as-student"
      redirectAfterLogin="/student/dashboard"
    />
  );
};

export default page;
