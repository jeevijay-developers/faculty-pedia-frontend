"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login-Signup/Login";
import { getDashboardUrl, isUserLoggedIn } from "@/utils/userRole";

const GenericLoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.replace(getDashboardUrl());
    }
  }, [router]);

  const handleLoginSuccess = async (userData, userType) => {
    // Handle successful login based on user type
    if (userType === "student") {
      router.replace("/exams");
    } else if (userType === "educator") {
      router.replace(`/profile/educator/${userData._id}`);
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
