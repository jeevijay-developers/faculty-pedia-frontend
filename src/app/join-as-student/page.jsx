"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StudentSignup from "@/components/Login-Signup/StudentSignup";
import { getDashboardUrl, isUserLoggedIn } from "@/utils/userRole";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn()) {
      router.replace(getDashboardUrl());
    }
  }, [router]);

  return (
    <div>
      <StudentSignup />
    </div>
  );
};

export default Page;