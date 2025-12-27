"use client";
import Link from "next/link";

const TrustedBy = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8">
          <div className="bg-blue-600 rounded-lg p-6 md:p-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-1">
                Become a FacultyPedia Educator
              </h3>
              <p className="text-md text-blue-100">
                Share your expertise, inspire learners, and earn for your
                impact. Join our growing network of passionate educators today!
              </p>
            </div>
            <Link
              href="/join-as-educator"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-bold transition-all duration-300 inline-block"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
