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
      const dashboardUrl =
        process.env.NEXT_PUBLIC_EDUCATOR_DASHBOARD_URL || "/educator/dashboard";
      // If external domain, push via location to ensure cookie/localStorage are usable
      if (dashboardUrl.startsWith("http")) {
        window.location.href = dashboardUrl;
      } else {
        router.push(dashboardUrl);
      }
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
