import React, { useState } from "react";

const EditEnrolledStudentModal = ({
  show,
  onClose,
  onSubmit,
  loading,
  courses,
  currentCourseId,
  userId,
}) => {
  const [newCourseId, setNewCourseId] = useState("");

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCourseId) {
      alert("Please select a course");
      return;
    }
    onSubmit(userId, newCourseId);
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-60">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Change Course for Student
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="newCourse"
              className="block text-sm font-medium text-gray-700"
            >
              Select New Course
            </label>
            <select
              id="newCourse"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses
                ?.filter((course) => course._id !== currentCourseId)
                .map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Change Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEnrolledStudentModal;