"use client";
import { use, useEffect, useState } from "react";
import ViewProfile from "@/components/Educator/ViewProfile";
import AOS from "aos";
import "aos/dist/aos.css";
import Loading from "@/components/Common/Loading";
import { getEducatorProfile } from "@/components/server/educators.routes";

const Page = ({ params }) => {
  const resolvedParams = use(params);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const [educatorData, setEducatorData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resolvedParams?.id) {
      setError("No educator ID provided");
      return;
    }

    // Validate MongoDB ObjectId format (24 hex characters)
    const isValidObjectId = /^[a-f\d]{24}$/i.test(resolvedParams.id);
    if (!isValidObjectId) {
      setError("Invalid educator ID format");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const fetchEducators = async () => {
      try {
        const apiResponse = await getEducatorProfile(resolvedParams.id);

        // Backend returns: { success: true, data: { educator: {...} } }
        // getEducatorProfile returns response.data which gives us the full response object
        let educator = null;

        if (apiResponse?.data?.educator) {
          // Standard backend response: data.educator
          educator = apiResponse.data.educator;
        } else if (apiResponse?.educator) {
          // Direct access to educator
          educator = apiResponse.educator;
        } else if (apiResponse?._id) {
          // Sometimes the educator data is returned directly
          educator = apiResponse;
        } else {
          console.error("✗ Could not extract educator from response");
          throw new Error("Educator data not found in response");
        }

        setEducatorData(educator);
      } catch (error) {
        console.error("✗ Error fetching educator:", error);
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        let errorMessage = "Failed to load educator profile";

        if (error.response?.status === 404) {
          errorMessage =
            "Educator not found. This profile may have been removed.";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, [resolvedParams?.id]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Error Loading Profile
          </p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!educatorData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center max-w-md">
          <p className="text-lg font-semibold text-gray-800">
            Educator profile unavailable
          </p>
          <p className="text-sm text-gray-500 mt-2">
            We could not load the requested educator. Please verify the profile
            link and try again.
          </p>
        </div>
      </div>
    );
  }

  // if (!educatorData) {
  //   notFound();
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <ViewProfile educatorData={educatorData} />
    </div>
  );
};

export default Page;
