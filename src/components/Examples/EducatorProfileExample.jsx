// Example usage of EditEducatorProfileModal in an Educator Profile component
"use client";

import { useState, useEffect } from "react";
import { updateEducatorProfile } from "@/components/server/educators.routes";
import { isEducator, getUserData } from "@/utils/userRole";
import EditEducatorProfileModal from "@/components/Profile/EditEducatorProfileModal";

const EducatorProfileExample = () => {
  const [educatorData, setEducatorData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get educator data from localStorage
    const userData = getUserData();
    if (isEducator() && userData) {
      setEducatorData(userData);
    }
    setIsLoading(false);
  }, []);

  const handleProfileSave = async (formData) => {
    try {
      const educatorId = educatorData?._id;
      if (!educatorId) {
        throw new Error("Educator ID not found");
      }

      const result = await updateEducatorProfile(educatorId, formData);
      
      // Update localStorage with new educator data
      if (result && result.educator) {
        localStorage.setItem(
          "faculty-pedia-educator-data",
          JSON.stringify(result.educator)
        );
        setEducatorData(result.educator);
      }
      
      return result;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isEducator() || !educatorData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-600">Only educators can access this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {educatorData.firstName} {educatorData.lastName}
            </h1>
            <p className="text-gray-600">{educatorData.specialization} Educator</p>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
              {educatorData.image?.url ? (
                <img
                  src={educatorData.image.url}
                  alt={`${educatorData.firstName} ${educatorData.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {educatorData.firstName[0]}{educatorData.lastName[0]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-gray-900">{educatorData.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Mobile</h3>
              <p className="text-gray-900">{educatorData.mobileNumber}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Specialization</h3>
              <p className="text-gray-900">{educatorData.specialization}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Subject</h3>
              <p className="text-gray-900">{educatorData.subject}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Experience</h3>
              <p className="text-gray-900">{educatorData.yearsExperience} years</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
          <p className="text-gray-900 leading-relaxed">{educatorData.bio}</p>
        </div>

        {/* Intro Video Link */}
        {educatorData.introVideoLink && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Intro Video</h3>
            <a
              href={educatorData.introVideoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              {educatorData.introVideoLink}
            </a>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{educatorData.rating || 0}</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{educatorData.followers?.length || 0}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{educatorData.courses?.length || 0}</div>
            <div className="text-sm text-gray-600">Courses</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{educatorData.webinars?.length || 0}</div>
            <div className="text-sm text-gray-600">Webinars</div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditEducatorProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        educatorData={educatorData}
        onSave={handleProfileSave}
      />
    </div>
  );
};

export default EducatorProfileExample;