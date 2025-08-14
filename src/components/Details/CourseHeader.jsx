import React from "react";

const CourseHeader = ({ course }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <img
            src={course.image?.url || "/images/placeholders/1.svg"}
            alt={course.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-gray-600">{course.description.shortDesc}</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Specialization</p>
              <p className="font-medium">{course.specialization}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="font-medium">{course.courseClass}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Course Type</p>
              <p className="font-medium">{course.courseType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{course.classDuration} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fees</p>
              <p className="font-medium">₹{course.fees}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
