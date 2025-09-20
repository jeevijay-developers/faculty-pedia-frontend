// Example component showing how to use role-based rendering
"use client";

import { useEffect, useState } from "react";
import { getUserRole, getUserData, isStudent, isEducator } from "@/utils/userRole";

const RoleBasedComponent = () => {
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user role and data after component mounts
    setUserRole(getUserRole());
    setUserData(getUserData());
  }, []);

  // Loading state while determining user role
  if (userRole === null) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!userRole || !userData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Please log in</h2>
        <a href="/login" className="text-blue-600 hover:underline">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard - {userRole === "student" ? "Student" : "Educator"}
      </h1>
      
      {/* Student-specific content */}
      {isStudent() && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Student Dashboard</h2>
          <p>Welcome back, {userData.name}!</p>
          <div className="mt-4 space-y-2">
            <p>Email: {userData.email}</p>
            <p>Mobile: {userData.mobileNumber}</p>
            <div className="mt-4">
              <h3 className="font-medium">Student Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>View enrolled courses</li>
                <li>Take tests and view results</li>
                <li>Join webinars</li>
                <li>Follow educators</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Educator-specific content */}
      {isEducator() && (
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Educator Dashboard</h2>
          <p>Welcome back, {userData.firstName} {userData.lastName}!</p>
          <div className="mt-4 space-y-2">
            <p>Email: {userData.email}</p>
            <p>Specialization: {userData.specialization}</p>
            <p>Subject: {userData.subject}</p>
            <div className="mt-4">
              <h3 className="font-medium">Educator Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Create and manage courses</li>
                <li>Host live classes</li>
                <li>Create webinars</li>
                <li>Manage test series</li>
                <li>View student analytics</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Common content */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Account Information</h3>
        <div className="text-sm space-y-1">
          <p>Role: {userRole}</p>
          <p>Account Status: Active</p>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedComponent;