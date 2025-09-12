"use client";

import { loginStudent } from "@/components/server/auth/auth.routes";
import { setAuthToken } from "@/utils/auth";
import Login from "@/components/Login-Signup/Login";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import Banner from "@/components/Common/Banner";
import { redirect } from "next/navigation";

const AboutPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleStudentLogin = async (formData, userType) => {
    try {
      console.log("Attempting student login with:", {
        email: formData.email,
        userType,
      });

      // Call the loginStudent API
      const response = await loginStudent({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login successful:", response);

      // Store token using auth utility
      if (response.TOKEN) {
        setAuthToken(response.TOKEN);
        console.log("Token stored successfully");
      }

      // Set redirecting state
      setIsRedirecting(true);

      // Use Next.js router for navigation instead of window.location
      setTimeout(() => {
        router.push("/exams");
      }, 500);

      return response;
    } catch (error) {
      console.error("Login error:", error);
      setIsRedirecting(false);

      // Handle API errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error("Login failed. Please check your credentials.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setMessage("Password reset instructions have been sent to your email.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div>
      <Banner
        url="/images/placeholders/1.svg"
        title="About Faculty Pedia"
        subtitle="Empowering education through technology and dedicated educators"
      />
      {/* <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              Faculty Pedia is dedicated to connecting students with the best
              educators, providing comprehensive learning solutions for
              competitive exams like IIT-JEE, NEET, and CBSE curriculum.
            </p>
            <p className="text-gray-600">
              We believe in personalized education that adapts to each student's
              learning style and pace.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Expert-led live classes</li>
              <li>• Comprehensive test series</li>
              <li>• Interactive webinars</li>
              <li>• Personalized doubt resolution</li>
              <li>• Study material and resources</li>
            </ul>
          </div>
        </div>
      </div> */}
      <Login
        userType="Student"
        onSubmit={handleStudentLogin}
        forgotPasswordLink="/forgot-password/student"
        signupLink="/join-as-student"
        redirectAfterLogin="/student/dashboard"
        isRedirecting={isRedirecting}
      />
      {/* <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Link
            href="/student-login"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Login
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                Enter your email to receive reset instructions
              </p>
            </div>

            {message ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Sending..." : "Send Reset Instructions"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default AboutPage;

export function IITJEEPage() {
  // Redirect to the correct route
  redirect("/exams/iit-jee");
}
