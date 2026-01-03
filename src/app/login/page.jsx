"use client";

import { useRouter } from "next/navigation";
import Login from "@/components/Login-Signup/Login";

const GenericLoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = async (userData, userType) => {
    // Handle successful login based on user type
    if (userType === "student") {
      router.push("/exams");
    } else if (userType === "educator") {
      router.push(`/profile/educator/${userData._id}`);
    }
  };

  return (
    <Login
      title="Welcome Back"
      forgotPasswordLink="/forgot-password"
      signupLink="/join-as-student"
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

export default GenericLoginPage;
