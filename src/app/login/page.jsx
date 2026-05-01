"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Login-Signup/Login";
import { getDashboardUrl, isUserLoggedIn, getUserRole } from "@/utils/userRole";

const GenericLoginPage = () => {
  const router = useRouter();
  const [allowEducatorFallback, setAllowEducatorFallback] = useState(true);

  useEffect(() => {
    // Only on client-side
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes("join-as-student")) {
      setAllowEducatorFallback(false);
    }

    if (isUserLoggedIn()) {
      // Prevent auto-redirect to educator dashboard unless coming from educator signup
      // or if they are just re-visiting the login page normally (not coming from student signup)
      const referrer = document.referrer.toLowerCase();
      if (referrer.includes("join-as-student") && getUserRole() === "educator") {
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
      allowEducatorFallback={allowEducatorFallback}
    />
  );
};

export default GenericLoginPage;
