"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSignup from "@/components/Login-Signup/StudentSignup";
import { isUserLoggedIn, isStudent } from "@/utils/userRole";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn() && isStudent()) {
      router.replace("/exams");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <StudentSignup />
    </div>
  );
};

export default Page;