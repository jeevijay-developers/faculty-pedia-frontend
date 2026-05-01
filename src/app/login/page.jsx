"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login-Signup/Login";
import { getDashboardUrl, isUserLoggedIn, getUserRole } from "@/utils/userRole";

const GenericLoginPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (isUserLoggedIn()) {
      // Don't auto-redirect an educator who ended up on the student login page
      if (getUserRole() === "educator") {
        return;
      }

      const dashboardUrl = getDashboardUrl();
      if (dashboardUrl.startsWith("http")) {
        window.location.href = dashboardUrl;
      } else {
        router.replace(dashboardUrl);
      }
    }
  }, [router]);

  const handleLoginSuccess = async (userData, userType) => {
    // Handle successful login based on user type
    if (userType === "student") {
      router.replace("/");
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
      restrictToRole="student"
    />
  );
};

export default GenericLoginPage;
