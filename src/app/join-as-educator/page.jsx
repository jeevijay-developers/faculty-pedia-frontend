"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EducatorSignup from '@/components/Login-Signup/EducatorSignup'
import { isUserLoggedIn, isEducator } from "@/utils/userRole";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn() && isEducator()) {
      router.replace("/educator/dashboard");
    }
  }, [router]);

  return (
    <div>
      <EducatorSignup />
    </div>
  )
}

export default Page