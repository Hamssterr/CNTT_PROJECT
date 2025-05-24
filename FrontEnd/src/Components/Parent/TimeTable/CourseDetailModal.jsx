import React from "react";

const CourseDetailModal = ({ course, onClose }) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-indigo-700">
            {course.courseTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          <p>
            <strong className="text-gray-600">Instructor:</strong>{" "}
            {course.instructor}
          </p>
          <p>
            <strong className="text-gray-600">Room:</strong> {course.roomNumber}
          </p>
          <p>
            <strong className="text-gray-600">Timing:</strong> {course.timing}
          </p>
          <p>
            <strong className="text-gray-600">Date:</strong>{" "}
            {course.nextClassDay}
          </p>
          <p>
            <strong className="text-gray-600">Category:</strong>{" "}
            {course.category}
          </p>
          <p>
            <strong className="text-gray-600">Level:</strong> {course.level}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CourseDetailModal;
