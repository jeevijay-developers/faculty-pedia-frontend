"use client";

import Login from "@/components/Login-Signup/Login";

const StudentLoginPage = () => {
  return (
    <Login
      userType="Student"
      forgotPasswordLink="/forgot-password/student"
      signupLink="/join-as-student"
      redirectAfterLogin="/exams"
    />
  );
};

export default StudentLoginPage;
