"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiClock,
  FiFileText,
  FiUsers,
  FiAward,
  FiAlertTriangle,
} from "react-icons/fi";
import { getLiveTestById } from "@/components/server/test/test.routes";

const TestInstructions = ({ testId }) => {
  const router = useRouter();
  const [testData, setTestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setLoading(true);
        const data = await getLiveTestById(testId);
        setTestData(data);
      } catch (err) {
        setError("Failed to load test data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestData();
    }
  }, [testId]);

  const handleStartTest = () => {
    if (!agreed) {
      alert(
        "Please read and agree to the instructions before starting the test."
      );
      return;
    }
    router.push(`/live-test/${testId}/attend`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test instructions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Test
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {testData.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {testData.description.short}
            </p>
          </div>

          {/* Test Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-lg font-semibold">{testData.duration} min</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                <FiFileText className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">Questions</p>
              <p className="text-lg font-semibold">
                {testData.questions.length}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                <FiAward className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="text-lg font-semibold">{testData.subject}</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-2">
                <FiUsers className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-500">Marking</p>
              <p className="text-lg font-semibold">{testData.markingType}</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FiAlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Test Instructions
          </h2>

          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold mb-2">General Instructions:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  The test duration is {testData.duration} minutes. The timer
                  will start once you begin the test.
                </li>
                <li>
                  The test contains {testData.questions.length} multiple-choice
                  questions.
                </li>
                <li>Each question has only one correct answer.</li>
                <li>
                  You can navigate between questions using the Next/Previous
                  buttons or the question palette.
                </li>
                <li>The test will auto-submit when the time expires.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Marking Scheme:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Each correct answer will award positive marks (varies by
                  question).
                </li>
                <li>
                  Each incorrect answer will deduct negative marks (varies by
                  question).
                </li>
                <li>Unattempted questions will receive zero marks.</li>
                <li>
                  The marking scheme for each question is displayed with the
                  question.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Question Palette:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-100 border rounded flex items-center justify-center">
                    1
                  </div>
                  <span>Not Visited</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-200 rounded flex items-center justify-center">
                    2
                  </div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center">
                    3
                  </div>
                  <span>Submitted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">
                    4
                  </div>
                  <span>Current</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">
                Important Notes:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                <li>
                  Do not refresh the page or navigate away during the test.
                </li>
                <li>Ensure you have a stable internet connection.</li>
                <li>
                  Submit each answer individually before moving to the next
                  question.
                </li>
                <li>Once you submit the test, you cannot make any changes.</li>
                <li>Make sure to submit the test before the timer expires.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Series Info */}
        {testData.testSeriesId && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Series Information
            </h2>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {testData.testSeriesId.title}
            </h3>
            <p className="text-gray-600">
              {testData.testSeriesId.description.long}
            </p>
          </div>
        )}

        {/* Agreement and Start */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start space-x-3 mb-6">
            <input
              type="checkbox"
              id="agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="agreement" className="text-sm text-gray-700">
              I have read and understood all the instructions. I agree to the
              terms and conditions and am ready to start the test. I understand
              that once I start, the timer will begin and I cannot pause the
              test.
            </label>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartTest}
              disabled={!agreed}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                agreed
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInstructions;
