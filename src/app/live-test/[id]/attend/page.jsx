"use client";

import { useParams } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import LiveTest from "@/components/LiveTest/LiveTest";

const LiveTestAttendPage = () => {
  const params = useParams();
  const testId = params.id ?? "68b805cfe02dc6d694a2f691";

  if (!testId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Invalid Test
          </h2>
          <p className="text-gray-600">
            Test ID is required to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <LiveTest testId={testId} />;
};

export default LiveTestAttendPage;
