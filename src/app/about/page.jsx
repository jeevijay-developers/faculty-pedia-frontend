import React from "react";
import Banner from "@/components/Common/Banner";

const AboutPage = () => {
  return (
    <div>
      <Banner
        url="/images/placeholders/1.svg"
        title="About Faculty Pedia"
        subtitle="Empowering education through technology and dedicated educators"
      />
      <div className="max-w-7xl mx-auto px-4 py-12">
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
      </div>
    </div>
  );
};

export default AboutPage;
