'use client';
import { useParams } from 'next/navigation';
import LiveTestResult from '@/components/LiveTest/LiveTestResult';
import { sampleTestResult, sampleTestResults } from '@/Data/TestResult/test-result.data';

const TestResultPage = () => {
  const params = useParams();
  const resultId = params.id;

  // Function to get result by ID
  const getResultById = (id) => {
    if (!id) return sampleTestResult; // Default result
    
    // Check in sample results array first
    const foundResult = sampleTestResults.find(result => result._id === id);
    
    // Check if the ID matches the main sample result
    if (id === sampleTestResult._id) {
      return sampleTestResult;
    }
    
    // If found in array, return it; otherwise return default
    return foundResult || sampleTestResult;
  };

  const resultData = getResultById(resultId);

  // If no result found and ID was provided, show not found
  if (resultId && !getResultById(resultId) && resultId !== sampleTestResult._id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-gray-500 mb-4">
                <h2 className="text-xl font-semibold mb-2">Result Not Found</h2>
                <p>No test result found with ID: {resultId}</p>
              </div>
              <button 
                onClick={() => window.location.href = '/test-result-demo'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Sample Result
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        {resultId && (
          <div className="max-w-6xl mx-auto mb-4 px-4 sm:px-6">
            <div className="text-sm text-gray-600">
              <span>Result ID: </span>
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">{resultId}</code>
            </div>
          </div>
        )}
        <LiveTestResult resultData={resultData} />
      </div>
    </div>
  );
};

export default TestResultPage;
