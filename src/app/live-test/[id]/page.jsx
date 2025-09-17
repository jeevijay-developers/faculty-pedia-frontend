"use client";

import { useParams } from "next/navigation";
import TestInstructions from "@/components/LiveTest/TestInstructions";

const TestInstructionsPage = () => {
  const params = useParams();
  const testId = params.id;

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

  return <TestInstructions testId={testId} />;
};

export default TestInstructionsPage;
