import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const EditClassModal = ({
  show,
  onClose,
  onSubmit,
  loading,
  courses,
  classData,
  students,
  onAddStudent,
  onRemoveStudent,
}) => {
  const [formData, setFormData] = useState({
    className: "",
    room: "",
    courseId: "",
  });
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  // Initialize form with classData
  useEffect(() => {
    if (show && classData) {
      setFormData({
        className: classData.className || "",
        room: classData.room || "",
        courseId: classData.courseId?._id || "",
      });
      setSelectedStudentId("");
    }
  }, [show, classData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.className || !formData.room || !formData.courseId) {
      toast.error("All fields are required");
      return;
    }
    await onSubmit(formData);
  };

  const handleAddStudent = async () => {
    if (!selectedStudentId) {
      toast.error("Please select a student to add");
      return;
    }
    await onAddStudent(selectedStudentId);
    setSelectedStudentId("");
  };

  const handleRemoveStudent = async (student) => {
    // Open confirmation modal instead of removing directly
    setStudentToRemove(student);
    setShowConfirmModal(true);
  };

  const confirmRemoveStudent = async () => {
    if (studentToRemove) {
      await onRemoveStudent(studentToRemove.userId?._id);
    }
    setShowConfirmModal(false);
    setStudentToRemove(null);
  };

  const cancelRemoveStudent = () => {
    setShowConfirmModal(false);
    setStudentToRemove(null);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-50 flex justify-center items-center">
      {/* Main Edit Class Modal */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative z-60 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Edit Class</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-700"
            >
              Class Name
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="room"
              className="block text-sm font-medium text-gray-700"
            >
              Room
            </label>
            <input
              type="text"
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="courseId"
              className="block text-sm font-medium text-gray-700"
            >
              Course
            </label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses?.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Student Management */}
          <div className="mt-4">
            <h4 className="text-md font-semibold mb-2">Manage Students</h4>
            <div className="flex gap-2 mb-4">
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a student to add</option>
                {students?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.lastName} {user.firstName} ({user.email})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddStudent}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition disabled:opacity-50"
                disabled={loading}
              >
                Add Student
              </button>
            </div>

            {/* Enrolled Students Table */}
            {classData?.students?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left">
                        Name
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Email
                      </th>
                      <th className="border border-gray-300 p-2 text-left">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {classData.students.map((student) => (
                      <tr key={student.userId?._id || student.email}>
                        <td className="border border-gray-300 p-2">
                          {(student.lastName || "") +
                            " " +
                            (student.firstName || "") || "N/A"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {student.email || "N/A"}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveStudent(student)}
                            className="text-red-600 hover:text-red-800"
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No students enrolled</p>
            )}
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-40 z-70 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <span className="font-medium">
                {(studentToRemove?.lastName || "") +
                  " " +
                  (studentToRemove?.firstName || "") || studentToRemove?.email || "this student"}
              </span>{" "}
              from the class?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelRemoveStudent}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                disabled={loading}
              >
                No
              </button>
              <button
                type="button"
                onClick={confirmRemoveStudent}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Removing..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditClassModal;